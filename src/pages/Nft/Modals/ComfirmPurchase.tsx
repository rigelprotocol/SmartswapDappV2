import { Box, Button, Divider,
    Flex, Image, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalHeader, ModalOverlay,
    Select, Text, useColorModeValue } from '@chakra-ui/react'
import React, {useEffect, useState} from 'react';
import { useNFTAllowance, TokenProps} from "../../../hooks/useNFT";
import {getERC20Token} from "../../../utils/utilsFunctions";
import {setOpenModal, TrxState} from "../../../state/application/reducer";
import {BUSD, SMARTSWAPNFT} from "../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../utils/getExplorerLink";
import {addToast} from "../../../components/Toast/toastSlice";
import {useActiveWeb3React} from "../../../utils/hooks/useActiveWeb3React";
import {useDispatch, useSelector} from "react-redux";
import {RigelNFT} from "../../../utils/Contracts";
import {getNftToken} from "../../../state/nft/hooks";
import {RootState} from "../../../state";
import {formatAmount} from "../../../utils/hooks/useAccountHistory";
import {ethers} from "ethers";


type comfirmPurchaseModalProps = {
    isOpen: boolean,
    close: () => void,
    id: number
}

const ComfirmPurchase = ({ isOpen, close, id }: comfirmPurchaseModalProps) => {
    const { chainId, library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    const [currency, setCurrency] = useState('');
    const [checkTokenApproval, setCheckTokenApproval] = useState(0);
    const [firstToken, setFirstToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [secondToken, setSecondToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [prices, setPrices] = useState({firstTokenPrice: '', secondTokenPrice: ''});
    const [unsoldItems, setUnsoldItems] = useState<number>();
    const [nftId, setNftId] = useState<number[]>([]);
    const dispatch = useDispatch();

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

     useEffect(() => {
       const nftArray = getNftToken(id);
       setNftId(nftArray);

       const fetchNftData = async () => {
           try {
               const nftContract = await RigelNFT(SMARTSWAPNFT[chainId as number], library);

               const purchaseData = await nftContract.nftPurchaseData(nftArray[0]);
               console.log(purchaseData);

               setPrices({firstTokenPrice: formatAmount(purchaseData.token1Price, 18),
                   secondTokenPrice: formatAmount(purchaseData.token2Price, 18)});

               const tokenOne = await getERC20Token(purchaseData.token1, library);
               const [tokenOneSymbol, tokenOneBalance] = await Promise.all(
                   [tokenOne.symbol(), tokenOne.balanceOf(account)]);
               setFirstToken({symbol: tokenOneSymbol,
                   balance: parseFloat(ethers.utils.formatEther(tokenOneBalance)).toFixed(4),
                   address: purchaseData.token1});

               const tokenTwo = await getERC20Token(purchaseData.token2, library);
               const [tokenTwoSymbol, tokenTwoBalance] = await Promise.all(
                   [tokenTwo.symbol(), tokenTwo.balanceOf(account)]);
               setSecondToken({symbol: tokenTwoSymbol,
                   balance: parseFloat(ethers.utils.formatEther(tokenTwoBalance)).toFixed(4),
                   address: purchaseData.token2});

               const allID = nftArray;
               console.log(allID[0]);
               console.log(allID.slice(-1)[0]);

               for (let i = allID[0]; i <= allID.slice(-1)[0]; i++) {
                   const views = await nftContract.sold(i);
                   if (!views) {
                       setUnsoldItems(i);
                       console.log(i);
                       break;
                   }
               }

           } catch (e) {
               console.log(e.message)
           }

       };
       fetchNftData();

     }, [chainId, account, isOpen]);

     const [error, setError] = useState('');

     useEffect(() => {
         if (currency === firstToken.symbol && parseFloat(firstToken.balance) < parseFloat(prices.firstTokenPrice)) {
             setError(`Insufficient ${firstToken.symbol}`)
         } else if (currency === secondToken.symbol && parseFloat(secondToken.balance) < parseFloat(prices.secondTokenPrice)) {
             setError(`Insufficient ${secondToken.symbol}`)
         } else {
             setError('')
         }
     }, [currency]);


    const {hasTokenABeenApproved, hasTokenBBeenApproved} = useNFTAllowance(checkTokenApproval, prices.firstTokenPrice,
        prices.secondTokenPrice, currency, nftId[0]);

    const approveTokens = async (address: string, symbol: string) => {
        if (account) {
            const token = await getERC20Token(address, library);
            try {
                dispatch(
                    setOpenModal({
                        message: `${symbol} Approval`,
                        trxState: TrxState.WaitingForConfirmation,
                    })
                );
                const walletBal = (await token.balanceOf(account)) + 4e18;
                const approval = await token.approve(
                    SMARTSWAPNFT[chainId as number],
                    walletBal,
                    {
                        from: account,
                    }
                );
                const { confirmations } = await approval.wait(1);
                const { hash } = approval;
                if (confirmations >= 1) {
                    const explorerLink = getExplorerLink(
                        chainId as number,
                        hash,
                        ExplorerDataType.TRANSACTION
                    );
                    setCheckTokenApproval(checkTokenApproval + 1);
                    dispatch(
                        setOpenModal({
                            message: `${symbol} Approval Successful`,
                            trxState: TrxState.TransactionSuccessful,
                        })
                    );
                    dispatch(
                        addToast({
                            message: `Approve ${symbol}`,
                            URL: explorerLink,
                        })
                    );
                }
            } catch (err) {
                console.log(err);
                dispatch(
                    setOpenModal({
                        message: `${symbol} Approval`,
                        trxState: TrxState.TransactionFailed,
                    })
                );
            }
        }
    };

    const buyNFT = async () => {
        if (account) {
            try {
                dispatch(
                    setOpenModal({
                        message: `Purchasing NFT`,
                        trxState: TrxState.WaitingForConfirmation,
                    })
                );
                const nftContract = await RigelNFT(SMARTSWAPNFT[chainId as number], library);
                const data = await nftContract.buy(unsoldItems, currency === 'BUSD' ? firstToken.address : secondToken.address);

                const { confirmations } = await data.wait(3);
                const { hash } = data;

                if (confirmations >= 3) {
                    const explorerLink = getExplorerLink(
                        chainId as number,
                        hash,
                        ExplorerDataType.TRANSACTION
                    );

                    dispatch(
                        setOpenModal({
                            message: "Transaction Successful",
                            trxState: TrxState.TransactionSuccessful,
                        })
                    );
                    dispatch(
                        addToast({
                            message: `NFT Successfully Purchased`,
                            URL: explorerLink,
                        })
                    );
                }


            } catch (e) {
                console.log(e);
                dispatch(
                    setOpenModal({
                        message: `Transaction Failed`,
                        trxState: TrxState.TransactionFailed,
                    })
                );
            }
        }
    };

  return (
        <Modal isOpen={isOpen} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textColor={textColor}>Confirm Purchase</ModalHeader>
                <ModalCloseButton />
                <Divider marginTop={'-1.5'}  borderColor={'#DEE5ED'} />
                <ModalBody>
                    <Box
                        marginTop={4}
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={'#DEE5ED'}
                        padding="25px 0"
                        fontWeight="normal"
                        borderRadius={8}
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <Image width={54} height={54} src='https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png' alt="logo" />
                            <Text paddingTop={3} fontSize={20} color={textColor} >NFT Name</Text>

                            <Text paddingTop={3} fontSize={20} color={textColor} >NFT ID: {id}</Text>

                            <Text paddingTop={2} textColor={textColor} > <span style={{color: lightTextColor}}>Created by:</span>  RigelProtocol</Text>
                        </Flex>
                    </Box>
                    <Box
                       // padding={3}
                        borderWidth="1px"
                        borderColor={'#DEE5ED'}
                        fontWeight="normal"
                        marginTop={4}
                        borderRadius={8}
                    >

                        <Select placeholder={'Choose Token to Pay With'}
                                value={currency}
                                onChange={(e) => {
                            setCurrency(e.target.value)
                        }}>
                            <option value={firstToken.symbol}>{firstToken.symbol} - {firstToken.balance}</option>
                            <option value={secondToken.symbol}>{secondToken.symbol} - {secondToken.balance}</option>
                        </Select>

                    </Box>

                    <Box
                        padding={3}
                        borderWidth="1px"
                        borderColor={'#DEE5ED'}
                        fontWeight="normal"
                        marginTop={4}
                        borderRadius={8}
                    >
                        {currency === 'BUSD' ?
                            <Flex mt="1" justifyContent="space-between" alignContent="center">
                                <Text color={lightTextColor} >Price</Text>
                                <Text textColor={textColor}>{prices.firstTokenPrice} {firstToken.symbol}</Text>
                            </Flex>
                            :
                            <Flex mt="1" justifyContent="space-between" alignContent="center">
                                <Text color={lightTextColor} >Price</Text>
                                <Text textColor={textColor}>{prices.secondTokenPrice} USDT</Text>
                            </Flex>
                        }
                        <Flex mt="1" justifyContent="space-between" alignContent="center">
                            <Text></Text>
                            <Text color={lightTextColor} > ≈ </Text>
                        </Flex>
                    </Box>
                    {currency === firstToken.symbol && !hasTokenABeenApproved ?
                            <Button
                                mt={5}
                                mb={2}
                                w={'full'}
                                variant='brand'
                                color={'white'}
                                boxShadow={'0 5px 20px 0px rgba(24, 39, 75, 0.06),'}
                                _hover={{bg: 'blue.500'}}
                                _focus={{bg: 'blue.500'}}
                                onClick={() => approveTokens(firstToken.address, firstToken.symbol)}
                            >
                                 Approve {firstToken.symbol}
                            </Button>
                        : currency === secondToken.symbol && !hasTokenBBeenApproved ?
                            <Button
                                mt={5}
                                mb={2}
                                w={'full'}
                                variant='brand'
                                color={'white'}
                                boxShadow={'0 5px 20px 0px rgba(24, 39, 75, 0.06),'}
                                _hover={{bg: 'blue.500'}}
                                _focus={{bg: 'blue.500'}}
                                onClick={() => approveTokens(secondToken.address, secondToken.symbol)}
                            >
                                 Approve {secondToken.symbol}
                            </Button>
                            :
                            <Button
                                mt={5}
                                mb={2}
                                w={'full'}
                                variant='brand'
                                color={'white'}
                                disabled={currency === '' || error !== ''}
                                boxShadow={'0 5px 20px 0px rgba(24, 39, 75, 0.06),'}
                                _hover={{bg: 'blue.500'}}
                                _focus={{bg: 'blue.500'}}
                                onClick={() => buyNFT()}
                            >
                                {error ? error : 'Buy Now'}
                            </Button>
                    }

                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default ComfirmPurchase
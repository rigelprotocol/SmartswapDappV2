import {
    Box, Button, Divider,
    Flex, Image, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalHeader, ModalOverlay,
    Select, Spinner, Text, useColorModeValue
} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react';
import {useNft, useNFTAllowance} from "../../../hooks/useNFT";
import {getERC20Token} from "../../../utils/utilsFunctions";
import {setOpenModal, TrxState} from "../../../state/application/reducer";
import {SMARTSWAPNFTSALES} from "../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../utils/getExplorerLink";
import {addToast} from "../../../components/Toast/toastSlice";
import {useActiveWeb3React} from "../../../utils/hooks/useActiveWeb3React";
import {useDispatch} from "react-redux";
import {RigelNFT} from "../../../utils/Contracts";
import { GNFTFailedApprovalTransaction, GNFTFailedTransaction, GNFTSuccessfullyApprovalTransaction, GNFTSuccessfullyTransaction } from '../../../components/G-analytics/gNFTs';
import { Web3Provider } from '@ethersproject/providers';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { Percent } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { ethers } from 'ethers';
import { useUserGasPricePercentage } from '../../../state/gas/hooks';
import { calculateGas } from '../../Swap/components/sendToken';


type comfirmPurchaseModalProps = {
    isOpen: boolean,
    close: () => void,
    id: number,
    image: string,
    name: string,
    mint?:boolean
}

const ComfirmPurchase = ({ isOpen,
                             close, id, image, name, mint }:
                             comfirmPurchaseModalProps) => {
    const { chainId, library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    const [currency, setCurrency] = useState('');
    const [checkTokenApproval, setCheckTokenApproval] = useState(0);
    const dispatch = useDispatch();
    const {firstToken, secondToken, prices, unsoldItems, nftId} = useNft(id);
    const {hasTokenABeenApproved, hasTokenBBeenApproved, loadInfo} = useNFTAllowance(checkTokenApproval, prices.firstTokenPrice, currency, nftId[0],firstToken.address,secondToken.address);

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
                const walletBal = (await token.balanceOf(account));
                const approval = await token.approve(
                    SMARTSWAPNFTSALES[chainId as number],
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
                    GNFTSuccessfullyApprovalTransaction(
                        "NFT",
                        "approving token",
                        symbol)

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
            } catch (err:any) {
                console.log(err);
                GNFTFailedApprovalTransaction(
                    "NFT",
                    "approving token",
                    err.message,
                    symbol);
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
                console.log({firstToken,secondToken})

                const isEIP1559 = await library?.getFeeData();
                // const { format1, format2, format3 } = await calculateGas(
                //     useUserGasPricePercentage,
                //     library,
                //     chainId as number
                //   );
                const nftContract = await RigelNFT(SMARTSWAPNFTSALES[chainId as number], library);
                // const data = await nftContract._mintBatch(account,["1"],["1"], "0x0000000000000000000000000000000000000000000000000000000000000000")
                console.log({firstToken,secondToken})
                const data = await nftContract.mint(id, currency === 'USDT' ?  secondToken.address : firstToken.address)

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
                    GNFTSuccessfullyTransaction(
                        "NFT",
                        "purchasing NFT",
                        currency==="USDT"? "USDT": "BUSD",
                        name,
                        image)

                    dispatch(
                        addToast({
                            message: `Successfully Purchased RIGEL GIFT CARD ${id} NFT`,
                            URL: explorerLink,
                        })
                    );
                    close();
                }


            } catch (e:any) {
                console.log(e);
                GNFTFailedTransaction(
                    "NFT",
                    "purchasing NFT",
                    e.message,
                    currency==="USDT"? "USDT": "BUSD",
                    name,
                    image)
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

                            <Image width={54} height={54} src={image} alt="logo" />
                            <Text paddingTop={3} fontSize={20} color={textColor} >{name}</Text>

                            <Text paddingTop={3} fontSize={20} color={textColor} >NFT ID: {id}</Text>

                            <Text paddingTop={2} textColor={textColor} > <span style={{color: lightTextColor}}>Created by:</span>  RigelProtocol</Text>
                        </Flex>
                    </Box>
                    <Box
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
                        {currency !== 'USDT' ?
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
                            <Text/>
                            <Text color={lightTextColor} > ≈ </Text>
                        </Flex>
                    </Box>
                    {
                    error 
                    ? 
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
                                {error}
                            </Button>

                        : 
                        currency === firstToken.symbol && !hasTokenABeenApproved ?
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
                            : loadInfo ?
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
                                >
                                    <Spinner speed="0.65s" />
                                </Button>
                                :
                            <Button
                                mt={5}
                                mb={2}
                                w={'full'}
                                variant='brand'
                                color={'white'}
                                disabled={currency === '' || error !== '' || !mint}
                                boxShadow={'0 5px 20px 0px rgba(24, 39, 75, 0.06),'}
                                _hover={{bg: 'blue.500'}}
                                _focus={{bg: 'blue.500'}}
                                onClick={() => buyNFT()}
                            >
                                Buy Now
                            </Button>
                    }

                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default React.memo(ComfirmPurchase)
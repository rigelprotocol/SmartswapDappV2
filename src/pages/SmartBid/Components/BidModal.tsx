import {
    Box,
    Button,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Spinner,
    Text,
    useColorModeValue
} from '@chakra-ui/react'
import React, {useMemo, useState, useEffect} from 'react';
import {getERC20Token} from "../../../utils/utilsFunctions";
import {setOpenModal, TrxState} from "../../../state/application/reducer";
import {SMARTBID2} from "../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../utils/getExplorerLink";
import {addToast} from "../../../components/Toast/toastSlice";
import {useActiveWeb3React} from "../../../utils/hooks/useActiveWeb3React";
import {useDispatch} from "react-redux";
import {useBidAllowance} from "../../../hooks/useSmartBid";
import {useRGPBalance} from "../../../utils/hooks/useBalances";
import {ethers} from "ethers";
import {RigelSmartBidTwo} from "../../../utils/Contracts";
import {ZERO_ADDRESS} from "../../../constants";
import {escapeRegExp} from "../../../utils";
import {RiErrorWarningLine} from "react-icons/all";

type BidModalProps = {
    isOpen: boolean,
    close: () => void,
    id: number,
    amount: string,
    max: string
};

const BidModal = ({isOpen, close, id, amount, max} : BidModalProps) => {
    const { chainId, library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    const [checkTokenApproval, setCheckTokenApproval] = useState(0);
    const dispatch = useDispatch();

    const {hasTokenABeenApproved, loadInfo} = useBidAllowance(checkTokenApproval, amount, isOpen, id);

    const [RGPBalance] = useRGPBalance();

    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");

    const [stakeBid, setStakeBid] = useState('');
    const [error, setError] = useState('');
    const [tokenInfo, setTokenInfo] = useState({symbol: '', balance: '', decimals: ''});
    const [tokenAddress, setTokenAddress] = useState('');

    const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

    const enforcer = (nextUserInput: string) => {
        if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
            setStakeBid(nextUserInput);
        }
    };

    useMemo(() => {
        if (stakeBid === '') {
            return;
        }
        else if (Number(stakeBid) > Number(ethers.utils.formatUnits(max , tokenInfo.decimals)) || Number(stakeBid) < Number(ethers.utils.formatUnits(amount, tokenInfo.decimals))) {
            setError(`The limit is ${ethers.utils.formatUnits(amount, tokenInfo.decimals)} ${tokenInfo.symbol} - ${ethers.utils.formatUnits(max , tokenInfo.decimals)} ${tokenInfo.symbol}`)
        } else {
            setError('');
        }
    }, [stakeBid]);

    const checkEvents = async () => {
        const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);

        bidContract.on('bidding', (userAddress, pid, stakedAmount, time) => {
            console.log('Event here!');
            console.log(userAddress, pid.toString(), amount.toString(), time.toString())
        });
    };


    useMemo(() => {
        const getTokenData = async () => {

            try {
                const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                const bidToken = await bidContract.requestToken(id);
                setTokenAddress(bidToken._token);

                const token = await getERC20Token(bidToken._token, library);

                const [tokenSymbol, tokenBalance, tokenDecimals] = await Promise.all(
                    [token.symbol(), token.balanceOf(account), token.decimals()]);
                setTokenInfo({symbol: tokenSymbol, balance: tokenBalance, decimals: tokenDecimals});

            } catch (e) {
                console.log(e)
            }
        };
        getTokenData();
    }, []);


    const approveTokens = async () => {
        if (account) {
            try {
                dispatch(
                    setOpenModal({
                        message: `Approve Token`,
                        trxState: TrxState.WaitingForConfirmation,
                    })
                );

                const token = await getERC20Token(tokenAddress, library);

                const approval = await token.approve(
                    SMARTBID2[chainId as number],
                    tokenInfo.balance,
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
                            message: `${tokenInfo.symbol} Approval Successful`,
                            trxState: TrxState.TransactionSuccessful,
                        })
                    );
                    close();

                    dispatch(
                        addToast({
                            message: `Approve ${tokenInfo.symbol}`,
                            URL: explorerLink,
                        })
                    );
                }
            } catch (err) {
                console.log(err);
                dispatch(
                    setOpenModal({
                        message: `Approval Failed`,
                        trxState: TrxState.TransactionFailed,
                    })
                );
                close();
            }
        }
    };

    const makeBid = async () => {
        if (account) {
            try {
                dispatch(
                    setOpenModal({
                        message: `Placing bid of ${stakeBid} ${tokenInfo.symbol}`,
                        trxState: TrxState.WaitingForConfirmation,
                    })
                );
                const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);

                const data = await bidContract.submitBid(id, ZERO_ADDRESS, 0, ethers.utils.parseUnits(stakeBid, tokenInfo.decimals));

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
                            message: `Successfully Placed Bid on Event ${id}`,
                            URL: explorerLink,
                        })
                    );
                    setStakeBid('');
                    checkEvents();
                    close();

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
        <Modal isOpen={isOpen} onClose={close} isCentered>
            {hasTokenABeenApproved ? (
                <>
                    <ModalOverlay />
                    <ModalContent bg={bgColour} color="#fff" borderRadius="6px"
                                  paddingBottom="15px" width="50vw">
                        <ModalCloseButton
                            bg="none"
                            color={closeBtnColour}
                            cursor="pointer"
                            _focus={{ outline: 'none' }}
                            border={'1px solid'}
                            size={'sm'}
                            mt={3}
                            mr={3}
                            p={'7px'}
                            onClick={() => close()}
                        />
                        <ModalBody align="center" my={2}>
                            {loadInfo ? <Spinner
                                thickness="4px"
                                speed="0.53s"
                                emptyColor="transparent"
                                color="#319EF6"
                                size="xl"
                                width="100px"
                                height="100px"
                                my={10}
                            /> : (
                                <>
                                    <Text fontSize="20px" fontWeight={500} color={textColour} py={2}>Now let's place your bid</Text>
                                    <Text fontSize="14px" fontWeight={400} color={textColour} py={2}>You’re about to place bid on #Event {id}</Text>

                                    <Box>
                                        <Text my={'20px'} color={'#666666'}>Last bid placed on this event was {ethers.utils.formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}</Text>
                                        <InputGroup>
                                            <Input
                                                placeholder='Enter amount'
                                                value={stakeBid}
                                                color={textColor}
                                                borderColor={error ? '#CC334F' : "#319EF6"}
                                                onChange={(event) => {
                                                    enforcer(event.target.value.replace(/,/g, "."));
                                                }}
                                            />
                                            <InputRightAddon
                                                color={textColor}
                                                children={`${ethers.utils.formatUnits(max, tokenInfo.decimals)} ${tokenInfo.symbol} Max`} />
                                        </InputGroup>
                                        {error &&
                                            <Flex alignItems={'center'}>
                                                <Icon as={RiErrorWarningLine} w={6} h={6} color={'#CC334F'} mr={2}/>
                                                <Text textAlign={"left"} my={'10px'} color={'#CC334F'} fontSize={'16px'}>{error}</Text>
                                            </Flex>

                                        }
                                    </Box>
                                    <Text my={'20px'}
                                          color={'#666666'}
                                    >Your available balance is {ethers.utils.formatUnits(tokenInfo.balance, tokenInfo.decimals)} {tokenInfo.symbol}</Text>

                                    <Button
                                        variant="brand" padding="24px 0"
                                        width="100%" isFullWidth
                                        boxShadow="none"
                                        border="0"
                                        mt={3}
                                        background={closeButtonBgColour}
                                        onClick={() => makeBid()}
                                        color="#FFFFFF" cursor="pointer"
                                    >
                                        Place Bid
                                    </Button>
                                </>
                            )}

                        </ModalBody>
                    </ModalContent>
                </>
            ) : (
                <>
                    <ModalOverlay />
                    <ModalContent bg={bgColour} color="#fff" borderRadius="6px"
                                  paddingBottom="15px" width="50vw">
                        <ModalCloseButton
                            bg="none"
                            color={closeBtnColour}
                            cursor="pointer"
                            _focus={{ outline: 'none' }}
                            border={'1px solid'}
                            size={'sm'}
                            mt={3}
                            mr={3}
                            p={'7px'}
                        />
                        <ModalBody align="center" my={'20px'}>
                            {loadInfo ? <Spinner
                                thickness="4px"
                                speed="0.53s"
                                emptyColor="transparent"
                                color="#319EF6"
                                size="xl"
                                width="100px"
                                height="100px"
                                my={10}
                            /> : (<>
                                <Text fontSize="20px" fontWeight={500} color={textColour} py={2}>First, let’s get things straight</Text>
                                <Text fontSize="14px" fontWeight={400} color={textColour} py={2}>You’re required to approve this trasanction by paying the required amount of gas fee.</Text>
                                <Button
                                    variant="brand" padding="24px 0"
                                    width="100%" isFullWidth
                                    boxShadow="none"
                                    border="0"
                                    mt={3}
                                    background={closeButtonBgColour}
                                    color="#FFFFFF" cursor="pointer"
                                    onClick={() => approveTokens()}
                                >
                                    Approve
                                </Button>
                            </>)}

                        </ModalBody>
                    </ModalContent>
                </>
            )}
        </Modal>
    )
};

export default BidModal;
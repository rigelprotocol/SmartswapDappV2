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
    useColorModeValue, useMediaQuery
} from '@chakra-ui/react'
import React, {useMemo, useState} from 'react';
import {getERC20Token} from "../../../utils/utilsFunctions";
import {setOpenModal, TrxState} from "../../../state/application/reducer";
import {SMARTBID2, SMARTBID1} from "../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../utils/getExplorerLink";
import {addToast} from "../../../components/Toast/toastSlice";
import {useActiveWeb3React} from "../../../utils/hooks/useActiveWeb3React";
import {useDispatch} from "react-redux";
import {useBidAllowance} from "../../../hooks/useSmartBid";
import {ethers} from "ethers";
import {RigelSmartBidTwo, RigelSmartBid} from "../../../utils/Contracts";
import {ZERO_ADDRESS} from "../../../constants";
import {escapeRegExp} from "../../../utils";
import {RiErrorWarningLine} from "react-icons/all";

type BidModalProps = {
    isOpen: boolean,
    close: () => void,
    id: number,
    amount: string,
    max: string,
    tokenInfo: {
        symbol: string,
        balance: string,
        decimals: string
    },
    address: string,
    placeBid: {
        address: string,
        id: number
    },
    bidLoad: boolean,
    exclusive: boolean
};

const BidModal = ({isOpen, close, id, amount, max, tokenInfo, address, placeBid, bidLoad, exclusive} : BidModalProps) => {
    const { chainId, library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    const [checkTokenApproval, setCheckTokenApproval] = useState(0);
    const dispatch = useDispatch();
    const [isMobileDevice] = useMediaQuery("(max-width: 750px)");

    const {hasTokenABeenApproved, loadInfo} = useBidAllowance(checkTokenApproval, amount, isOpen, id, exclusive);

    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");

    const [stakeBid, setStakeBid] = useState('');
    const [error, setError] = useState('');

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

    const [lowBalance, setLowBalance] = useState(false);

    useMemo(() => {
        if (tokenInfo.balance === '') {
            return;
        }
       else if (Number(ethers.utils.formatUnits(amount, 18)) > Number(ethers.utils.formatUnits(tokenInfo.balance, 18))) {
            setLowBalance(true);
        } else {
           setLowBalance(false)
        }
    }, [isOpen]);


    const approveTokens = async () => {
        if (account) {
            try {
                dispatch(
                    setOpenModal({
                        message: `Approve Token`,
                        trxState: TrxState.WaitingForConfirmation,
                    })
                );

                const token = await getERC20Token(address, library);

                const approval = await token.approve( exclusive ? SMARTBID1[chainId as number] :  SMARTBID2[chainId as number],
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
            if (exclusive) {
                if (placeBid.id === 0) {
                    dispatch(
                        setOpenModal({
                            message: `You do not own the required NFT for this action.`,
                            trxState: TrxState.TransactionFailed,
                        })
                    );
                } else {
                    try {
                        dispatch(
                            setOpenModal({
                                message: `Placing bid of ${stakeBid} ${tokenInfo.symbol}`,
                                trxState: TrxState.WaitingForConfirmation,
                            })
                        );
                        const bidContract = await RigelSmartBid(SMARTBID1[chainId as number], library);

                        const data = await bidContract.submitBid(id, placeBid.id, ethers.utils.parseUnits(stakeBid, tokenInfo.decimals));

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


            } else {
                try {
                    dispatch(
                        setOpenModal({
                            message: `Placing bid of ${stakeBid} ${tokenInfo.symbol}`,
                            trxState: TrxState.WaitingForConfirmation,
                        })
                    );
                    const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);

                    const data = await bidContract.submitBid(id, placeBid.id !== 0 ? placeBid.address : ZERO_ADDRESS, placeBid.id !== 0 ? placeBid.id : 0, ethers.utils.parseUnits(stakeBid, tokenInfo.decimals));

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
                        close();
                    }


                } catch (e) {
                    console.log(e);
                    if (e.data.code === 3) {
                        dispatch(
                            setOpenModal({
                                message: `You do not own any Rigel NFTs`,
                                trxState: TrxState.TransactionFailed,
                            })
                        );
                    } else {
                        dispatch(
                            setOpenModal({
                                message: `Transaction Failed`,
                                trxState: TrxState.TransactionFailed,
                            })
                        );
                    }
                }
            }


        }
    };

    return (
        <Modal isOpen={isOpen} onClose={close} isCentered>
            {hasTokenABeenApproved ? (
                <>
                    <ModalOverlay />
                    <ModalContent bg={bgColour} color="#fff" borderRadius="6px"
                                  paddingBottom="15px" width={isMobileDevice ? '90%' : '50vw'}>
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
                            {loadInfo || bidLoad ?
                            <Box justifyContent={'center'} alignItems={'center'}>
                                <Spinner
                                    thickness="4px"
                                    speed="0.53s"
                                    emptyColor="transparent"
                                    color="#319EF6"
                                    size="xl"
                                    width="100px"
                                    height="100px"
                                    my={10}
                                />
                                {bidLoad &&  <Text fontSize="14px" fontWeight={400} color={textColour} py={2}>Checking your NFT ownership status ...</Text>}
                            </Box>
                            : (
                                <>
                                    <Text fontSize="20px" fontWeight={500} color={textColour} py={2}>Now let's place your bid</Text>
                                    <Text fontSize="14px" fontWeight={400} color={textColour} py={2}>You’re about to place bid on #Event {id}</Text>

                                    <Box>
                                        <Text
                                            my={'20px'}
                                            color={'#666666'}>
                                            Last bid placed on this event was {ethers.utils.formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}
                                        </Text>
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
                                  paddingBottom="15px" width={isMobileDevice ? '90%' : '50vw'}>
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
                                <Text fontSize="14px" fontWeight={400} color={textColour} py={2}>You’re required to approve this transaction by paying the required amount of gas fee.</Text>
                                {
                                    lowBalance && <Box>
                                        <Text my={'10px'} color={'#CC334F'} fontSize={'16px'}>Insufficient Balance</Text>
                                        <Text my={'10px'} color={'#CC334F'} fontSize={'16px'}>Mimimum required: {ethers.utils.formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}</Text>
                                    </Box>
                                }
                                <Button
                                    variant="brand" padding="24px 0"
                                    width="100%" isFullWidth
                                    boxShadow="none"
                                    border="0"
                                    mt={3}
                                    background={closeButtonBgColour}
                                    color="#FFFFFF" cursor="pointer"
                                    onClick={() => approveTokens()}
                                    disabled={lowBalance}
                                >
                                    Approve {tokenInfo.symbol}
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
import React from "react";
import {Box, Text, Flex,
    useColorModeValue, Tabs,
    useMediaQuery, TabList, Tab,
    TabPanel, TabPanels, Image, Button
} from '@chakra-ui/react';
import bidLogo from '../../../assets/smartbid/bidRGP.svg';
import {useActiveWeb3React} from "../../../utils/hooks/useActiveWeb3React";
import {shortenAddress} from "../../../utils";
import {ethers} from "ethers";
import {useBidWinners} from "../../../hooks/useSmartBid";
import {setOpenModal, TrxState} from "../../../state/application/reducer";
import {RigelSmartBid, RigelSmartBidTwo} from "../../../utils/Contracts";
import {SMARTBID1, SMARTBID2} from "../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../utils/getExplorerLink";
import {addToast} from "../../../components/Toast/toastSlice";
import {useDispatch} from "react-redux";

export function timeConverter(UNIX_timestamp: any) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    const min = a.getMinutes()<10 ? `0${a.getMinutes()}` : a.getMinutes();
    return `${month} ${date}, ${year} ${hour}:${min}`;
}

type ActivityID = {
    address: string,
    id: number,
    amount: string,
    time: string,
    tokenInfo: string
}

const ActivityPanel = ({address, id, amount, time, tokenInfo}: ActivityID) => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDevice] = useMediaQuery("(max-width: 550px)");
    return (
        <>
            <Flex width={isMobileDevice ? '100%' : '70%'} justifyContent={'space-between'}
                  my={'20px'} color={textColor} border={'1px solid #DEE6ED'}
                  borderRadius={'12px'} p={'10px 20px'}
            >
                <Flex alignItems={'center'}>
                   <Flex justifyContent={'center'}  alignItems={'center'} minWidth={'30px'}
                         background={'#ffffff'} mx={2} border={'1.25px solid rgba(167, 169, 190, 0.3)'}
                         borderRadius={'50%'} boxSize={isMobileDevice ? '30px' : '40px'}>
                       <Image src={bidLogo} height={isMobileDevice ? '15px ' : '20px'} width={isMobileDevice ? '15px ' : '20px'}/>
                   </Flex>
                    <Box mx={2}>
                        <Text fontWeight={700} fontStyle={'normal'} fontSize={isMobileDevice ? '12px' : '16px'}  my={1}>{ethers.utils.formatUnits(amount, 18)} {tokenInfo}</Text>
                        <Text fontWeight={500} fontStyle={'normal'} fontSize={'12px'}  my={1}>Bid placed by .. {shortenAddress(address)}</Text>
                    </Box>
                </Flex>
                <Flex
                    alignItems={'center'}>
                    <Box mx={'20px'} border={'.5px solid #DEE6ED'} height={'40px'} rotate={'90deg'}/>
                    <Text fontWeight={400} fontStyle={'normal'} fontSize={isMobileDevice ? '10px' : '14px'} color={'#A7A9BE'} my={1}>{timeConverter(time)}</Text>
                </Flex>
            </Flex>
        </>
    )
};


const WinnersPanel = ({id, colors, price, address, tokenInfo, exclusive}: {id: number, colors: string[], price: string | number, address: string, tokenInfo: string, exclusive: boolean}) => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 650px)");
    const { chainId, library, account } = useActiveWeb3React();
    const dispatch = useDispatch();

    const claimReward = async () => {
        try {
            dispatch(
                setOpenModal({
                    message: `Claiming Rewards on this Event`,
                    trxState: TrxState.WaitingForConfirmation,
                })
            );

            let bidContract;

            if (exclusive) {
                bidContract = await RigelSmartBid(SMARTBID1[chainId as number], library);
            } else {
                bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
            }


            const data = await bidContract.DistributeRewardsWithOther3(id);

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
                        message: `Successfully Claimed Rewards`,
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
    };


    return (
        <>
            <Flex width={isMobileDeviceSm ? '100%' : '90%'} justifyContent={'space-between'}
                  my={'20px'} color={textColor} border={'1px solid #DEE6ED'}
                  borderRadius={'12px'} p={'10px 20px'}
            >
                <Flex alignItems={'center'}>
                    <Flex justifyContent={'center'}  alignItems={'center'}
                          background={colors[0]} mx={2} border={'1.5px solid rgba(167, 169, 190, 0.3)'}
                          borderRadius={'50%'} boxSize={'40px'}>
                        <Flex justifyContent={'center'}  alignItems={'center'}
                              background={colors[1]}
                              borderRadius={'50%'} boxSize={'32px'}>
                            <Text color={colors[2]} textAlign={'center'}>{id}</Text>
                        </Flex>

                    </Flex>
                    <Box mx={2}>
                        <Text fontWeight={700} fontStyle={'normal'} fontSize={'16px'} lineHeight={'19px'} my={1}>{shortenAddress( address !== undefined ? address : '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')}</Text>
                        <Text fontWeight={500} color={'#A7A9BE'} fontStyle={'normal'} fontSize={'12px'} lineHeight={'16px'} my={1}>Event ended</Text>
                    </Box>
                </Flex>
                {
                    !isMobileDeviceSm &&
                    <Flex alignItems={'center'}>
                        <Box mr={isMobileDevice ? '20px' : '48px'} border={'.5px solid #A7A9BE'} height={'40px'}
                             rotate={'90deg'}/>
                        <Text fontWeight={700} fontSize={'20px'} textAlign={'center'} color={textColor}
                              minWidth={'70px'} lineHeight={'44px'} my={1}>{price} {tokenInfo}</Text>
                        <Box ml={isMobileDevice ? '20px' : '48px'} border={'.5px solid #A7A9BE'} height={'40px'}
                             rotate={'90deg'}/>
                    </Flex>
                }

                <Flex alignItems={'center'}>
                    <Button disabled={account !== address} variant={'brand'} onClick={() => claimReward()}>{isMobileDeviceSm ? 'Reward' : 'Claim Reward'}</Button>
                </Flex>

            </Flex>
        </>
    )
};

type BidTabsDetails = {
    time: number,
    id: number,
    events: [],
    tokenInfo: string,
    exclusive: boolean
}


const BidTabs = ({time, id, events, tokenInfo, exclusive} : BidTabsDetails) => {
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");
    const textColor = useColorModeValue("#333333", "#F1F5F8");

    const {loadWinners, winnerDetails} = useBidWinners(id, exclusive);

    return (
        <>
            <Box width={isMobileDevice ? '100%' : '60%'}>
                <Tabs isFitted variant={'line'} color={'#CCCCCC'}>
                    <TabList>
                        <Tab color={textColor}>Bid Activity</Tab>
                        <Tab>Recent Winners</Tab>
                    </TabList>

                    <TabPanels mb={'80px'}>
                        <TabPanel>
                            {events.map((item, index) => (
                                <ActivityPanel key={index}
                                               address={item.args[0]}
                                               id={item.args[1].toString()}
                                               amount={item.args[2].toString()}
                                               time={item.args[3].toString()}
                                               tokenInfo={tokenInfo}
                                />
                            ))}
                        </TabPanel>
                        <TabPanel>
                            {time < 0 ?
                            <Box>
                                {winnerDetails.map((item, index) => (
                                    <WinnersPanel key={index} id={item.id} colors={item.colors} price={item.price} address={item.address} tokenInfo={tokenInfo} exclusive={exclusive}/>
                                ))}
                            </Box>
                                :
                                <Box justifyContent={'center'} minHeight={'100px'}>
                                    <Text textAlign={'center'} my={'30px'}>The list of winners and other participants will appear here.</Text>
                                </Box>

                            }
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
};

export default BidTabs;


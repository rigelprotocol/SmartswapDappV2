import React, {useState, useEffect, useMemo} from "react";
import {
    Box,
    Text,
    Flex,
    useColorModeValue,
    Button,
    useMediaQuery,
    UnorderedList,
    ListItem,
    Spinner
} from '@chakra-ui/react';
import BidHeader from "./Components/BidHeader";
import BidTabs from "./Components/BidTabs";
import {useSmartBid} from "../../hooks/useSmartBid";
import {countDownDate} from "./Components/Card";
import { useLocation } from "react-router-dom";
import BidModal from "./Components/BidModal";
import {RigelNFTTwo, RigelSmartBidTwo} from "../../utils/Contracts";
import {SMARTBID2, SMARTBID1} from "../../utils/addresses";
import {useSelector} from "react-redux";
import {RootState} from "../../state";
import {useActiveWeb3React} from "../../utils/hooks/useActiveWeb3React";
import {getERC20Token} from "../../utils/utilsFunctions";
import {getNftTokenID} from "../../state/nft/bidTest";

const BidDetails = () => {
    const { chainId, library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 750px)");
    const textFont = isMobileDeviceSm ? '25px' : '40px';
    const smallFont = isMobileDeviceSm ? '12px' : '16px';
    const location = useLocation();
    const idBid = location.pathname.split('/');
    const viewId = Number(idBid[2]);

    const [bidModal, setBidModal] = useState(false);


    const { loadData , bidTime, bidDetails } = useSmartBid(viewId);

    const [time, setTime] = useState(2);
    const [currentClock, setCurrentClock] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;

    const [tokenInfo, setTokenInfo] = useState({symbol: '', balance: '', decimals: ''});
    const [tokenAddress, setTokenAddress] = useState('');


    useMemo(() => {
        const getTokenData = async () => {

            try {
                const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                const bidToken = await bidContract.requestToken(viewId);
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

    useEffect(() => {
        const timeFunction = setInterval(function() {

            const now = new Date().getTime();
            const bidDate = countDownDate(Number(bidTime));
            const bidDeadline = new Date(bidDate).getTime();
            const distance =  bidDeadline - now;
            setTime(distance);

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCurrentClock({days: days, hours: hours, minutes: minutes, seconds: seconds});

            if (distance < 0) {
                clearInterval(timeFunction);
                setCurrentClock({days: 0, hours: 0, minutes: 0, seconds: 0})
            }
        }, 1000);

    }, [bidTime]);

    const [eventData, setEventData] = useState([]);

    const checkEvents = async () => {
        const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);

        const filter = bidContract.filters.bidding();
        const events = await bidContract.queryFilter(filter, library.getBlockNumber().then((b) => b - 4000), "latest");
        const sortedEvents = events.sort(function(x, y){
            return y.blockNumber - x.blockNumber;
        });
        const tabEvent = sortedEvents.filter((item) => Number(item.args[1].toString()) === viewId);
        setEventData(tabEvent);
    };

    const [placeBid, setPlaceBid] = useState({address: '', id: 0});
    const [bidloadData, setBidLoadData] = useState(false);

    const nftCheck = async () => {
        try {
            setBidLoadData(true);
            const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
            const data = await bidContract.requestToken(viewId);
            const {nftCont, nftReq} = data;
            const nameOfNFTsContracts = [ "RigelProtocol Smartswap NFTs", "Rigel Protocol LaunchPad NFTs", "Rigel Protocol GiftDapp NFT"];
            let j = 0;
            let x = 0;
            let m = 0;

            for( j ; j < nftReq.length; j++) {

                if (j <= nftCont.length) {
                    const contents = await RigelNFTTwo(nftCont[j], library);
                    const name = await contents.name();

                    if(x != 0) {
                        break;
                    }

                    if (name === nameOfNFTsContracts[j]) {
                        const idArray = getNftTokenID(Number(nftReq[j]), nameOfNFTsContracts[j]);
                        const checkNftId = idArray.slice(0, 30);

                        for (let i = checkNftId[0]; i <= checkNftId.slice(-1)[0]; i++) {
                            const views = await contents.balanceOf(account, i);
                            if (Number(views.toString()) === 1) {
                                x = i;
                                setPlaceBid({address: nftCont[j], id: i});
                                console.log(i);
                                break;
                            }
                        }
                    }
                } else {
                    const contents = await RigelNFTTwo(nftCont[m], library);
                    const name = await contents.name();

                    if(x != 0) {
                        break;
                    }

                    if (name === nameOfNFTsContracts[j]) {
                        const idArray = getNftTokenID(Number(nftReq[m]), nameOfNFTsContracts[m]);
                        const checkNftId = idArray.slice(0, 30);

                        for (let i = checkNftId[0]; i <= checkNftId.slice(-1)[0]; i++) {
                            const views = await contents.balanceOf(account, i);
                            if (Number(views.toString()) === 1) {
                                x = i;
                                setPlaceBid({address: nftCont[m], id: i});
                                console.log(i);
                                break;
                            }
                        }
                        m++;
                    }
                }

            }
            setBidLoadData(false);

        } catch (e) {
            console.log('Error on NFT Check Function')
        }
    };

    useMemo(() => {
        const getBidEvent = async () => {
            try {
                await checkEvents();
                await nftCheck();

            } catch (e) {
                console.log('Error here')
            }

        };
        getBidEvent();
    }, [stateChanged, account, chainId]);



    return (
        <>
            <BidHeader/>
            <Box width={'90%'} margin={'0px auto'}>
                <Box display={'flex'} my={'90px'} flexDirection={isMobileDeviceSm ? 'column' : 'row'} justifyContent={'space-between'} width={'100%'} mx={'auto'}>
                    <Box width={isMobileDeviceSm ? '100%' : '60%'}>
                        <Text color={textColor} fontWeight={700} fontStyle={'normal'} fontSize={'36px'} my={1}>Event {viewId}</Text>
                        <Text fontWeight={600} lineHeight={'32px'} fontSize={'18px'} textDecoration={'underline'}>Description</Text>
                        <Text fontWeight={400} lineHeight={'24px'} fontSize={'16px'} color={'#A7A9BE'} my={2}>Place your bid and stand a chance to win the grand token prize at the end of this event.</Text>
                        <UnorderedList fontWeight={500} fontSize={'16px'} lineHeight={'24px'} width={'80%'} my={3}>
                            <ListItem color={textColor} p={1}>Winner gets 30% of the Total Token raised</ListItem>
                            <ListItem color={textColor} p={1}>5 random bidders will be selected at the end of the event to win 10% of Total Token raised.</ListItem>
                        </UnorderedList>
                    </Box>
                    <Flex>
                        {loadData ?
                        <Box justifyContent={'center'}>
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
                        </Box>
                        :
                        <Box border={'1px solid #DEE6ED'}
                             borderRadius={'20px'}
                             width={'100%'}
                             padding={'30px'}
                             boxShadow={'0px 6px 8px -6px rgba(24, 39, 75, 0.12), 0px 8px 16px -6px rgba(24, 39, 75, 0.08)'}
                        >
                            <Text textAlign={'center'} my={2}>{time > 0 ? `Event ending in` : `Event has ended`}</Text>
                            <Flex width={'100%'} my={3} justifyContent={'center'}>
                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>{currentClock.days}</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Days</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>{currentClock.hours}</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Hours</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>{currentClock.minutes}</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Minutes</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>{currentClock.seconds}</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Seconds</Text>
                                </Box>
                            </Flex>
                            <Box marginY={3} border={'.5px solid #DEE6ED'}/>
                              <Button my={3} width={'100%'}
                                      variant={'brand'}
                                      disabled={time < 0}
                                      justifyContent={'center'}
                                      onClick={() => setBidModal(true)}
                              >
                                  {time > 0 ? 'Place Bid' : 'Event ended'}
                              </Button>

                        </Box>
                        }
                    </Flex>
                </Box>
                <BidModal
                    isOpen={bidModal}
                    close={() => setBidModal(false)}
                    id={viewId} amount={bidDetails.initial}
                    max={bidDetails.max.toString()}
                    tokenInfo={tokenInfo} address={tokenAddress} placeBid={placeBid} bidLoad={bidloadData} />

                <BidTabs time={time} id={viewId} events={eventData} tokenInfo={tokenInfo}/>

            </Box>
        </>
    )
};

export default BidDetails;

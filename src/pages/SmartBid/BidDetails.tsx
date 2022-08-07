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
    Spinner, Icon, VStack, Heading
} from '@chakra-ui/react';
import BidHeader from "./Components/BidHeader";
import BidTabs from "./Components/BidTabs";
import { useSmartBid} from "../../hooks/useSmartBid";
import {countDownDate} from "./Components/Card";
import { useLocation } from "react-router-dom";
import BidModal from "./Components/BidModal";
import {RigelNFTTwo, RigelSmartBidTwo, RigelSmartBid} from "../../utils/Contracts";
import {SMARTBID2, SMARTBID1} from "../../utils/addresses";
import { useSelector} from "react-redux";
import {RootState} from "../../state";
import {useActiveWeb3React} from "../../utils/hooks/useActiveWeb3React";
import {getERC20Token, useProvider} from "../../utils/utilsFunctions";
import {getNftTokenID} from "../../state/nft/bidTest";
import {RiErrorWarningLine} from "react-icons/all";
import {ethers} from "ethers";
import {SupportedChainId} from "../../constants/chains";

const BidDetails = () => {
    const { library, account } = useActiveWeb3React();
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 750px)");
    const headerColor = useColorModeValue("#0760A8", "#F1F5F8");
    const textFont = isMobileDeviceSm ? '25px' : '40px';
    const smallFont = isMobileDeviceSm ? '12px' : '16px';
    const location = useLocation();
    const idBid = location.pathname.split('/');
    const viewId = Number(idBid[2]);
    const typeVal = idBid[3];
    const exc = (typeVal === 'true');
    const ChainId = useSelector<RootState>((state) => state.chainId.chainId);


    const [bidModal, setBidModal] = useState(false);

    const { loadData , bidTime, bidDetails , addresses, rewardArray, totalBid} = useSmartBid(viewId, exc);

    const [time, setTime] = useState(2);
    const [currentClock, setCurrentClock] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;

    const [tokenInfo, setTokenInfo] = useState({symbol: '', balance: '', decimals: ''});
    const [tokenAddress, setTokenAddress] = useState('');
    const [bidAmount, setBidAmount] = useState('');

    const {prov} = useProvider();
    const lib = library ?? prov;


    useMemo(() => {
        const getTokenData = async () => {
            if (exc) {
                try {
                    const bidContract = await RigelSmartBid(SMARTBID1[ChainId as number], lib);
                    const bidToken = await bidContract.request_token_info(viewId);
                    setTokenAddress(bidToken.token);

                    const token = await getERC20Token(bidToken.token, lib);

                    const [tokenSymbol, tokenBalance, tokenDecimals] = await Promise.all(
                        [token.symbol(), token.balanceOf(account), token.decimals()]);
                    setTokenInfo({symbol: tokenSymbol, balance: tokenBalance, decimals: tokenDecimals});

                    setBidAmount( ethers.utils.formatUnits(totalBid, tokenDecimals));

                } catch (e) {
                    console.log(e)
                }
            } else {
                try {
                    const bidContract = await RigelSmartBidTwo(SMARTBID2[ChainId as number], lib);
                    const bidToken = await bidContract.requestToken(viewId);
                    setTokenAddress(bidToken._token);

                    const token = await getERC20Token(bidToken._token, lib);

                    const [tokenSymbol, tokenBalance, tokenDecimals] = await Promise.all(
                        [token.symbol(), token.balanceOf(account), token.decimals()]);
                    setTokenInfo({symbol: tokenSymbol, balance: tokenBalance, decimals: tokenDecimals});

                    setBidAmount(ethers.utils.formatUnits(totalBid, tokenDecimals));

                } catch (e) {
                    console.log(e)
                }
            }



        };
        getTokenData();
    }, [account, ChainId, totalBid, library]);

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

    const [placeBid, setPlaceBid] = useState({address: '', id: 0});
    const [bidloadData, setBidLoadData] = useState(false);
    const [nftName, setNFTName] = useState('');

    const nftCheck = async () => {
        if (exc) {
            try {
                setBidLoadData(true);
                const bidContract = await RigelSmartBid(SMARTBID1[ChainId as number], library);
                const data = await bidContract.request_token_info(viewId);
                const singleID = await bidContract.getSetURI(viewId);
                const {NFTContractAddress} = data;
                let x = 0;

                let nftIDArray = [];

                for (const item of singleID) {
                    nftIDArray.push(item.toString())
                }

                const contents = await RigelNFTTwo(NFTContractAddress, library);
                const name = await contents.name();
                setNFTName(name);

                for (const item of nftIDArray) {
                    const idArray = getNftTokenID(Number(item), name);
                    const checkNftId = idArray.slice(0, 30);

                    if (x != 0) {
                        break;
                    }


                    for (let i = checkNftId[0]; i <= checkNftId.slice(-1)[0]; i++) {
                        const views = await contents.balanceOf(account, i);
                        if (Number(views.toString()) === 1) {
                            setPlaceBid({address: NFTContractAddress, id: i});
                            x = i;
                            break;
                        }
                    }
                }
                setBidLoadData(false);
                if (x === 0) {
                    console.log('User has no NFT');
                    setPlaceBid({address: '', id: 0});
                }



            } catch (e) {
                console.log('Error on user has NFT Only Function');
                setPlaceBid({address: '', id: 0});
                setBidLoadData(false);
            }

        } else {
            try {
                setBidLoadData(true);
                const bidContract = await RigelSmartBidTwo(SMARTBID2[ChainId as number], library);
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
                                    break;
                                }
                            }
                            m++;
                        }
                    }

                }
                setBidLoadData(false);

            } catch (e) {
                console.log('Error on NFT Check Function', e);
                setPlaceBid({address: '', id: 0});
                setBidLoadData(false);
            }
        }

    };

    useMemo(() => {
        const getBidEvent = async () => {
            try {
                await nftCheck();

            } catch (e) {
                console.log('Error on Bid Event')
            }

        };
        getBidEvent();
    }, [stateChanged, account, ChainId]);

    useMemo(() => {
        const getNFTInfo = async () => {
            try {
                await nftCheck();

            } catch (e) {
                console.log('Error on NFT Fetch Function')
            }

        };
        getNFTInfo();
    }, [account, ChainId]);



    return (
        <>
            <BidHeader/>
            {
                ChainId !== SupportedChainId.POLYGONTEST ?
                    <Box width={'90%'} margin={'0px auto'}>
                        <Box display={'flex'} my={'90px'} flexDirection={isMobileDeviceSm ? 'column' : 'row'} justifyContent={'space-between'} width={'100%'} mx={'auto'}>
                            <Box width={isMobileDeviceSm ? '100%' : '60%'}>
                                <Text color={textColor} fontWeight={700} fontStyle={'normal'} fontSize={'36px'} my={1}>Event {viewId}</Text>
                                <Text fontWeight={600} lineHeight={'32px'} fontSize={'18px'} textDecoration={'underline'}>Description</Text>
                                <Text fontWeight={400} lineHeight={'24px'} fontSize={'16px'} color={'#A7A9BE'} my={2}>Place your bid and stand a chance to win the grand token prize at the end of this event.</Text>
                                <Flex alignItems={'center'}>
                                    <Icon as={RiErrorWarningLine} w={6} h={6} color={'#319EF6'} mr={2}/>
                                    <Text textAlign={"left"} my={'10px'}
                                          color={'#319EF6'} fontSize={'16px'}
                                    >Total of {' '}
                                        {bidAmount} {tokenInfo.symbol} tokens bidded so far.</Text>
                                </Flex>
                                <UnorderedList fontWeight={500} fontSize={'16px'} lineHeight={'24px'} width={'80%'} my={3}>
                                    <ListItem color={textColor} p={1}>1st prize bidder gets {rewardArray[0]}% of the Total Token raised</ListItem>
                                    <ListItem color={textColor} p={1}>2nd prize bidder gets {rewardArray[1]}% of the Total Token raised</ListItem>
                                    <ListItem color={textColor} p={1}>3rd prize bidder gets {rewardArray[2]}% of the Total Token raised</ListItem>
                                    <ListItem color={textColor} p={1}>{addresses} random bidders will be selected at the end of the event to win {rewardArray[3]}% of Total Token raised.</ListItem>
                                </UnorderedList>

                                {exc && nftName ? <Text fontWeight={600} lineHeight={'32px'} fontSize={'18px'} color={'#CC334F'}>{nftName} owners only.</Text> : null}
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
                                    <Box>
                                        <Flex alignItems={'center'} bg={'#FEFEF6'} border={'1px solid #B18D14'} borderRadius={'4px'} padding={'10px'} my={'20px'}>
                                            <Icon as={RiErrorWarningLine} w={5} h={5} color={'#b18d14'} mr={2}/>
                                            <Text color={'#B18D14'} fontSize={'14px'}>You need {tokenInfo.symbol} token to bid on this event.</Text>
                                        </Flex>
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
                                    </Box>
                                }
                            </Flex>
                        </Box>
                        <BidModal
                            isOpen={bidModal}
                            close={() => setBidModal(false)}
                            id={viewId} amount={bidDetails.initial}
                            max={bidDetails.max.toString()}
                            tokenInfo={tokenInfo} address={tokenAddress} placeBid={placeBid} bidLoad={bidloadData} exclusive={exc} />

                        <BidTabs time={time} id={viewId} tokenInfo={tokenInfo.symbol} exclusive={exc} bidAmount={bidAmount}/>

                    </Box>

                    :

                    <VStack minH="80vh" align="center" justify="center" width={'40%'} mx={'auto'}>
                        <Heading color={headerColor} fontFamily={'Cera Pro'} fontSize={'64px'}>Coming Soon...</Heading>
                        <Text color={textColor} fontSize={'20px'} textAlign={'center'}>We are going to launch creation of bid events by individual users very soon.</Text>
                    </VStack>
            }

        </>
    )
};

export default BidDetails;

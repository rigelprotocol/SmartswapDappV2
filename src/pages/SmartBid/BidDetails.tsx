import React, {useState} from "react";
import {Box, Text, Flex, useColorModeValue, Button, useMediaQuery, UnorderedList, ListItem} from '@chakra-ui/react';
import BidHeader from "./Components/BidHeader";
import BidTabs from "./Components/BidTabs";
import {useSmartBid} from "../../hooks/useSmartBid";
import {countDownDate, timeConverter} from "./Components/Card";


const BidDetails = () => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 750px)");
    const textFont = isMobileDeviceSm ? '25px' : '40px';
    const smallFont = isMobileDeviceSm ? '12px' : '16px';

    const { loadData , bidTime } = useSmartBid(0);
    const [time, setTime] = useState(2);
    const [currentClock, setCurrentClock] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

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
        //  console.log(distance, now);

        if (distance < 0) {
            clearInterval(timeFunction);
            setCurrentClock({days: 0, hours: 0, minutes: 0, seconds: 0})
        }
    }, 1000);


    return (
        <>
            <BidHeader/>
            <Box width={'90%'} margin={'0px auto'}>
                <Box display={'flex'} my={'90px'} flexDirection={isMobileDeviceSm ? 'column' : 'row'} justifyContent={'space-between'} width={'100%'} mx={'auto'}>
                    <Box width={isMobileDeviceSm ? '100%' : '60%'}>
                        <Text color={textColor} fontWeight={700} fontStyle={'normal'} fontSize={'36px'} my={1}>Event #172344</Text>
                        <Text fontWeight={600} lineHeight={'32px'} fontSize={'18px'} textDecoration={'underline'}>Description</Text>
                        <Text fontWeight={400} lineHeight={'24px'} fontSize={'16px'} color={'#A7A9BE'} my={2}>Place your bid and stand a chance to win the grand token prize at the end of this event.</Text>
                        <UnorderedList fontWeight={500} fontSize={'16px'} lineHeight={'24px'} width={'80%'} my={3}>
                            <ListItem color={textColor} p={1}>Winner gets 30% of the Total Token raised</ListItem>
                            <ListItem color={textColor} p={1}>5 random bidders will be selected at the end of the event to win 10% of Total Token raised.</ListItem>
                        </UnorderedList>
                    </Box>
                    <Flex>
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
                            {time > 0 &&
                              <Button my={3} width={'100%'} variant={'brand'} justifyContent={'center'}>Place Bid</Button>
                            }
                        </Box>
                    </Flex>
                </Box>

                <BidTabs/>

            </Box>
        </>
    )
};

export default BidDetails;

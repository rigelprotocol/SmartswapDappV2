import React from "react";
import {Box, Text, Flex, useColorModeValue, Button, useMediaQuery, UnorderedList, ListItem} from '@chakra-ui/react';
import BidHeader from "./Components/BidHeader";
import BidTabs from "./Components/BidTabs";


const BidDetails = () => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 750px)");
    const textFont = isMobileDeviceSm ? '25px' : '40px';
    const smallFont = isMobileDeviceSm ? '12px' : '16px';


    return (
        <>
            <BidHeader/>
            <Box width={'90%'} margin={'0px auto'}>
                <Box display={'flex'} my={'90px'} flexDirection={isMobileDeviceSm ? 'column' : 'row'} justifyContent={'space-between'} width={'100%'} mx={'auto'}>
                    <Box width={isMobileDeviceSm ? '100%' : '60%'}>
                        <Text color={textColor} fontWeight={700} fontStyle={'normal'} fontSize={'36px'} my={1}>Event #172344</Text>
                        <Text fontWeight={600} lineHeight={'32px'} fontSize={'18px'} textDecoration={'underline'}>Description</Text>
                        <Text fontWeight={400} lineHeoght={'24px'} fontSize={'16px'} color={'#A7A9BE'} my={2}>Place your bid and stand a chance to win the grand token prize at the end of this event.</Text>
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
                            <Text textAlign={'center'} my={2}>Event ending in</Text>
                            <Flex width={'100%'} my={3} justifyContent={'center'}>
                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>01</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Days</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>08</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Hours</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>50</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Minutes</Text>
                                </Box>

                                <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont} mx={3}>:</Text>

                                <Box px={1} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Text fontWeight={700} fontStyle={'normal'} fontSize={textFont}>24</Text>
                                    <Text fontWeight={600} fontStyle={'normal'} fontSize={smallFont} color={'#999999'} my={'8px'}>Seconds</Text>
                                </Box>
                            </Flex>
                            <Box marginY={3} border={'.5px solid #DEE6ED'}/>
                            <Button my={3} width={'100%'} variant={'brand'} justifyContent={'center'}>Place Bid</Button>
                        </Box>
                    </Flex>
                </Box>

                <BidTabs/>

            </Box>
        </>
    )
};

export default BidDetails;

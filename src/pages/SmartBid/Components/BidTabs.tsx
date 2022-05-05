import React from "react";
import {Box, Text, Flex,
    useColorModeValue, Tabs,
    useMediaQuery, TabList, Tab,
    TabPanel, TabPanels, Image, Button
} from '@chakra-ui/react';
import bidLogo from '../../../assets/smartbid/bidRGP.svg';
import {SmartBidActivity, SmartBidWinners} from "./cardData";

const ActivityPanel = () => {
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
                        <Text fontWeight={700} fontStyle={'normal'} fontSize={isMobileDevice ? '12px' : '16px'}  my={1}>2 RGP</Text>
                        <Text fontWeight={500} fontStyle={'normal'} fontSize={'12px'}  my={1}>Bid placed by .. 0x8d80...0a94</Text>
                    </Box>
                </Flex>
                <Flex
                   // fontFamily={'Cera Pro, sans serif'}
                    alignItems={'center'}>
                    <Box mx={'20px'} border={'.5px solid #DEE6ED'} height={'40px'} rotate={'90deg'}/>
                    <Text fontWeight={400} fontStyle={'normal'} fontSize={isMobileDevice ? '10px' : '14px'} color={'#A7A9BE'} my={1}>April 30, 2020 12:44pm</Text>
                </Flex>
            </Flex>
        </>
    )
};


const WinnersPanel = ({id, colors, price}: {id: number, colors: string[], price: string}) => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 650px)");
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
                        <Text fontWeight={700} fontStyle={'normal'} fontSize={'16px'} lineHeight={'19px'} my={1}>0x8d80...0a94</Text>
                        <Text fontWeight={500} color={'#A7A9BE'} fontStyle={'normal'} fontSize={'12px'} lineHeight={'16px'} my={1}>Apr 30, 2021 | 12:51pm</Text>
                    </Box>
                </Flex>
                {
                    !isMobileDeviceSm &&
                    <Flex alignItems={'center'}>
                        <Box mr={isMobileDevice ? '20px' : '48px'} border={'.5px solid #A7A9BE'} height={'40px'}
                             rotate={'90deg'}/>
                        <Text fontWeight={700} fontSize={'20px'} textAlign={'center'} color={textColor}
                              minWidth={'70px'} lineHeight={'44px'} my={1}>{price}</Text>
                        <Box ml={isMobileDevice ? '20px' : '48px'} border={'.5px solid #A7A9BE'} height={'40px'}
                             rotate={'90deg'}/>
                    </Flex>
                }
                <Flex alignItems={'center'}>
                    <Button variant={'brand'}>{isMobileDeviceSm ? 'Reward' : 'Claim Reward'}</Button>
                </Flex>
            </Flex>
        </>
    )
};


const BidTabs = () => {
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");
    const textColor = useColorModeValue("#333333", "#F1F5F8");
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
                            {SmartBidActivity.map((item, index) => (
                                <ActivityPanel key={index}/>
                            ))}
                        </TabPanel>
                        <TabPanel>
                            {SmartBidWinners.map((item, index) => (
                                <WinnersPanel key={index} id={item.id} colors={item.colors} price={item.price}/>
                            ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
};

export default BidTabs;


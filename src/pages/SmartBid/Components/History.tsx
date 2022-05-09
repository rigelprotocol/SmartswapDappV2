import React from "react";
import {Box, Text, Flex, useColorModeValue,
    Tabs, TabList, Tab, TabPanels, TabPanel} from '@chakra-ui/react';
import TableItem from "./TableItem";
import {Link} from 'react-router-dom';



const BidHistory = () => {
    const textColor = useColorModeValue("#16161A", "#16161A");
    return (
        <>
            <Box
                position="relative" backgroundPosition="center"
                backgroundSize="cover" background={'#F5F7FA'}
                height={'300px'}
            >
                <Flex
                    width={'80%'} margin={'30px'}
                    position={'absolute'} bottom={'0px'} alignItems={'end'}
                    height={'95px'}>
                    <Link to={'/smartbidhistory'}>
                        <Text p={'10px'} fontWeight={700} fontSize={'48px'} color={textColor}>History</Text>
                    </Link>
                    <Link to={'/notifications'}>
                        <Flex>
                            <Text p={'20px'} fontWeight={600} fontSize={'32px'} color={'#E1E3F3'}>Notifications</Text>
                            <div style={{background: '#F25F4C', position: 'relative',
                                top: '25px', right: '20px', height: '10px',
                                width: '10px', zIndex: 100, borderRadius: '50%'}}/>
                        </Flex>
                    </Link>
                </Flex>
            </Box>
            <Box  margin={'30px'} mb={'100px'}>
                <Tabs>
                    <TabList mb={'50px'}>
                        <Tab>All</Tab>
                        <Tab>Ongoing</Tab>
                        <Tab>Won</Tab>
                        <Tab>Random(10%)</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                           <TableItem/>
                        </TabPanel>
                        <TabPanel>
                            <TableItem/>
                        </TabPanel>
                        <TabPanel>
                            <TableItem/>
                        </TabPanel>
                        <TabPanel>
                            <TableItem/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

        </>
    )
};

export default BidHistory;
import React from "react";
import {Box, Text, Flex, useColorModeValue, Button, Menu, MenuButton,
    Tabs, TabList, Tab, TabPanels, TabPanel, TableContainer, Th, Tr, Table, Thead, Td, Tbody, Tfoot} from '@chakra-ui/react';
import {ChevronDownIcon} from "@chakra-ui/icons";
import {Link} from 'react-router-dom';



const BidNotification = () => {
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
                        <Text p={'20px'} fontWeight={600} fontSize={'32px'} color={'#E1E3F3'}>History</Text>
                    </Link>
                    <Link to={'/notifications'}>
                        <Flex>
                            <Text p={'10px'} fontWeight={700} fontSize={'48px'} color={textColor}>Notifications</Text>
                            <div style={{background: '#F25F4C', position: 'relative',
                                top: '25px', right: '10px', height: '10px',
                                width: '10px', zIndex: 100, borderRadius: '50%'}}/>
                        </Flex>
                    </Link>
                </Flex>
            </Box>

        </>
    )
};

export default BidNotification;
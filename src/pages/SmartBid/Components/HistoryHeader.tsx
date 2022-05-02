import React from "react";
import {Box, Flex, Text, useColorModeValue} from "@chakra-ui/react";



const HistoryHeader = ({weight, size, color}: {weight: string, size: string, color: string}) => {
    const textColor = useColorModeValue("#16161A", "#16161A");

    return (
        <Box
            position="relative" backgroundPosition="center"
            backgroundSize="cover" background={'#F5F7FA'}
            height={'300px'}
        >
        <Flex
              width={'80%'} margin={'30px'}
              position={'absolute'} bottom={'0px'} alignItems={'end'}
              height={'95px'}>
            <Text p={'10px'} fontWeight={600} fontSize={'32px'} color={'#E1E3F3'}>History</Text>
            <Flex>
                <Text p={'20px'} fontWeight={600} fontSize={'32px'} color={'#E1E3F3'}>Notifications</Text>
                <div style={{background: '#F25F4C', position: 'relative',
                top: '25px', right: '20px', height: '10px',
                width: '10px', zIndex: 100, borderRadius: '50%'}}/>
            </Flex>
        </Flex>
        </Box>
    )
};

export default HistoryHeader;
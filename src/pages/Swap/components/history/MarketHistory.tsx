import { Flex,Grid, Text, Image, Button, Box,useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import usdtLogo from '../../../../assets/roundedlogo.svg'
import { ArrowRightIcon } from '../../../../theme/components/Icons';

const MarketHistory = () => {

    const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
    const nonActiveTabColor = useColorModeValue('#CCCCCC', '#4A739B');
    const iconColor = useColorModeValue('#666666', '#DCE5EF');
    const borderColor = useColorModeValue('#DEE5ED', '#324D68');

    return (
        <Flex  >
        <Box
          width="100%"
          m={4}
          border_top="0"
          justifyContent="space-between"
          px={4}
          py={4}
          border="1px"
          borderColor={borderColor}
        >
            <Text
              color={activeTabColor}
              fontSize="12px"
              lineHeight="0"
              mb="6px"
            >
              Operation
            </Text>
            <Flex py={2}>
            <Flex mr={4}>
              <img src={usdtLogo} width={25} height={25} alt="logo" />
              <Text fontSize="sm" color={activeTabColor} ml={2}>
                49 <span>RGP</span>
              </Text>
            </Flex>
           <ArrowRightIcon/>
            <Flex ml={4}>
              <img src={usdtLogo} width={25} height={25} alt="logo" />
              <Text fontSize="sm" color={activeTabColor} ml={2}>
                40 <span>RGP</span>
              </Text>
            </Flex>
          </Flex>

          
            
          <Grid templateColumns="repeat(3, 2fr)" gap={7} py={2}>
              <Box>
                <Text
                  fontSize="12px"
                  lineHeight="0"
                  color={nonActiveTabColor}
                  mb="8px"
                >
                  Type
                </Text>
                <Text    color={activeTabColor} fontSize="14px" fontWeight="regular">
                  Auto Period
                </Text>
              </Box>
              <Box>
                <Text
                  color={nonActiveTabColor}
                  fontSize="12px"
                  lineHeight="0"
                  mb="8px"
                >
                  If Price(Above)
                </Text>
                <Text    color={activeTabColor} fontSize="14px" fontWeight="regular">
                  @ 0.004500
                </Text>
              </Box>
              <Box>
                <Text
                  color={nonActiveTabColor}
                  fontSize="12px"
                  lineHeight="0"
                  mb="8px"
                >
                  Interval
                </Text>
                <Text    color={activeTabColor} fontSize="14px" fontWeight="regular">
                  Weekly
                </Text>
              </Box>
            </Grid>
            
          <Grid templateColumns="repeat(3, 2fr)" gap={7} py={2}>
              <Box>
                <Text
                  fontSize="12px"
                  lineHeight="0"
                  color={nonActiveTabColor}
                  mb="8px"
                >
                  Time
                </Text>
                <Text    color={activeTabColor} fontSize="14px" fontWeight="regular">
                  20.0000
                </Text>
              </Box>
              <Box>
                <Text
                  color={nonActiveTabColor}
                  fontSize="12px"
                  lineHeight="0"
                  mb="8px"
                >
                Status
                </Text>
                <Text    color={activeTabColor} fontSize="14px" fontWeight="regular">
                Pending
                </Text>
              </Box>
              <Box maxW='min'>
              <Button  size='md' colorScheme="pink" variant="outline">
                 Cancel
              </Button>
              </Box>
              
            </Grid>
          
          
          </Box>
          
        </Flex>
    )
}

export default MarketHistory

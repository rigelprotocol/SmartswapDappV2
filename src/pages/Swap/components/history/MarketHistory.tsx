import { Flex,Grid, Text, Box,useColorModeValue, Tooltip, Link, Img } from '@chakra-ui/react'
import React from 'react'
import { ArrowRightIcon } from '../../../../theme/components/Icons';
import {DataType} from "./TransactionHistory";
import TokenIcon from '../../../../assets/Null-24.svg';
import { ExplorerDataType, getExplorerLink } from '../../../../utils/getExplorerLink';

const MarketHistory = ({data} : {data: DataType}) => {
    const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
    const nonActiveTabColor = useColorModeValue('#CCCCCC', '#4A739B');
    const borderColor = useColorModeValue('#DEE5ED', '#324D68');
    const successColor = useColorModeValue('#22bb33', '#75f083');

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
          borderRadius={'6px'}
        >
          <Flex justifyContent="space-between">
            <Text
              color={activeTabColor}
              fontSize="14px"
              lineHeight="0"
              mt={3}
              mb={2}
            >
              Operation
            </Text>
            <Box>
        {data.market &&<Img 
           src={`./images/${data.market}.png`} 
           width="30px" 
           height="30px"
           alt="83883" 
           mr={2} />}
        </Box>
          </Flex>
            
            <Flex py={2}>
            <Flex mr={4}>
              <img src={data.token1Icon || TokenIcon} width={25} height={25} alt="l" />
              <Text fontSize="sm" color={activeTabColor} ml={2}>
                {data.amountIn} <span>{data.token1.symbol}</span>
              </Text>
            </Flex>
           <ArrowRightIcon/>
            <Flex ml={4}>
              <img src={data.token2Icon || TokenIcon} width={25} height={25} alt="l" />
              <Text fontSize="sm" color={activeTabColor} ml={2}>
                {data.amountOut} <span>{data.token2.symbol}</span>
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
            <Text color={activeTabColor} fontSize="14px" fontWeight="regular">
              {data.name ? data.name : "Swap"}
            </Text>
          </Box>
          <Box>
            {data.name === "Set Price" ?
              <>
                <Tooltip label={`current ${data.token2.symbol} output`}>
                  <Text
                    color={nonActiveTabColor}
                    fontSize="12px"
                    lineHeight="0"
                    mb="8px"
                    cursor="pointer"
                  >
                    C{data.token2.symbol[0]}O
                  </Text>
                </Tooltip>
                <Tooltip label={data.currentToPrice}>
                <Text color={activeTabColor} fontSize="14px" fontWeight="regular" cursor="pointer">
                  {data.currentToPrice && parseFloat(data.currentToPrice).toFixed(2)}
                </Text>
                </Tooltip>
              </> :
              <>
                <Tooltip label="If Price(Above)">
                  <Text
                    color={nonActiveTabColor}
                    fontSize="12px"
                    lineHeight="0"
                    mb="8px"
                    cursor="pointer"
                  >
                    IPA
                  </Text>
                </Tooltip>

                <Text color={activeTabColor} fontSize="14px" fontWeight="regular">
                  {data.currentToPrice}%
                </Text>
              </>
            }

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
            <Text color={activeTabColor} fontSize="14px" fontWeight="regular">
              {data.frequency && (data.frequency === "5" || data.frequency === "30") ? `${data.frequency} minutes` : data.frequency}
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
                {data.time ? data.time :"-"}
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
                <Text    color={successColor} fontSize="14px" fontWeight="regular">
                Completed
                </Text>
              </Box>
              
            </Grid>
            {data?.chainID && data.transactionHash &&
            <Flex justifyContent="right">
                  <Box cursor="pointer">
                  <Link href={getExplorerLink(parseInt(data?.chainID), data.transactionHash, ExplorerDataType.TRANSACTION)} target="_blank" isExternal textDecoration="underline" fontSize="13px">
                    View Transaction
                    </Link>
                  </Box>
            </Flex>
        }
        
          
          </Box>
          
        </Flex>
    )
};

export default MarketHistory

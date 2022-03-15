import { Flex, Grid, Text, Box, useColorModeValue, Button, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { ArrowRightIcon } from '../../../../theme/components/Icons';
import TokenIcon from '../../../../assets/Null-24.svg';
import { ExplorerDataType, getExplorerLink } from '../../../../utils/getExplorerLink';
import { Link } from 'react-router-dom';
export interface TokenDetails {
  name: string,
  symbol: string,
  address: string,
  decimals: number
}

export interface DataType {
  token1Icon: string,
  token2Icon: string,
  token1: TokenDetails,
  token2: TokenDetails,
  amountIn: string,
  amountOut: string,
  time: string,
  name: string,
  frequency: string,
  id: string,
  transactionHash: string,
  error: [],
  status: number,
  currentToPrice?: string,
  chainID?: string,
}

const TransactionHistory = ({ data, deleteData }: { data: DataType, deleteData: any }) => {
  const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
  const nonActiveTabColor = useColorModeValue('#666666', '#4A739B');
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const pendingColor = useColorModeValue('#c8d41b', '#c8d41b');
  const successColor = useColorModeValue('#22bb33', '#22bb33');
  const failedColor = useColorModeValue('#75f083', "#FF4243");
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
        <Text
          color={activeTabColor}
          fontSize="14px"
          lineHeight="0"
          mt={3}
          mb={2}
        >
          Operation
        </Text>
        <Flex py={2}>
          <Flex mr={4}>
            <img src={data.token1Icon || TokenIcon} width={25} height={25} alt="logo" />
            <Text fontSize="sm" color={activeTabColor} ml={2}>
              {data.amountIn} <span>{data.token1.symbol}</span>
            </Text>
          </Flex>
          <ArrowRightIcon />
          <Flex ml={4}>
            <img src={data.token2Icon || TokenIcon} width={25} height={25} alt="logo" />
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
              {data.name ? data.name : "Straight Swap"}
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
            <Text color={activeTabColor} fontSize="14px" fontWeight="regular">
              {data.time}
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
            <Text color={data.status === 0 ? failedColor : data.status === 2 ? pendingColor : successColor} fontSize="14px" fontWeight="regular">
              {/* Completed */}
              {data.status === 1 || data.status === 10 ? "Completed" : data.status === 0 ? "Failed" : data.status === 2 ? "Pending" : data.status === 3 ? "Suspended" : ""}
            </Text>
            {data.name === "auto time" && data.id && data.status !== 4 ? <Button
              border=" 1px solid #CC334F" box-shadow="0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)"
              border-radius="6px" backgroundColor="transparent" mt="2" onClick={() => deleteData(data)}>
              Cancel
            </Button> : <></>}
            {data.name === "Set Price" && data.id && data.status === 2 ? <Button
              border=" 1px solid #CC334F" box-shadow="0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)"
              border-radius="6px" backgroundColor="transparent" mt="2" onClick={() => deleteData(data)}>
              Pause
            </Button> : data.id && data.status === 3 ? <Button
              border=" 1px solid #CC334F" box-shadow="0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)"
              border-radius="6px" backgroundColor="transparent" mt="2" onClick={() => deleteData(data)}>
              Resume
            </Button> : <></>}

          </Box>
          <Box>
            {data.error.length > 0 &&
              <>
                <Text
                  color={nonActiveTabColor}
                  fontSize="12px"
                  lineHeight="0"
                  mb="8px"
                >
                  Error
                </Text>
                <Text color={data.error.length > 0 ? failedColor : successColor} fontSize="14px" fontWeight="regular">
                  {data.error[0]}
                </Text>
              </>
            }

          </Box>
           
        </Grid>
        {data?.chainID && data.transactionHash &&
            <Flex justifyContent="right">
                  <Box cursor="pointer">
                  <a href={getExplorerLink(parseInt(data?.chainID), data.transactionHash, ExplorerDataType.TRANSACTION)} target="_blank">
                    <ArrowRightIcon />
                    </a>
                  </Box>
            </Flex>
        }
        
      </Box>
    </Flex>
  )
};

export default TransactionHistory

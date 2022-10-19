import { Flex, Grid, Text, Box, useColorModeValue, Button, Tooltip,Link, Img } from '@chakra-ui/react';
import React from 'react';
import { ArrowRightIcon } from '../../../../theme/components/Icons';
import TokenIcon from '../../../../assets/Null-24.svg';
import { ExplorerDataType, getExplorerLink } from '../../../../utils/getExplorerLink';
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
  _id?: string,
  transactionHash: string,
  error: [String],
  status: number | string,
  currentToPrice?: string,
  chainID: string,
  initialFromPrice?:string,
  initialToPrice?:string,
  rate?:string,
  situation?:string,
  pathSymbol?:string,
  market:string
  orderID:string
}

const TransactionHistory = ({ data, deleteData }: { data: DataType, deleteData: (data: DataType,value:number,type:string)=>void }) => {
  console.log(data.market.toLowerCase() ==="lydia" &&{data})
  const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
  const nonActiveTabColor = useColorModeValue('#666666', '#4A739B');
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const pendingColor = useColorModeValue('#c8d41b', '#c8d41b');
  const successColor = useColorModeValue('#22bb33', '#22bb33');
  const failedColor = useColorModeValue('#FF4243', "#FF4243");
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
          <ArrowRightIcon />
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
              </> : data.name==="Auto Time" &&
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
                  {data.currentToPrice}%({data.situation})
                </Text>
              </>
            }

          </Box>
         {data.frequency && data.frequency!=="price" ? <Box>
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
          </Box> : <Box>
          <Tooltip label="Execution price">
            <Text
              color={nonActiveTabColor}
              fontSize="12px"
              lineHeight="0"
              mb="8px"
            >
              
              E / Price...
            </Text>
            </Tooltip>
            <Text color={activeTabColor} fontSize="11px" fontWeight="regular">
              {data.initialFromPrice} {data.token1.symbol} &#8594; {data.initialToPrice} {data.token2.symbol}
            </Text>
          </Box>} 
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
              {data.time ? data.time :"-"}
            </Text>
          </Box>
         {(data.status <= 3) && <Box>
           <Box mb="15px">
<Text
              fontSize="12px"
              lineHeight="0"
              color={nonActiveTabColor}
              mb="8px"
            >
              Route
            </Text>
            
            <Text color={activeTabColor} fontSize="13px" fontWeight="regular">
              {data.pathSymbol}
            </Text>
           </Box>
           <Box>
            {data.status===2 &&  <Tooltip label="Number of transaction completed">
<Text
              fontSize="12px"
              lineHeight="0"
              color={nonActiveTabColor}
              mb="8px"
            >
              Number
            </Text>
           </Tooltip>}
            
            <Text color={activeTabColor} fontSize="14px" fontWeight="regular">
              {data.rate}
            </Text>
           </Box>
          
          </Box>}
          <Box>
            <Text
              color={nonActiveTabColor}
              fontSize="12px"
              lineHeight="0"
              mb="8px"
            >
              Status
            </Text>
            <Text color={data.status === 0 ? failedColor : (data.status === 2 || data.status===3) ? pendingColor : successColor} fontSize="14px" fontWeight="regular">
              {/* Completed */}
              {data.status === 1 || data.status === "10" ? "Completed" : data.status === 0 ? "Failed" : data.status === 2 ? "Pending" : data.status === 3 ? "Suspended" : ""}
            </Text>
            {(data.name === "Auto Time" || data.name==="Set Price") && data.id && (data.status ===2 || data.status ===3) ? <Button
              border={`1px solid ${data.status===2 ?pendingColor : successColor}`}
              border-radius="6px" backgroundColor="transparent" 
              mt="2" 
              onClick={() => deleteData(data,2,"pause")} 
              >
              {data.status===2 ? "Pause" : "Resume"}
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
        { data.transactionHash && data.chainID ?
            <Flex justifyContent="right">
              
                  <Box cursor="pointer">
                  <Link href={getExplorerLink(parseInt(data.chainID), data.transactionHash, ExplorerDataType.TRANSACTION)} target="_blank" isExternal textDecoration="underline" fontSize="13px">
                    View Transaction
                    </Link>
                  </Box>
            </Flex> : (data.status===2 || data.status===3) &&  
            <Flex justifyContent="right">
              <Box>
             <Text fontSize="14px" textDecoration="underline" cursor="pointer" color="red.300" onClick={() => deleteData(data,1,"delete")}>
              Delete
            </Text>
          </Box>
            </Flex>
            
        }
        
      </Box>
    </Flex>
  )
};

export default TransactionHistory

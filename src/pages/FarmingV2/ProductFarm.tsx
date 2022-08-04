import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Button,
  Spinner,
  Text,
  Grid,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { LIGHT_THEME, DARK_THEME } from "./index";
import { useWeb3React } from "@web3-react/core";
import Hot from "../../assets/hot.png"; 
import { useLocation} from 'react-router-dom';
import { GButtonClicked } from "../../components/G-analytics/gFarming";
import ShowProductFarmDetails from "./ShowProductFarmDetails"
import { formatAmount } from "../../utils/utilsFunctions";

const ProductFarm = ({
  content,
  farmDataLoading,
  wallet,
  URLReferrerAddress,
  refreshSpecialData,
  LoadingState,
  section,
}: {
  content?: {
    feature:string,
    percentageProfitShare:string,
    profitTimeLine:string,
    totalLiquidity:string,
    estimatedTotalProfit:string,
    pid:number,
    deposit:string,
    poolAllowance:string
    type:string
    RGPStaked:string
  };
    refreshSpecialData:() => void
  farmDataLoading: boolean;
  wallet: any;
  URLReferrerAddress?: string;
  LoadingState: boolean;
  section: string;
}) => {
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  const { chainId, library } = useWeb3React();
  const active = chainId && library;
  const [showYieldfarm, setShowYieldFarm] = useState(false);
  const params = useLocation().pathname;
  const myRef = useRef(null);


  return (
    <>
      <Grid ref={myRef}
        templateColumns={["repeat(1,1fr)","repeat(1,1fr)","repeat(6,1fr)"]}
        border='1px solid #DEE5ED'
        background={
          mode === LIGHT_THEME
            ? "#FFFFFF !important"
            : mode === DARK_THEME
            ? "#15202B !important"
            : "#FFFFFF !important"
        }
        color={
          mode === LIGHT_THEME
            ? "#333333"
            : mode === DARK_THEME
            ? "#DCE5EF"
            : "#333333"
        }
        borderColor={
          mode === LIGHT_THEME
            ? "#F2F5F8 !important"
            : mode === DARK_THEME
            ? "#213345 !important"
            : "#F2F5F8 !important"
        }
        padding='15px 20px'
        width={["100%", "100%", "100%"]}
      >
        <Flex justifyContent='space-between' width='100%'>
          <Box
            marginTop='15px'
            align='left'
            display={["block", "block", "none"]}
            opacity='0.5'
          >
            Product Feature
          </Box>
          <Box marginTop='15px' align='left'>
            {content?.feature} <img src={Hot} />
          </Box>
        </Flex>
        <Flex justifyContent='space-between' width='100%'>
          <Box
            marginTop='15px'
            align='left'
            display={["block", "block", "none"]}
            opacity='0.5'
          >
           Percentage Profit Share
          </Box>
          <Flex
            justifyContent='space-between'
            marginTop='15px'
            paddingLeft='30px'
            // align='left'
            alignItems='center'
          >
            {/* <RGPIcon />  */}
            <Text marginLeft='10px' mt={-5}>
              {formatAmount(content?.percentageProfitShare)}%
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent='space-between' width='100%'>
          <Box
            marginTop='15px'
            align='left'
            display={["block", "block", "none"]}
            opacity='0.5'
          >
           Profile Timeline
          </Box>
          <Box marginTop='15px' paddingLeft='20px' align='left'>
            {content?.profitTimeLine}
          </Box>
        </Flex>
        <Flex justifyContent='space-between' width='100%'>
          <Box
            marginTop='15px'
            align='left'
            display={["block", "block", "none"]}
            opacity='0.5'
          >
           Total Liquidity
          </Box>
          <Box marginTop='15px' paddingLeft='20px' align='left'>
              {content?.totalLiquidity && `${formatAmount(content?.totalLiquidity)}%` } 
          </Box>
        </Flex>
        <Flex
          justifyContent='space-between'
          width='100%'
          marginBottom={["10px", "10px", "0"]}
        >
          <Box
            marginTop='15px'
            align='left'
            display={["block", "block", "none"]}
            opacity='0.5'
          >
            Estimated Total Profits
          </Box>
          <Box marginTop='15px' paddingLeft='35px' align='right'>
            ${" "}
            {formatAmount(content?.estimatedTotalProfit)}
          </Box>
        </Flex>
        <Box align='right' mt={["4", "0"]} ml='2'>
         
          <Button
            w={["100%", "100%", "146px"]}
            h='40px'
            border='2px solid #319EF6'
            background={
              mode === LIGHT_THEME && active
                ? "#FFFFFF !important"
                : mode === DARK_THEME && active
                ? "#319EF6 !important"
                : mode === LIGHT_THEME && !active
                ? "#FFFFFF !important"
                : mode === DARK_THEME && !active
                ? "#15202B !important"
                : "#FFFFFF !important"
            }
            color={
              mode === LIGHT_THEME && active
                ? "#319EF6"
                : mode === DARK_THEME && active
                ? "#FFFFFF"
                : mode === LIGHT_THEME && !active
                ? "#319EF6"
                : mode === DARK_THEME && !active
                ? "#4CAFFF"
                : "#333333"
            }
            borderColor={
              mode === LIGHT_THEME && active
                ? "#4CAFFF !important"
                : mode === DARK_THEME && active
                ? "#319EF6 !important"
                : mode === LIGHT_THEME && !active
                ? "#4CAFFF !important"
                : mode === DARK_THEME && !active
                ? "#4CAFFF !important"
                : "#319EF6 !important"
            }
            borderRadius='6px'
            mb='4'
            _hover={{ color: "#423a85" }}
            onClick={() => {
              // if(!showYieldfarm){
              //   GButtonClicked("unlock button",content?.deposit,"v2")
              // }
              setShowYieldFarm(!showYieldfarm)}}
            className={"unlock"}
          >
            Unlock
          </Button>
          {/* )} */}
        </Box>
      </Grid>
      {showYieldfarm && (
        // <Stack>
        //   <Skeleton height='20px' />
        //   <Skeleton height='20px' />
        //   <Skeleton height='20px' />
        //   <Skeleton height='20px' />
        // </Stack>
        // <Skeleton>
        <ShowProductFarmDetails
          content={content}
          refreshSpecialData={refreshSpecialData}
          // content2={content2}
          LoadingState={LoadingState}
          section={section}
          // content2={content2}
          // showYieldfarm={loading}
          wallet={wallet}
          URLReferrerAddress={URLReferrerAddress}
        />
        // </Skeleton>
      )}
    </>
  );
};

export default ProductFarm;

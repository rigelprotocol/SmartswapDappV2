import React, { useState } from "react";
import { Box, Flex, Button, Spinner, Text } from "@chakra-ui/react";
import ShowYieldFarmDetails from "./ShowYieldFarmDetails";
import { useColorModeValue } from "@chakra-ui/react";
import { RGPIcon } from "./Icon";
import { LIGHT_THEME, DARK_THEME, useActiveWeb3React } from "./index";

const YieldFarm = ({
  content,
  wallet,
}: {
  content: {
    pid: number;
    totalLiquidity: string;
    earn: string;
    img: string;
    ARYValue: string;
    lpSymbol: string;
    tokensStaked: string[];
    availableToken: string;
  };
}) => {
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);

  const { chainId, library } = useActiveWeb3React();

  const active = chainId && library;
  const loadingTotalLiquidity = false;
  const [showYieldfarm, setShowYieldFarm] = useState(false);

  const formatAmount = (value: any) => parseFloat(value).toLocaleString();

  const totalLiquidityValue = () => {
    if (loadingTotalLiquidity) return <Spinner speed="0.65s" color="#333333" />;

    if (content.totalLiquidity) {
      return `$ ${formatAmount(content.totalLiquidity)}`;
    }
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection={["column", "column", "row"]}
        border="1px solid #DEE5ED"
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
        padding="15px 20px"
        width={["100%", "100%", "100%"]}
      >
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Deposit
          </Box>
          <Box marginTop="15px" align="left">
            {content.lpSymbol}
          </Box>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Earn
          </Box>
          <Flex
            justifyContent="space-between"
            marginTop="15px"
            paddingLeft="30px"
            align="left"
          >
            <RGPIcon /> <Text marginLeft="10px">{content.earn}</Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            APY
          </Box>
          <Box marginTop="15px" paddingLeft="50px" align="left">
            {formatAmount(content.ARYValue)} %
          </Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          width="100%"
          marginBottom={["10px", "10px", "0"]}
        >
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Total Liquidity
          </Box>
          <Box marginTop="15px" paddingLeft="65px" align="right">
            {totalLiquidityValue()}
          </Box>
        </Flex>
        <Box align="right" mt={["4", "0"]} ml="2">
          {Number(content.pid) === 1 ? (
            <Button
              w={["100%", "100%", "146px"]}
              h="40px"
              border="2px solid #319EF6"
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
              borderRadius="6px"
              mb="4"
              _hover={{ color: "#423a85" }}
              onClick={() => setShowYieldFarm(!showYieldfarm)}
            >
              Unlock
            </Button>
          ) : (
            <Button
              w={["100%", "100%", "146px"]}
              h="40px"
              border="2px solid #319EF6"
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
              borderRadius="6px"
              mb="4"
              _hover={{ color: "#423a85" }}
              onClick={() => setShowYieldFarm(!showYieldfarm)}
            >
              Unlock
            </Button>
          )}
        </Box>
      </Flex>
      {showYieldfarm && <ShowYieldFarmDetails content={content} wallet={wallet}/>}
    </>
  );
};

export default YieldFarm;

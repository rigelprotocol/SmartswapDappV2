import React from "react";
import { Box, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
// import PropTypes from 'prop-types';
// BNB image
// import BNBImage from '../../assets/bnb.svg';
import RGPImage from "../../assets/rgp.svg";
import ETHImage from "../../assets/eth.svg";
import BUSDImage from "../../assets/busd.svg";
import NullImage from "../../assets/Null-24.svg";

const LiquidityDetails = (props: LiquidityDetail) => (
  <Box
    color="#fff"
    bg="#29235E"
    px={4}
    py={3}
    mx={5}
    borderRadius="0 0 20px 20px"
    justifyContent="space-between"
  >
    <Flex mb="10px" py={2} justifyContent="space-between">
      <Box>
        Pooled{" "}
        {props.pair.path[0].token === "WBNB"
          ? "BNB"
          : props.pair.path[0].token}
      </Box>
      <Box>
        {props.pair.path[0].token === "RGP" ? (
          <RGPImage />
        ) : props.pair.path[0].token === "BUSD" ? (
          <BUSDImage />
        ) : props.pair.path[0].token === "ETH" ? (
          <ETHImage />
        ) : (
          <NullImage />
        )}
        {props.pair.pooledToken0}
      </Box>
    </Flex>
    <Flex mb="10px" py={2} justifyContent="space-between">
      <Box>
        Pooled{" "}
        {props.pair.path[1].token === "WBNB"
          ? "BNB"
          : props.pair.path[1].token}
      </Box>
      <Box>
        {props.pair.path[1].token === "RGP" ? (
          <RGPImage />
        ) : props.pair.path[1].token === "BUSD" ? (
          <BUSDImage />
        ) : props.pair.path[1].token === "ETH" ? (
          <ETHImage />
        ) : (
          <NullImage />
        )}
        {props.pair.pooledToken1}
      </Box>
    </Flex>
    <Flex mb="10px" py={2} justifyContent="space-between">
      <Box>Pool Tokens</Box>
      <Box>{props.pair.poolToken}</Box>
    </Flex>
    <Flex mb="10px" py={2} justifyContent="space-between">
      <Box>Pool Share</Box>
      <Box>{props.pair.poolShare}</Box>
    </Flex>
    <Flex mb="10px" py={2} justifyContent="space-between">
      <Button
        w="60%"
        h="50px"
        borderRadius="12px"
        bg="rgba(64, 186,213, 0.1)"
        color="#40BAD5"
        border="0"
        mb="4"
        mr="6"
        cursor="pointer"
        // disabled={props.addMoreLiquidityButton}
        _hover={{ color: "#423a85" }}
        // onClick={() => props.addMoreLiquidity(props.pair)}
      >
        Add
      </Button>
      <Button
        w="60%"
        h="50px"
        borderRadius="12px"
        bg="rgba(64, 186,213, 0.1)"
        color="#40BAD5"
        border="0"
        mb="4"
        cursor="pointer"
        _hover={{ color: "#423a85" }}
        // onClick={() => removeLiquidity()}
        // onClick={() => props.removeALiquidity(props.pair.pairAddress)}
      >
        Remove
      </Button>
    </Flex>
  </Box>
);

interface LiquidityDetail {
  pair: {
    path: {
      token: string;
    }[];
    pairAddress: string;
    poolToken: string;
    poolShare: string;
    pooledToken0: string;
    pooledToken1: string;
  };
}
export default LiquidityDetails;

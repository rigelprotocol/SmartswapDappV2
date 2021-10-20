import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { ChevronDownIcon } from "@chakra-ui/icons";
// import BNBImage from '../../assets/bnb.svg';
// import RGPImage from "../../assets/rgp.svg";
// import ETHImage from "../../assets/eth.svg";
// import NullImage from "../../assets/Null-24.svg";
// import BUSDImage from "../../assets/busd.svg";
import LiquidityDetails from "./liquidityDetails";

const Liquidities = (props: Liquidity) => {
  const currency0 = props.pair.token0
  const currency1 = props.pair.token1
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <Flex
        color="#fff"
        bg="#29235E"
        px={4}
        py={4}
        mx={5}
        borderRadius={showDetails ? "20px 20px 0 0" : "20px"}
        justifyContent="space-between"
        my={3}
      >
        <Box>
        {!currency0 || !currency1 ? (
                <Box>
                  <Text>Loading</Text>
                </Box>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
        </Box>
        <Box>
          <ChevronDownIcon
            h={4}
            w={4}
            onClick={() => setShowDetails(!showDetails)}
            cursor="pointer"
          />
        </Box>
      </Flex>
      {showDetails ? (
        <LiquidityDetails
        pair ={props.pair}
        // showUnwrapped = {props.showUnwrapped}
        // border = {props.border}
        // stakedBalance = {props.stakedBalance}
          
        />
      ) : (
        <div />
      )}
    </>
  );
};

interface Liquidity {
  pair:any//Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: any //CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export default Liquidities;

import { Flex, Text } from "@chakra-ui/layout";
import React from "react";
import { DARK_THEME, LIGHT_THEME } from "./index";
import { useColorModeValue } from "@chakra-ui/react";

const FarmHeader = () => {
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={4}
        background={
          mode === LIGHT_THEME
            ? "#F2F5F8  !important"
            : mode === DARK_THEME
            ? "#213345"
            : mode === LIGHT_THEME
            ? "#F2F5F8"
            : "#F2F5F8 !important"
        }
        color={
          mode === LIGHT_THEME
            ? "#333333"
            : mode === DARK_THEME
            ? "#F1F5F8"
            : mode === DARK_THEME
            ? "#F1F5F8"
            : mode === LIGHT_THEME
            ? "#333333"
            : "#333333"
        }
        w={["100%", "100%", "100%"]}
        align="left"
        border={
          mode === LIGHT_THEME
            ? "1px solid #DEE5ED !important"
            : mode === DARK_THEME
            ? "1px solid #324D68 !important"
            : "1px solid #324D68"
        }
        display={{ base: "none", md: "flex", lg: "flex" }}
      >
        <Text>Deposit</Text>
        <Text>Earn</Text>
        <Text>APY</Text>
        <Text>Total Liquidity</Text>
        <Text />
      </Flex>
    </>
  );
};

export default FarmHeader;

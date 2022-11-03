import React, { useState, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Img,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import MATICLOGO from "../../../../assets/Matic.svg";
import OASISLOGO from "../../../../assets/oasissvg.svg";
import AVAXLOGO from "../../../../assets/AVAX.svg";
import { useActiveWeb3React } from "../../../../utils/hooks/useActiveWeb3React";
import { SupportedChainId } from "../../../../constants/chains";

const BridgeCard = () => {
  const backgroundColor = useColorModeValue("#DCD9FA", "#1F1933");
  const oasisbgColor = useColorModeValue("#EBF7FF", "#00304D");
  const avaxbgColor = useColorModeValue("red.300", "red.900");
  const AVAXTextColor = useColorModeValue("white", "white");
  const oasisTextColor = useColorModeValue("#0089DB", "#66C6FF");
  const textColor = useColorModeValue("#8247E5", "#A479EC");
  const { chainId } = useActiveWeb3React();

  return (
    <>
      {chainId === 137 ||
        chainId === 80001 ||
        chainId === 42262 ||
        chainId === 42261 ||
        chainId === SupportedChainId.AVALANCHE ||
        chainId === SupportedChainId.AVALANCHE_FUJI 
        ? (
        <Box
          mt={5}
          h='86px'
          pt={4}
          px={3}
          fontWeight='400'
          borderRadius='6px'
          backgroundColor={
            chainId === 137 || chainId === 80001
              ? backgroundColor :
              chainId ===43114 || chainId===43113 ?
              avaxbgColor
              : oasisbgColor
          }
        >
          <Flex alignItems='center' justifyContent='space-between'>
            <Flex alignItems='center'>
              <Img
                w='28px'
                h='28px'
                src={
                  chainId === 137 || chainId === 80001 ? MATICLOGO :chainId ===43114 || chainId===43113 ? AVAXLOGO : OASISLOGO
                }
              />
              <Box ml={4}>
                <Text
                  fontWeight='normal'
                  fontSize='16px'
                  color={
                    chainId === 137 || chainId === 80001
                      ? textColor
                      : chainId ===43114 || chainId===43113 ? AVAXTextColor : oasisTextColor
                  }
                  mb={2}
                >
                  {chainId === 137 || chainId === 80001
                    ? "Polygon Token Bridge"
                    :chainId ===43114 || chainId===43113 ? 
                    "Deposit tokens on Avalanche"
                    : "Deposit tokens on Oasis Network"}
                </Text>
                {chainId === 137 || chainId === 80001 ? (
                  <Text fontWeight='normal' fontSize='14px' color={textColor}>
                    Deposit tokens to the polygon network.
                  </Text>
                ) : chainId === SupportedChainId.AVALANCHE || SupportedChainId.AVALANCHE_FUJI ? (
                  <Text
                  fontWeight='normal'
                  fontSize='14px'
                  color={AVAXTextColor}
                >
                  Bridge to Avalanche
                  {/* <a
                    href='https://portalbridge.com/#/transfer'
                    style={{ textDecoration: "underline" }}
                    target='_blank'
                  >
                    Wormhole
                  </a> */}
                </Text>
                ) : (
                  <Text
                    fontWeight='normal'
                    fontSize='14px'
                    color={oasisTextColor}
                  >
                    Powered by{" "}
                    <a
                      href='https://portalbridge.com/#/transfer'
                      style={{ textDecoration: "underline" }}
                      target='_blank'
                    >
                      Wormhole
                    </a>
                  </Text>
                )}
              </Box>
            </Flex>
            <Link
              href={
                chainId === 137 || chainId === 80001
                  ? "https://wallet.polygon.technology/bridge"
                  :chainId ===43114 || chainId===43113 ?
                  "https://bridge.avax.network/login"
                  : "https://portalbridge.com/#/transfer"
              }
              isExternal
            >
              <ExternalLinkIcon
                w='28px'
                color={
                  chainId === 137 || chainId === 80001
                    ? textColor
                    : chainId ===43114 || chainId===43113 ? AVAXTextColor : oasisTextColor}
                padding='2px'
                mb={3}
                h='28px'
              />
            </Link>
          </Flex>
        </Box>
      ) : (
        <Box />
      )}
    </>
  );
};

export default BridgeCard;

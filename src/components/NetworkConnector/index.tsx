import {
  Button,
  Modal,
  Box,
  Text,
  Flex,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { BinanceIcon, EthereumIcon } from "./Icons";
import { useColorModeValue } from "@chakra-ui/react";
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { CHAIN_INFO } from "../../constants/chains";

function NetworkIndicator() {
function useActiveWeb3React() {
    const context = useWeb3React<Web3Provider>()
    const contextNetwork = useWeb3React<Web3Provider>('NETWORK')
    return context.active ? context : contextNetwork
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mode = useColorModeValue("light", "dark");
  const { chainId, library } = useActiveWeb3React();

  const info = chainId ? CHAIN_INFO[chainId] : undefined;

  if (!chainId || !info || !library) {
    return null
  }


  return (
    <>
      <Button onClick={onOpen} mx={2}>
        <Flex alignItems="center">
          <Box mr={2}>
          {info.label !== 'Binance' ? <EthereumIcon /> 
          :  <BinanceIcon /> 
          } 
          </Box>
          <Text color="#319EF6">{info.label}</Text>
        </Flex>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <Flex flexDirection="column" mx={5}>
            <Flex my={4} >
              <ModalCloseButton border={
                mode === "dark" ? "1px solid #FFF" : "1px solid #666666"
              }/>
            </Flex>
            <Flex mt={8}>
              <Text
                fontSize="20px"
                lineHeight="28px"
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
              >
                Change Network
              </Text>
            </Flex>
            <Flex>
              <Text
                fontSize="16px"
                lineHeight="28px"
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
                mb={3}
              >
                You are currently on the{" "}
                <span style={{ color: "#319EF6" }}>{info.label}</span> network.
              </Text>
            </Flex>
            <Flex
              backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
              border={
                mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
              }
              borderRadius="6px"
              py={4}
              px={3}
              mb={3}
            >
              <Box px={2}>
                <EthereumIcon />
              </Box>
              <Box>{CHAIN_INFO[1].label}</Box>
            </Flex>
            <Flex
              backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
              border={
                mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
              }
              borderRadius="6px"
              py={4}
              px={3}
              mb={3}
            >
              <Box px={2}>
                <BinanceIcon />
              </Box>
              <Box>{CHAIN_INFO[56].label} Smart Chain</Box>
            </Flex>
            <Flex
              backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
              border={
                mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
              }
              borderRadius="6px"
              px={3}
              py={4}
              mb={4}
            >
              <Box px={2}>
                <EthereumIcon />
              </Box>
              <Box>{CHAIN_INFO[137].label}</Box>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NetworkIndicator;

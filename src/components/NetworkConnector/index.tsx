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

function NetworkIndicator() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mode = useColorModeValue("light", "dark");

  return (
    <>
      <Button onClick={onOpen} mx={2}>
        <Flex alignItems="center">
          <Box mr={2}>
            <BinanceIcon />
          </Box>
          <Text color="#319EF6">Rinkeby</Text>
        </Flex>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <Flex flexDirection="column" mx={5}>
            <Flex my={4}>
              <ModalCloseButton />
            </Flex>
            <Flex mt={8}>
              <Text
                fontFamily="Cera Pro"
                fontSize="20px"
                lineHeight="28px"
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
              >
                Change Network
              </Text>
            </Flex>
            <Flex>
              <Text
                fontFamily="Cera Pro"
                fontSize="16px"
                lineHeight="28px"
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
                mb={3}
              >
                You are currently on the{" "}
                <span style={{ color: "#319EF6" }}>Ethereum</span> network.
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
                <BinanceIcon />
              </Box>
              <Box>Binance Smart Chain</Box>
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
              <Box>Ethereum</Box>
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
              <Box>Polygon</Box>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NetworkIndicator;

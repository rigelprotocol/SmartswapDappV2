import React from "react";
import {
  Flex,
  Spacer,
  Box,
  Img,
  Text,
  Stack,
  Link,
  Button,
  Image,
} from "@chakra-ui/react";
import MetamaskLogo from "./../../assets/metamaskLogo.png";

export default function WalletConnection() {
  return (
    <>
      <Button variant="rgpButton">349.0003 RGP</Button>
      <Flex
        ml={2}
        w="270px"
        borderRadius="md"
        h="10"
        bg="gray.100"
        justify="space-between"
      >
        <Flex align="center" justify="center">
          <Text ml={2}>11.0787 ETH</Text>
        </Flex>
        <Button
          bg="white"
          border="1px solid #F2F5F8"
          rightIcon={
            <Image boxSize="20px" objectFit="contain" src={MetamaskLogo} />
          }
        >
          0X234...3940
        </Button>
      </Flex>
      {/* <Button rightIcon={<IoWalletOutline />} variant="brand">
        Connect Wallet
      </Button> */}
    </>
  );
}

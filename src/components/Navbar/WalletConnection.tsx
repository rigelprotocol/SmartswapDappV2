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
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { IoWalletOutline } from "react-icons/io5";
import { shortenAddress } from "../../utils";
import MetamaskLogo from "./../../assets/metamaskLogo.png";
import { injected } from "../../connectors";

export default function WalletConnection() {
  const { account, error, activate } = useWeb3React();

  const connectAccount = () => {
    try {
      activate(injected);
    } catch (error) {
      console.log(error);
    }
  };
  if (account) {
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
            {shortenAddress(account)}
          </Button>
        </Flex>
      </>
    );
  } else if (error) {
    return (
      <Button bg="red.300" rightIcon={<IoWalletOutline />} variant="brand">
        {error instanceof UnsupportedChainIdError ? "Wrong Network" : "Error"}
      </Button>
    );
  } else {
    return (
      <Button
        onClick={connectAccount}
        rightIcon={<IoWalletOutline />}
        variant="brand"
      >
        Connect Wallet
      </Button>
    );
  }
}

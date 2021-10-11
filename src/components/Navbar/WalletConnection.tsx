import React from "react";
import {
    Flex,
    Text,
    Box,
    Button,
    Image,
    ModalOverlay, ModalContent, Modal, ModalCloseButton, useDisclosure, useColorModeValue
} from "@chakra-ui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { IoWalletOutline } from "react-icons/io5";
import { shortenAddress } from "../../utils";
import MetamaskLogo from "./../../assets/metamaskLogo.png";
import { injected } from "../../connectors";
import WalletOptions from "./WalletOptions";

export default function WalletConnection() {
  const { account, error, activate } = useWeb3React();
    const bgColor = useColorModeValue("lightBg.100", "darkBg.100");
    const bgColor2 = useColorModeValue("lightBg.200", "darkBg.100");

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Button variant="rgpButton" bg={bgColor}>349.0003 RGP</Button>
        <Flex
          ml={2}
          w="270px"
          borderRadius="md"
          border={'1px solid'}
          borderColor={bgColor2}
          h="10"
          justify="space-between"
        >
          <Flex align="center" justify="center" bg={bgColor2} px={2}>
            <Text ml={2} fontWeight={'bold'}>11.0787 ETH</Text>
          </Flex>
          <Button
              variant={'ghost'}
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
        <>
          <Button
              onClick={onOpen}
              rightIcon={<IoWalletOutline />}
              variant="brand"
          >
            Connect Wallet
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                width="90vw"
                borderRadius="20px"
                minHeight="40vh"
            >
              <ModalCloseButton
                  bg="none"
                  border="0px"
                  mt={4}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={onClose}
              />
              <WalletOptions connect={connectAccount}/>
            </ModalContent>
          </Modal>
        </>
    );
  }
}

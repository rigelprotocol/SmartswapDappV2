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
  Img
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BinanceIcon, EthereumIcon } from "./Icons";
import { useColorModeValue } from "@chakra-ui/react";
import { CHAIN_INFO } from "../../constants/chains";
import { switchNetwork, useProvider} from "../../utils/utilsFunctions";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import OASISLOGO from "../../assets/oasis.png";
import MATICLOGO from "../../assets/maticlogo.png";
import { GNetworkConnectedTo } from "../G-analytics/gIndex";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../state";
import {updateChainId} from "../../state/newfarm/actions";

function NetworkIndicator() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mode = useColorModeValue("light", "dark");
  const { chainId, library, account } = useActiveWeb3React();
  const buttonBgColor = useColorModeValue("#EBF6FE", "#213345");
  const textColor = useColorModeValue("#319EF6", "#4CAFFF");
  const dispatch = useDispatch();

  const ChainId = useSelector<RootState>((state) => state.newfarm.chainId);
  const {ethereum} = window;
  const {prov} = useProvider();

  useEffect(() => {
    const getNetwork = () => {
      try {
        if (ethereum) {
          const networkId = ethereum.networkVersion;
          dispatch(updateChainId({ value : Number(networkId) }));
        }
      } catch (e) {
        console.log(e, 'Could not fetch Metamask network.')
      }
    };

    getNetwork();

  }, []);

  const info = chainId ? CHAIN_INFO[chainId] : CHAIN_INFO[ChainId as number];

  useEffect(() => {
    GNetworkConnectedTo(info?.label);
    if (chainId && chainId !== ChainId) {
      dispatch(updateChainId({ value : chainId }));
    }

  },[chainId]);



  const changeNetwork = async (network: string, id: number) => {
    onClose();
    const lib = library ? library : prov;
    switchNetwork(network, account as string, lib).then(() => {
      dispatch(updateChainId({ value : id }));
    }).catch((e) => {
      console.log(e)
    })
  };

  if (!ChainId || !info) {
    return null;
  }
  return (
    <>
      <Button
        _hover={{ bgColor: buttonBgColor }}
        _active={{ bgColor: buttonBgColor }}
        bgColor={buttonBgColor}
        onClick={onOpen}
        mr={2}
        className="Network"

      >
        <Flex alignItems='center'>
          <Box mr={2}>
            {info.label == "Binance" ? (
              <BinanceIcon />
            ) : // <EthereumIcon />
              info.label == "BSC Testnet" ? (
                <BinanceIcon />
              ) : info.label == "Polygon" ? (
                <Img w='30px' src={MATICLOGO} />
              ) : info.label == "Mumbai Testnet" ? (
                <Img w='30px' src={MATICLOGO} />
              ) : info.label == "Oasis Emerald Testnet" ? (
                <Img w='30px' src={OASISLOGO} />
              ) : info.label == "Oasis Emerald Mainnet" ? (
                <Img w='30px' src={OASISLOGO} />
              ) : (
                <EthereumIcon />
              )}
          </Box>
          <Text textColor={textColor} fontSize='14px'>
            {info.label}
          </Text>
        </Flex>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='sm'>
        <ModalOverlay />
        <ModalContent>
          <Flex flexDirection='column' mx={5}>
            <Flex my={4}>
              <ModalCloseButton
                border={
                  mode === "dark" ? "1px solid #FFF" : "1px solid #666666"
                }
              />
            </Flex>
            <Flex mt={8}>
              <Text
                fontSize='20px'
                lineHeight='28px'
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
              >
                Change Network
              </Text>
            </Flex>
            <Flex>
              <Text
                fontSize='16px'
                lineHeight='28px'
                color={mode === "dark" ? "#F1F5F8" : "#333333"}
                mb={3}
              >
                You are currently on the{" "}
                <span style={{ color: "#319EF6" }}>
                  {info.nativeCurrency.name}
                </span>{" "}
                network.
              </Text>
            </Flex>
            <Flex
              backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
              border={
                mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
              }
              borderRadius='6px'
              py={4}
              px={3}
              mb={3}
              cursor='pointer'
              textAlign={'left'}
              onClick={() => {
                changeNetwork('0x3', 3)
              }}
            >
                <Flex>
                  <Box px={2}>
                    <EthereumIcon />
                  </Box>
                  <Box>{CHAIN_INFO[3]?.label}</Box>
                </Flex>
            </Flex>
            <Flex
              backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
              border={
                mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
              }
              borderRadius='6px'
              py={4}
              px={3}
              mb={3}
              cursor='pointer'
              onClick={() => {
                changeNetwork('0x38', 56);
              }}
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
              borderRadius='6px'
              px={3}
              py={4}
              mb={4}
              cursor='pointer'
              onClick={() => {
                changeNetwork('0x89', 137);
              }}
            >
                <Flex>
                  <Box px={2}>
                    <Img w='30px' src={MATICLOGO} />
                  </Box>
                  <Box>{CHAIN_INFO[137].label}</Box>
                </Flex>
            </Flex>
            <Flex
              backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
              border={
                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
              }
              borderRadius="6px"
              px={3}
              py={4}
              mb={4}
              cursor="pointer"
              onClick={() => changeNetwork('0xa516', 42262)}
            >
                <Flex>
                  <Box px={2}>
                    <Img w='30px' src={OASISLOGO} />
                  </Box>
                  <Box>{CHAIN_INFO[42262].label}</Box>
                </Flex>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NetworkIndicator;

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
} from '@chakra-ui/react';
import React from 'react';
import { BinanceIcon, EthereumIcon } from './Icons';
import { useColorModeValue } from '@chakra-ui/react';
import { CHAIN_INFO } from '../../constants/chains';
import { switchNetwork } from '../../utils/utilsFunctions';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';

function NetworkIndicator() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mode = useColorModeValue('light', 'dark');
  const { chainId, library, account } = useActiveWeb3React();
  const buttonBgColor = useColorModeValue('#EBF6FE', '#213345');
  const textColor = useColorModeValue('#319EF6', '#4CAFFF');

  const info = chainId ? CHAIN_INFO[chainId] : undefined;

  if (!chainId || !info || !library) {
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
      >
        <Flex alignItems="center">
          <Box mr={2}>
            {info.label !== 'Binance' && info.label !== 'Binance Testnet' ? (
              <EthereumIcon />
            ) : (
              <BinanceIcon />
            )}
          </Box>
          <Text textColor={textColor} fontSize="14px">{info.label}</Text>
        </Flex>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <Flex flexDirection="column" mx={5}>
            <Flex my={4}>
              <ModalCloseButton
                border={
                  mode === 'dark' ? '1px solid #FFF' : '1px solid #666666'
                }
              />
            </Flex>
            <Flex mt={8}>
              <Text
                fontSize="20px"
                lineHeight="28px"
                color={mode === 'dark' ? '#F1F5F8' : '#333333'}
              >
                Change Network
              </Text>
            </Flex>
            <Flex>
              <Text
                fontSize="16px"
                lineHeight="28px"
                color={mode === 'dark' ? '#F1F5F8' : '#333333'}
                mb={3}
              >
                You are currently on the{' '}
                <span style={{ color: '#319EF6' }}>
                  {info.nativeCurrency.name}
                </span>{' '}
                network.
              </Text>
            </Flex>
            <Flex
              backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
              border={
                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
              }
              borderRadius="6px"
              py={4}
              px={3}
              mb={3}
              cursor="pointer"
              onClick={() => {
                onClose();
                switchNetwork('0x1', account as string, library);
              }}
            >
              <Box px={2}>
                <EthereumIcon />
              </Box>
              <Box>{CHAIN_INFO[1].label}</Box>
            </Flex>
            <Flex
              backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
              border={
                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
              }
              borderRadius="6px"
              py={4}
              px={3}
              mb={3}
              cursor="pointer"
              onClick={() => {
                onClose();
                switchNetwork('0x38', account as string, library);
              }}
            >
              <Box px={2}>
                <BinanceIcon />
              </Box>
              <Box>{CHAIN_INFO[56].label} Smart Chain</Box>
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
              onClick={() => {
                onClose();
                switchNetwork('0x89', account as string, library);
              }}
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

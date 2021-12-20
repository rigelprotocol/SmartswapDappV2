import React, { useState } from 'react';
import {
  Flex,
  Text,
  Button,
  useColorModeValue,
  useMediaQuery,
  useDisclosure
} from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { IoWalletOutline } from 'react-icons/io5';
import { shortenAddress } from '../../utils';
import WalletModal from './modals/walletModal';
import NetworkModal from "./modals/networkModal";
import { useNativeBalance, useRGPBalance } from '../../utils/hooks/useBalances';
import StatusIcon from './StatusIcon';
import UnsupportNetwork from '../NetworkConnector/UnsupportNetwork';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';




export default function WalletConnection() {


  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, error, activate, connector, chainId } = useWeb3React();

  const [isMobileDevice] = useMediaQuery('(max-width: 1200px)');

  const bg = useColorModeValue('#FFFFFF', '#15202B');
  const bgColor = useColorModeValue('lightBg.100', 'darkBg.100');
  const bgColor2 = useColorModeValue('lightBg.200', 'darkBg.100');
  const bgColor3 = useColorModeValue('#DEE6ED', '#4A739B');
  const shadow = useColorModeValue(
    '0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)',
    '0px 2px 4px -2px rgba(178, 193, 230, 0.12), 0px 4px 4px -2px rgba(178, 193, 230, 0.08)'
  );
  const buttonBorder = useColorModeValue('gray.200', 'gray.100');

  const [Balance, Symbol] = useNativeBalance();
  const [displayWallet, setDisplayWallet] = useState(false);
  const [displayNetwork, setDisplayNetwork] = useState(false);
  const [RGPBalance] = useRGPBalance();
  const [modalDisplay, setDisplayModal] = useState(false)

  const supportedNetworks = [1,
    3,
    4,
    5,
    6,
    137,
    56,
    97,
    80001]

  const isSupportedNetwork = (chainId: any) =>
    supportedNetworks.includes(chainId);

  if (account) {
    return (
      <>
        <Button
          display={isMobileDevice ? 'none' : undefined}
          variant="rgpButton"
          bg={bgColor}
          fontSize="14px"
        >
          {RGPBalance} {RGPBalance ? 'RGP' : '0.0000 RGP'}
        </Button>
        <Flex
          ml={2}
          w={isMobileDevice ? '160px' : 'max-content'}
          borderRadius="md"
          border={'1px solid'}
          borderColor={bgColor2}
          h="10"
          justify="space-between"
        >
          <Flex
            display={isMobileDevice ? 'none' : undefined}
            align="center"
            justify="center"
            bg={bgColor2}
            px={2}
          >
            <Text fontWeight={'bold'} fontSize="14px">
              {Balance} {Symbol}
            </Text>
          </Flex>
          <Button
            onClick={() => setDisplayWallet((state) => !state)}
            variant={'ghost'}
            fontSize="14px"
            rightIcon={<StatusIcon connector={connector} />}
          >
            {shortenAddress(account)}
          </Button>
        </Flex>
        <WalletModal
          displayWallet={displayWallet}
          accounts={account}
          setDisplayWallet={setDisplayWallet}
        />
      </>
    );
  }
  if (!isSupportedNetwork(chainId)) {
    return (
      <>
        <Button
          variant="brand"
          border="none"
          fontWeight="regular"
          fontSize="md"
          rounded="xl"
          cursor="pointer"
          onClick={() => setDisplayModal(state => !state)}
        >
          Unsupported Network
        </Button>

        <UnsupportNetwork openModal={modalDisplay} setDisplayModal={setDisplayModal} /></>

    )
  }
  return (
    <>
      <Button
        onClick={() => setDisplayNetwork(state => !state)}
        rightIcon={<IoWalletOutline />}
        variant="brand"
      >
        Connect Wallet
      </Button>
      <NetworkModal displayNetwork={displayNetwork} setDisplayNetwork={setDisplayNetwork} />
    </>
  );
}


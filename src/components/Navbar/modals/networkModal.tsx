import React from 'react';
import {Modal, ModalCloseButton, ModalContent, ModalOverlay, useColorModeValue,} from '@chakra-ui/react';
import WalletOptions from '../WalletOptions';
import {connectorKey, ConnectorNames} from '../../../connectors';
import useAuth from '../../../utils/hooks/useAuth';
import { GWalletConnected } from '../../G-analytics/gIndex';

const NetworkModal = ({
  displayNetwork,
  setDisplayNetwork,
}: {
  displayNetwork: boolean;
  setDisplayNetwork: Function;
}) => {
  const bgColor3 = useColorModeValue('#DEE6ED', '#4A739B');
  const shadow = useColorModeValue(
    '0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)',
    '0px 2px 4px -2px rgba(178, 193, 230, 0.12), 0px 4px 4px -2px rgba(178, 193, 230, 0.08)'
  );
  const bg = useColorModeValue('#FFFFFF', '#15202B');
  const buttonBorder = useColorModeValue('gray.200', 'gray.100');
  const { login } = useAuth();

  const connectWallet = (connectorID: ConnectorNames,name:string) => {
    GWalletConnected(name)
    login(connectorID);
    window.localStorage.setItem(connectorKey, connectorID);
    setDisplayNetwork(false);
  };

  return (
    <>
      <Modal
        isOpen={displayNetwork}
        onClose={() => setDisplayNetwork(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width="90vw"
          borderRadius="6px"
          border={'1px solid'}
          borderColor={bgColor3}
          minHeight="40vh"
          boxShadow={shadow}
          bg={bg}
        >
          <ModalCloseButton
            bg="none"
            size={'sm'}
            mt={6}
            mr={3}
            cursor="pointer"
            _focus={{ outline: 'none' }}
            onClick={() => setDisplayNetwork(false)}
            p={'7px'}
            border={'1px solid'}
            borderColor={buttonBorder}
          />
          <WalletOptions connect={connectWallet} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default NetworkModal;

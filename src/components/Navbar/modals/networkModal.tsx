import React, {useCallback} from "react";
import {
    ModalOverlay,
    ModalContent,
    Modal,
    ModalCloseButton,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import WalletOptions from "../WalletOptions";
import { ConnectorNames, connectorsByName} from "../../../connectors";

const NetworkModal = ({displayNetwork, setDisplayNetwork}) => {
  const bgColor3 = useColorModeValue('#DEE6ED', '#4A739B');
  const shadow = useColorModeValue(
    '0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)',
    '0px 2px 4px -2px rgba(178, 193, 230, 0.12), 0px 4px 4px -2px rgba(178, 193, 230, 0.08)'
  );
  const bg = useColorModeValue('#FFFFFF', '#15202B');
  const buttonBorder = useColorModeValue('gray.200', 'gray.100');
  const { activate} = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const connectWallet = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID];
      try {
        activate(connector);
      } catch (e) {
        console.log(e);
      }
    },
    [activate]
  );

  return (
    <>
    <Modal isOpen={displayNetwork} onClose={()=>setDisplayNetwork(false)} isCentered>
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
          onClick={()=>setDisplayNetwork(false)}
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

import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  Modal,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  useColorModeValue,
  Box,
  Flex,
  Heading,
  Text,
  Divider,
  Button,
} from '@chakra-ui/react';
import { useUserSlippageTolerance } from '../../../state/user/hooks';

export type IModal = {
  title: string;
  amount: string;
  from: string;
  fromPrice: string;
  to: string;
  toPrice: string;
  fromDeposited: string;
  toDeposited: string;
  poolShare: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddLiquidity: () => void;
  pairAvailable: boolean;
  priceBperA: string;
  priceAperB: string;
};

const ConfirmModal: React.FC<IModal> = ({
  title,
  amount,
  from,
  to,
  fromPrice,
  toPrice,
  fromDeposited,
  toDeposited,
  poolShare,
  showModal,
  setShowModal,
  handleAddLiquidity,
  pairAvailable,
  priceBperA,
  priceAperB,
}) => {
  const bgColor = useColorModeValue('#F2F5F8', '#213345');
  const lightTextColor = useColorModeValue('#666', '#DCE6EF');
  const heavyTextColor = useColorModeValue('#333', '#F1F5F8');
  const heavyTextColor2 = useColorModeValue('#333', '#333');
  const [userSlippageTolerance] = useUserSlippageTolerance();

  return (
    <>
      {/* <button onClick={onOpen}>click me</button> */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent
          width="95vw"
          borderRadius="6px"
          paddingBottom="20px"
          bgColor={bgColor}
          minHeight="40vh"
        >
          <ModalHeader fontSize="18px" fontWeight="regular">
            {title}
          </ModalHeader>
          <ModalCloseButton
            bg="none"
            size={'sm'}
            mt={3}
            mr={3}
            cursor="pointer"
            _focus={{ outline: 'none' }}
            // onClick={onClose}
            p={'7px'}
            border={'1px solid'}
          />
          <Box width="90%" margin="0 auto" fontSize="14px">
            <Box
              bgColor="#EBF6FE"
              border=" 1px solid #319EF6"
              textAlign="center"
              color="#319EF6"
              borderRadius="6px"
              padding="25px 0"
              fontWeight="normal"
            >
              <Text
                display={pairAvailable ? undefined : 'none'}
                fontSize="16px"
              >
                You will receive
              </Text>
              <Heading as="h2" margin="6px 0" color={heavyTextColor2}>
                {pairAvailable
                  ? parseFloat(amount).toFixed(6)
                  : `${from}/${to}`}
              </Heading>
              <Text
                display={pairAvailable ? undefined : 'none'}
                fontSize="16px"
              >
                {from} / {to} Liquidity Token
              </Text>
            </Box>
            <Box my="5">
              <Flex justifyContent="space-between" pb="3">
                <Text color={lightTextColor}>Rates</Text>
                <Text color={heavyTextColor}>
                  1 {to} ={' '}
                  {pairAvailable
                    ? parseFloat(fromPrice).toFixed(6)
                    : priceBperA}{' '}
                  {from}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text></Text>
                <Text color={heavyTextColor}>
                  1 {from} ={' '}
                  {pairAvailable ? parseFloat(toPrice).toFixed(6) : priceAperB}{' '}
                  {to}
                </Text>
              </Flex>
            </Box>
            <Divider bgColor="#DEE6ED" />
            <Box my="5">
              <Flex justifyContent="space-between" pb="3">
                <Text color={lightTextColor}>{from} Deposited</Text>
                <Text color={heavyTextColor}>
                  {parseFloat(fromDeposited).toFixed(6)} {from}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" pb="3">
                <Text color={lightTextColor}>{to} Deposited</Text>
                <Text color={heavyTextColor}>
                  {parseFloat(toDeposited).toFixed(6)} {to}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text color={lightTextColor}>share of Pool</Text>
                <Text color={heavyTextColor}>
                  {pairAvailable ? parseFloat(poolShare).toFixed(6) : '100'}%
                </Text>
              </Flex>
            </Box>
            <Button
              variant="brand"
              isFullWidth
              padding="24px 0"
              boxShadow="none"
              onClick={() => {
                setShowModal(false);
                handleAddLiquidity();
              }}
            >
              {' '}
              {pairAvailable ? 'Confirm Supply' : 'Create Pool & Supply'}{' '}
            </Button>
            <Text mt="2" color={lightTextColor}>
              Output is estimated. If the price changes by more than{' '}
              {userSlippageTolerance / 100}%, your transaction will revert.
            </Text>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;

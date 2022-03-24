import React from 'react';
import {
  Box,
  Text,
  Flex,
  useColorModeValue
}
  from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import TransactionSettings from '../../../../components/TransactionSettings';

const SwapSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');

  return (
    <Box w="100%">
      <Flex mt="3" alignItems="center" justifyContent="space-between">
        <Text fontWeight="400" fontSize="16px" color={textColor} className='Swap' >
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <TransactionSettings />
          <TimeIcon w="28px" color={iconColor} padding="2px" mb={3} h="28px"/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

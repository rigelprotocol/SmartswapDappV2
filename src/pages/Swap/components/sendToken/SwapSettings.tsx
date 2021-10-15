import React from 'react';
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../../../theme/components/Icons';

const SwapSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  return (
    <Box w="100%" pl={3} pr={3}>
      <Flex mt="3.5" alignItems="center" justifyContent="space-between" px={4}>
        <Text fontWeight="400" fontSize="16px" color={textColor}>
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <SettingsIcon />
          <TimeIcon w="30px" color={iconColor} padding="4px" h="30px" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

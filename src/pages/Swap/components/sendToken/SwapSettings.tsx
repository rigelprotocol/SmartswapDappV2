import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  IconButton,
 }
 from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../../../theme/components/Icons';
import { ExclamationIcon } from '../../../../theme/components/Icons';
import { useUserSlippageTolerance } from '../../../../state/user/hooks'
import TransactionSettings from '../../../../components/TransactionSettings';

const SwapSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  const bgColor = useColorModeValue('#ffffff', '#15202B');
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgColorTwo = useColorModeValue('#F2F5F8', '#324D68');
  const textColorTwo = useColorModeValue('#666666', '#DCE6EF');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const activeButtonColor = useColorModeValue("#319EF6","#4CAFFF");

  return (
    <Box w="100%">
      <Flex mt="3" alignItems="center" justifyContent="space-between">
        <Text fontWeight="400" fontSize="16px" color={textColor}>
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <TransactionSettings />
          <TimeIcon w="28px" color={iconColor} padding="2px" mb={3} h="28px" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

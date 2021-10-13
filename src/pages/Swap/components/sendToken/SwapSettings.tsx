import React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Button,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  MinusIcon,
  SettingsIcon,
  TimeIcon,
  ArrowRightIcon,
} from '@chakra-ui/icons';

const SwapSettings = () => {
  return (
    <Box w="100%" pl={3} pr={3}>
      <Flex mt="3.5" justifyContent="space-between" px={4}>
        <Text fontWeight="400" fontSize="16px" color="#333333">
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <SettingsIcon
            w={7}
            mr={2}
            color="#666666"
            padding="4px"
            borderRadius="5px"
            h={7}
          />
          <TimeIcon
            w={7}
            color="#666666"
            padding="4px"
            borderRadius="5px"
            h={7}
            fontWeight={900}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

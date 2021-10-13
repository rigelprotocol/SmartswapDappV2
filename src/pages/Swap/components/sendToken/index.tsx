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
import SwapSettings from './SwapSettings';
import From from './From';

const SendToken = () => {
  return (
    <div>
      <Box border="1px" borderColor="#DEE5ED" rounded="xl" h="412px">
        <SwapSettings />
        <From />
      </Box>
    </div>
  );
};

export default SendToken;

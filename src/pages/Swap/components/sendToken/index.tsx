import React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Button,
  Image,
  Flex,
} from '@chakra-ui/react';
import SwapSettings from './SwapSettings';
import From from './From';
import To from './To';
import lightswitch from '../../../../assets/lightswitch.png';

const SendToken = () => {
  return (
    <div>
      <Box border="1px" borderColor="#DEE5ED" borderRadius="6px" h="420px">
        <SwapSettings />
        <From />
        <Flex justifyContent="center">
          <Image w="40px" h="40px" src={lightswitch} />
        </Flex>
        <To />
        <Flex alignItems="center">
          <Button
            w="100%"
            borderRadius="6px"
            border="2px"
            borderColor="#DEE6ED"
            h="48px"
            p="5px"
            m="16px"
            mt={1}
            color="#999999"
            fontSize="18px"
            boxShadow="md"
          >
            Connect Wallet
          </Button>
        </Flex>
      </Box>
    </div>
  );
};

export default SendToken;

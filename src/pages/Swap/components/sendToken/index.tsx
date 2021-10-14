import React from 'react';
import { Box, Button, Image, Flex, useColorModeValue } from '@chakra-ui/react';
import SwapSettings from './SwapSettings';
import From from './From';
import To from './To';
import darkswitch from '../../../../assets/darkswitch.svg';
import lightswitch from '../../../../assets/lightswitch.svg';

const SendToken = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const color = useColorModeValue('#999999', '#7599BD');
  const lightmode = useColorModeValue(true, false);
  const switchBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  return (
    <div>
      <Box border="1px" borderColor={borderColor} borderRadius="6px" h="420px">
        <SwapSettings />
        <From />
        <Flex justifyContent="center">
          <Image
            h="30px"
            w="30px"
            p={1}
            borderRadius="6px"
            border="2px"
            borderColor={borderColor}
            bgColor={switchBgcolor}
            src={lightmode ? lightswitch : darkswitch}
          />
        </Flex>
        <To />
        <Flex alignItems="center">
          <Button
            w="100%"
            borderRadius="6px"
            border={lightmode ? '2px' : 'none'}
            borderColor={borderColor}
            h="48px"
            p="5px"
            m="16px"
            mt={1}
            color={color}
            bgColor={buttonBgcolor}
            fontSize="18px"
            boxShadow={lightmode ? 'base' : 'lg'}
          >
            Connect Wallet
          </Button>
        </Flex>
      </Box>
    </div>
  );
};

export default SendToken;

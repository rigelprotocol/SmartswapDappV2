import React from 'react';
import { Box, Text, Flex, useColorModeValue, Image } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import lightsettingicon from '../../../../assets/lightsettingicon.svg';
import darksettingicon from '../../../../assets/darksettingicon.svg';

const SwapSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  const lightmode = useColorModeValue(true, false);
  return (
    <Box w="100%" pl={3} pr={3}>
      <Flex mt="3.5" justifyContent="space-between" px={4}>
        <Text fontWeight="400" fontSize="16px" color={textColor}>
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <Image
            cursor="pointer"
            w={8}
            h={8}
            mr={2}
            padding="4px"
            borderRadius="5px"
            src={lightmode ? lightsettingicon : darksettingicon}
          />
          <TimeIcon
            w={7}
            color={iconColor}
            padding="4px"
            borderRadius="5px"
            h={7}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

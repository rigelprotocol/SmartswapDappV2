// import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Box, Text, Flex, useColorModeValue, Image } from '@chakra-ui/react';
import lightaddsquareicon from '../../../../assets/lightaddsquareicon.svg';
import darkaddsquareicon from '../../../../assets/darkaddsquareicon.svg';
import darkcloseicon from '../../../../assets/darkcloseicon.svg';
import lightcloseicon from '../../../../assets/lightcloseicon.svg';

const History = () => {
  const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
  const nonActiveTabColor = useColorModeValue('#CCCCCC', '#4A739B');
  const lightmode = useColorModeValue(true, false);

  return (
    <Box w="100%" pl={3} pr={3}>
      <Flex mt="3.5" justifyContent="space-between" px={4}>
        <Flex>
          <Text fontWeight="400" mr={3} fontSize="16px" color={activeTabColor}>
            Transaction History
          </Text>
          <Text fontWeight="400" fontSize="16px" color={nonActiveTabColor}>
            Market History
          </Text>
        </Flex>
        <Flex
          alignItems="center"
          fontWeight="bold"
          mt={-1}
          rounded={100}
          bg="#"
        >
          <Image
            w={8}
            padding="4px"
            h={8}
            src={lightmode ? lightaddsquareicon : darkaddsquareicon}
          />
          <Image
            w={8}
            padding="4px"
            h={8}
            src={lightmode ? lightcloseicon : darkcloseicon}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default History;

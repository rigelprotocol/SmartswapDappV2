// import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Box, Text, Image, Flex, useColorModeValue } from '@chakra-ui/react';
import lightaddsquareicon from '../../../../assets/lightaddsquareicon.svg';
import darkcloseicon from '../../../../assets/darkcloseicon.svg';
import lightcloseicon from '../../../../assets/lightcloseicon.svg';
import darkaddsquareicon from '../../../../assets/darkaddsquareicon.svg';

const ShowDetails = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const lightmode = useColorModeValue(true, false);

  return (
    <Box w="100%" pl={3} pr={3}>
      <Flex mt="3.5" justifyContent="space-between" px={4}>
        <Text fontWeight="400" fontSize="16px" color={textColor}>
          Details
        </Text>
        <Flex
          alignItems="center"
          mt={-1}
          fontWeight="bold"
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

export default ShowDetails;

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
import InputSelector from './InputSelector';

const From = () => {
  return (
    <>
      <Box
        h="102px"
        m={4}
        borderRadius="6px"
        border="1px"
        borderColor="#DEE5ED"
      >
        <InputSelector />
      </Box>
    </>
  );
};

export default From;

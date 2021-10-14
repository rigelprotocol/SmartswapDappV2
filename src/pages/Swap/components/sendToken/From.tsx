import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';

const From = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  return (
    <>
      <Box
        h="102px"
        m={4}
        borderRadius="6px"
        border="1px"
        borderColor={borderColor}
      >
        <InputSelector max />
      </Box>
    </>
  );
};

export default From;

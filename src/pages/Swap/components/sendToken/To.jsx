import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';

const To = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  return (
    <>
      <Box>
        <InputSelector max={false} />
      </Box>
    </>
  );
};

export default To;

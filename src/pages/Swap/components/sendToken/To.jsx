import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';

const To = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  return (
    <>
      <Box
        pl={3}
        pr={3}
      >
        <InputSelector max={false} />
      </Box>
    </>
  );
};

export default To;

import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';

const To = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  return (
    <>
      <Box
        h="102px"
        mb={4}
        mt={4}
        borderRadius="6px"
        border="1px"
        borderColor={borderColor}
      >
        <InputSelector max={false} />
      </Box>
    </>
  );
};

export default To;

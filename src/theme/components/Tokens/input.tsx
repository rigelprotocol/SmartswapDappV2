import React from 'react';
import {
  Flex,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

type IProps = {
  placeholder:string
}

const ModalInput = ({placeholder}: IProps) => {
  const inputColor = useColorModeValue('#CCCCCC', '#4A739B');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  return (
    <>
      <Flex alignItems="center" mt={3} justifyContent="space-between">
        <Input
          type="number"
          border={`1px solid ${borderColor}`}
          color={inputColor}
          height="48px"
          isRequired
          display="flex"
          alignItems="center"
          placeholder={placeholder}
          _placeholder={{ color: `${inputColor}`,fontSize:"16px", }}
          // value="0.00"
        />
      </Flex>
    </>
  );
};

export default ModalInput;

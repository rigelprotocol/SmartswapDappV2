import React ,{ useCallback } from 'react';
import {
  Flex,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

type IProps = {
  placeholder:string;
  searchQuery:string;
  changeInput:(event: any) => void
}

const ModalInput = ({placeholder,changeInput,searchQuery}: IProps) => {
  const inputColor = useColorModeValue('#CCCCCC', '#4A739B');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  return (
    <>
      <Flex alignItems="center" mt={3} justifyContent="space-between">
        <Input
          type="string"
          border={`1px solid ${borderColor}`}
          color={inputColor}
          onChange={(e)=>changeInput(e)}
          height="48px"
          isRequired
          display="flex"
          alignItems="center"
          placeholder={placeholder}
          _placeholder={{ color: `${inputColor}`,fontSize:"16px", }}
          value={searchQuery}
        />
      </Flex>
    </>
  );
};

export default ModalInput;

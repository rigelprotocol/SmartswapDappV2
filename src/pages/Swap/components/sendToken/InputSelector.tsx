import React, { useState } from 'react';
import {
  Flex,
  Input,
  Text,
  Menu,
  Button,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import USDTLOGO from '../../../../assets/roundedlogo.svg';
import SelectToken from '../../../../theme/components/Tokens/SelectToken';

type InputSelectorProps = {
  max: Boolean;
};

const InputSelector = ({ max }: InputSelectorProps) => {
  const inputColor = useColorModeValue('#666666', '#4A739B');
  const balanceColor = useColorModeValue('#666666', '#DCE5EF');
  const maxColor = useColorModeValue('#319ef6', '#4CAFFF');
  const maxBgColor = useColorModeValue('#EBF6FE', '#EAF6FF');
  const tokenListTriggerColor = useColorModeValue('', '#DCE5EF');
  const tokenListTrgiggerBgColor = useColorModeValue('', '#213345');
  const [tokenModal, setTokenModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const openTokenModal = () => {
    setTokenModal((state) => !state);
  };
  return (
    <>
      <Flex alignItems="center" mt={3} justifyContent="space-between">
        <Input
          fontSize="2xl"
          type="text"
          min="0"
          border="none"
          color={inputColor}
          isRequired
          placeholder="0.0"
          value={inputValue}
          onChange={(e) => {
            let input = e.target.value;
            setInputValue(
              input
                .replace(/[^\d.]/g, '')
                .replace(/(?!^)-/g, '')
                .replace(/(\..*)\.$/, '$1')
                .replace(/\.(?=.*\.)/g, '')
            );
          }}
          focusBorderColor="none"
        />
        <Flex>
          <Menu>
            <Button
              border="0px"
              h="40px"
              w="120px"
              rightIcon={<ChevronDownIcon />}
              mr={3}
              bgColor={tokenListTrgiggerBgColor}
              onClick={() => openTokenModal()}
            >
              <Image mr={3} h="24px" w="24px" src={USDTLOGO} />
              <Text color={tokenListTriggerColor}>USDT</Text>
            </Button>
          </Menu>
        </Flex>
      </Flex>
      <Flex mt={3} alignItems="center">
        <Text ml={4} color={balanceColor} fontSize="14px">
          Balance: 0.00 RGP
        </Text>
        {max ? (
          <Text
            ml={2}
            color={maxColor}
            h="22px"
            w="34px"
            pl="4px"
            pr="4px"
            borderRadius="4px"
            bgColor={maxBgColor}
            fontSize="14px"
          >
            Max
          </Text>
        ) : (
          <></>
        )}
      </Flex>
      <SelectToken tokenModal={tokenModal} setTokenModal={setTokenModal} />
    </>
  );
};

export default InputSelector;

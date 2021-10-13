import React from 'react';
import { Flex, Input, Text, Menu, Button, Image } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import RGPLOGO from '../../../../assets/roundedLogo.png';

type InputSelectorProps = {
  max: Boolean;
};

const InputSelector = ({ max }: InputSelectorProps) => {
  return (
    <>
      <Flex alignItems="center" mt={3} justifyContent="space-between">
        <Input
          fontSize="2xl"
          type="number"
          border="none"
          color="#666666"
          isRequired
          placeholder="0.00"
        />
        <Flex>
          <Menu>
            <Button
              border="0px"
              h="40px"
              w="120px"
              rightIcon={<ChevronDownIcon />}
              mr={3}
            >
              <Image mr={3} h="24px" w="24px" src={RGPLOGO} />
              <Text>RGP</Text>
            </Button>
          </Menu>
        </Flex>
      </Flex>
      <Flex mt={3} alignItems="center">
        <Text ml={4} color="#666666" fontSize="14px">
          Balance: 0.00 RGP
        </Text>
        {max ? (
          <Text
            ml={2}
            color="#319ef6"
            h="22px"
            w="34px"
            pl="4px"
            pr="4px"
            borderRadius="4px"
            bgColor="#EBF6FE"
            fontSize="14px"
          >
            Max
          </Text>
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
};

export default InputSelector;

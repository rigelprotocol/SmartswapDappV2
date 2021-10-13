import React from 'react';
import { Flex, Input, Text, Menu, Button, Image } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import RGPLOGO from '../../../../assets/roundedLogo.png';

const InputSelector = () => {
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
        <Text ml={4} fontSize="16px">
          Balance: 0.00 RGP
        </Text>
        <Text ml={2} fontSize="16px">
          Max
        </Text>
      </Flex>
    </>
  );
};

export default InputSelector;

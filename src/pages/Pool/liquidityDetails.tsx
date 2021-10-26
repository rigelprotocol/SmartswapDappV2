import React from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const LiquidityDetails = (props: LiquidityDetail) => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const addButtonBgColor = useColorModeValue('#319EF6', '#4CAFFF');
  const addButtonColor = useColorModeValue('#FFFFFF', '#F1F5F8');
  const removeButtonBorderColor = useColorModeValue('#319EF6', '#4CAFFF');
  const removeButtonBgColor = useColorModeValue('#FFFFFF', '#15202B');
  const removeButtonColor = useColorModeValue('#319EF6', '#4CAFFF');
  const bgColor = useColorModeValue('#FFFFFF', '#15202B');
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  return (
    <Flex
      w="100%"
      h="100%"
      justifyContent="center"
      flexDirection="column"
      align="center"
    >
      <Flex
        h="100%"
        p={3}
        w="100%"
        color={textColor}
        bgColor={bgColor}
        flexDirection="column"
        border="1px"
        borderRadius="6px"
        fontSize="14px"
        borderColor={borderColor}
        mb={3}
      >
        <Flex py={2} justify="space-between">
          <Text>Your total pool tokens:</Text>
          <Text>{props.pair.poolToken}</Text>
        </Flex>
        <Flex py={2} justify="space-between">
          <Text>
            Pooled{' '}
            {props.pair.path[0].token == 'WBNB'
              ? 'BNB'
              : props.pair.path[0].token == 'WETH'
              ? 'ETH'
              : props.pair.path[0].token}
            :
          </Text>
          <Text>{props.pair.pooledToken0}</Text>
        </Flex>
        <Flex py={2} justify="space-between">
          <Text>
            Pooled{' '}
            {props.pair.path[1].token == 'WBNB'
              ? 'BNB'
              : props.pair.path[1].token == 'WETH'
              ? 'ETH'
              : props.pair.path[1].token}
          </Text>
          <Text>{props.pair.pooledToken1}</Text>
        </Flex>
        <Flex py={2} justify="space-between">
          <Text>Your pool share:</Text>
          <Text>{parseFloat(props.pair.poolShare).toFixed(6)}%</Text>
        </Flex>
      </Flex>
      <Flex w="100%" justifyContent="space-between">
        <Button
          color={addButtonColor}
          h="40px"
          bgColor={addButtonBgColor}
          w="48%"
          py={3}
          mb={2}
          _hover={{ bgColor: addButtonBgColor, color: addButtonColor }}
          _active={{ bgColor: addButtonBgColor, color: addButtonColor }}
        >
          Add
        </Button>
        <Button
          border="1px"
          _hover={{ bgColor: removeButtonBgColor, color: removeButtonColor }}
          _active={{ bgColor: removeButtonBgColor, color: removeButtonColor }}
          bgColor={removeButtonBgColor}
          borderColor={removeButtonBorderColor}
          color={removeButtonColor}
          h="40px"
          w="48%"
          mb={2}
          py={3}
        >
          Remove
        </Button>
      </Flex>
    </Flex>
  );
};

interface LiquidityDetail {
  pair: {
    path: {
      token: string;
    }[];
    pairAddress: string;
    poolToken: string;
    poolShare: string;
    pooledToken0: string;
    pooledToken1: string;
  };
}
export default LiquidityDetails;

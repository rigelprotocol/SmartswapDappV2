import React from 'react';
import InputSelector from '../Swap/components/sendToken/InputSelector';
import { SettingsIcon } from '../../theme/components/Icons';
import TransactionSettings from '../../components/TransactionSettings';
import {
  Box,
  Flex,
  Spacer,
  Text,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  Divider,
  Center,
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router';

const AddLiquidity = () => {
  const infoBg = ('#EBF6FE', '#EAF6FF');
  const genBorder = useColorModeValue('#DEE6ED', '#324D68');
  const bgColor = useColorModeValue('#F2F5F8', '#213345');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const btnTextColor = useColorModeValue('#999999', '#7599BD');

  const history = useHistory();

  return (
    <Center m={8}>
      <Box
        maxW="496px"
        borderWidth="1px"
        borderRadius="md"
        borderColor={genBorder}
        overflow="hidden"
        alignItems="center"
        p={4}
      >
        <Flex>
          <ArrowBackIcon
            onClick={() => history.goBack()}
            w={6}
            h={6}
            color={topIcons}
            cursor="pointer"
          />
          <Spacer />
          <Heading as="h4" size="md">
            Add Liquidity
          </Heading>
          <Spacer />
          <TransactionSettings />
          <TimeIcon w={6} h={7} color={topIcons} />
        </Flex>
        <Box bg={infoBg} borderRadius="md" p={4} mt={4} mb={5}>
          <Text color="#319EF6" fontWeight="400" fontSize="14px">
            Tip: When you add liquidity, you will receive pool tokens
            representing your position. These tokens automatically earn fees
            proportional to your share of the pool, and can be redeemed at any
            time.
          </Text>
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          pt={2}
          pb={2}
          borderColor={genBorder}
        >
          <InputSelector max />
        </Box>
        <Flex justifyContent="center">
          <Center
            w="40px"
            h="40px"
            bg={bgColor}
            borderWidth="3px"
            borderColor={genBorder}
            color="#333333"
            borderRadius="xl"
            mt={5}
            mb={5}
          >
            <AddIcon color={textColorOne} />
          </Center>
        </Flex>
        <Box
          borderRadius="md"
          border="1px solid #DEE6ED"
          pt={2}
          pb={2}
          borderColor={genBorder}
        >
          <InputSelector max={false} />
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          borderColor={genBorder}
          mt="5"
          mb="3"
        >
          <Text p="4" fontWeight="400">
            Prices & pool share
          </Text>
          <Divider orientation="horizontal" borderColor={genBorder} />
          <Flex p="4">
            <VStack>
              <Text color={textColorOne}>11.5068</Text>
              <Text color={topIcons}>BNB per RGP</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>0.08445554</Text>
              <Text color={topIcons}>RGP per BNB</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>0%</Text>
              <Text color={topIcons}>Share of Pool</Text>
            </VStack>
          </Flex>
        </Box>
        <Button
          size="lg"
          height="48px"
          width="200px"
          border="2px"
          borderColor={genBorder}
          color={btnTextColor}
          w="100%"
        >
          Enter An Amount
        </Button>
      </Box>
    </Center>
  );
};

export default AddLiquidity;

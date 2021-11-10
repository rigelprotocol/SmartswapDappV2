import React, { useState } from 'react';
import InputSelector from '../Swap/components/sendToken/InputSelector';
import { SettingsIcon } from '../../theme/components/Icons';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  Heading,
  useColorModeValue,
  Image,
  Center,
  useMediaQuery
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router';
import SelectToken from '../../components/Tokens/SelectToken';
import USDTLOGO from '../../assets/roundedlogo.svg';


const FindPool = () => {

  const mode = useColorModeValue('light', 'dark');
  const infoBg = ('#EBF6FE', '#EAF6FF');
  const genBorder = useColorModeValue('#DEE6ED', '#324D68');
  const bgColor = useColorModeValue('#F2F5F8', '#213345');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const [tokenModal, setTokenModal] = useState(false);
  const tokenListTriggerColor = useColorModeValue('#333333', '#F1F5F8');
  const activeButtonColor = useColorModeValue("#319EF6", "#4CAFFF");

  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');


  const history = useHistory();

  const openTokenModal = () => {
    setTokenModal((state) => !state);
  };

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
            Import Pool
          </Heading>
          <Spacer />
          <SettingsIcon color={topIcons} />
          <TimeIcon w={6} h={7} pt={1} color={topIcons} />
        </Flex>
        <Box bg={mode === 'dark' ? '#213345' : '#F2F5F8'} borderRadius="md" p={4} mt={4} mb={5}>
          <Text color="#319EF6" fontWeight="400" fontSize="14px">
            Tip: Use this tool to find pairs that don’t automatically appear on the platform.   </Text>
        </Box>

        <Box
          borderRadius="md"
          border="1px solid #DEE6ED"
          pt={2}
          pb={2}
          borderColor={genBorder}

          onClick={() => openTokenModal()}
          _hover={{ border: `1px solid ${activeButtonColor}`, color: `${activeButtonColor}`, background: `$buttonBgColorTwo` }}
        >
          <Flex my={2}>
            <Image ml={3} h="25px" w="25px" src={USDTLOGO} />
            <Heading ml={3} as="h4" size="md" color={tokenListTriggerColor} >Select a token</Heading>

            <Spacer />
            <ChevronDownIcon w={8} h={8} mr={3} />
          </Flex>
        </Box>
        <SelectToken tokenModal={tokenModal} setTokenModal={setTokenModal} />

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

          onClick={() => openTokenModal()}
          _hover={{ border: `1px solid ${activeButtonColor}`, color: `${activeButtonColor}`, background: `$buttonBgColorTwo` }}
        >
          <Flex my={2}>
            <Image ml={3} h="25px" w="25px" src={USDTLOGO} />
            <Heading ml={3} as="h4" size="md" color={tokenListTriggerColor}>Select a token</Heading>
            <Spacer />
            <ChevronDownIcon w={8} h={8} mr={3} />
          </Flex>
        </Box>
        <SelectToken tokenModal={tokenModal} setTokenModal={setTokenModal} />
        <Flex

          mt={5}
          size="lg"
          height="48px"

          color="#fff"
          h="100px"
          mb="10px"
          justifyContent="center"
          alignItems="center"
          px={4}

          backgroundColor={mode === 'dark' ? '#213345' : '#F2F5F8'}
          border={
            mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
          }
          borderRadius="6px"
        >
          <Text
            fontSize="sm"
            color={mode === 'dark' ? '#DCE5EF' : '#666666'}
          >
            Select a token to find your liquidity.
          </Text>
        </Flex>


      </Box>
    </Center>
  );
};
export default FindPool

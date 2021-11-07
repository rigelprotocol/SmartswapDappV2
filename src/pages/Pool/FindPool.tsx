import React from 'react'
import InputSelector from '../Swap/components/sendToken/InputSelector';
import { SettingsIcon } from '../../theme/components/Icons';
import {
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  Heading,
  useColorModeValue,
 
  Center,
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router';

const FindPool = () => {
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
              Import Pool
            </Heading>
            <Spacer />
            <SettingsIcon color={topIcons} />
            <TimeIcon w={6} h={7} pt={1} color={topIcons} />
          </Flex>
          <Box bg={infoBg} borderRadius="md" p={4} mt={4} mb={5}>
            <Text color="#319EF6" fontWeight="400" fontSize="14px">
            Tip: Use this tool to find pairs that don’t automatically appear on the platform.
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
         
          <Button
          mt={5}
            size="lg"
            height="48px"
            width="200px"
            border="2px"
            borderColor={genBorder}
            color={btnTextColor}
            w="100%"
          >
            Select a token
          </Button>
        </Box>
      </Center>
    );
  };
export default FindPool

import React from 'react';
import ShowDetails from './components/details/ShowDetails';
import History from './components/history/History';
import { VectorIcon, ExclamationIcon } from '../../theme/components/Icons';
import To from './components/sendToken/To';
import From from './components/sendToken/From';
import SwapSettings from './components/sendToken/SwapSettings';
import {
  Box,
  Flex,
  Input,
  Text,
  Center,
  Spacer,
  Button,
  useColorModeValue,
  useMediaQuery
} from '@chakra-ui/react';

const SetPrice = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const setColor = useColorModeValue('#666666', '#DCE5EF');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68')
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const lightmode = useColorModeValue(true, false);
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const color = useColorModeValue('#999999', '#7599BD');

  return (
    <Box fontSize="xl">
      <Flex
        minH="100vh"
        zIndex={1}
        mt={6}
        justifyContent="center"
        flexWrap="wrap"
      >
        {isMobileDevice ? (
          <>
            <Box mx={4} mt={8} w={['100%', '100%', '45%', '29.5%']} mb={4}>

            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        ) : (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
            </Box>

            <Box
              mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}
              borderColor={borderColor} borderWidth="1px" borderRadius="6px" pl={3} pr={3}
              h="500px"
              >
              <SwapSettings/>
              <From/>
              <Box borderRadius="6px" border="1px" borderColor={borderColor} mb={4} mt={4} h="102px">
                <To/>
              </Box>

              <Flex>
                <Text fontSize="14px" color={setColor} mr={2}>
                  Set Price
                </Text>
                <ExclamationIcon/>
              </Flex>

              <Input placeholder="0.00" size="lg" borderRadius={4} borderColor={borderColor}/>

              <Flex  mt={5}>
                <Center borderColor={setColor} borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
                  <VectorIcon/>
                </Center>
                <Spacer/>
                <Text fontSize="14px" mr={2} color={textColorOne}>
                  1 RGP = 1.34566 USDT
                </Text>
                <ExclamationIcon/>
              </Flex>

              <Box mt={5}>
                <Button
                  w="100%"
                  borderRadius="6px"
                  border={lightmode ? '2px' : 'none'}
                  borderColor={borderColor}
                  h="48px"
                  p="5px"
                  color={color}
                  bgColor={buttonBgcolor}
                  fontSize="18px"
                  boxShadow={lightmode ? 'base' : 'lg'}
                  _hover={{ bgColor: buttonBgcolor }}
                >
                  Enter Percentage
                </Button>
              </Box>

            </Box>

            <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>

            <Box>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  )
}

export default SetPrice

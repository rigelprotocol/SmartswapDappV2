import * as React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Button,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './../../components/ColorModeSwitcher';
import ShowDetails from './components/ShowDetails';
import SendToken from './components/sendToken/index';
import History from './components/History';

const App = () => {
  return (
    <Box fontSize="xl">
      <Flex minH="100vh" zIndex={1} mt={6} flexWrap="wrap">
        <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <Box
            bg="#ffffff"
            h="56px"
            border="1px"
            borderColor="#DEE5ED"
            borderRadius="6px"
          >
            <ShowDetails />
          </Box>
        </Box>

        <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <SendToken />
        </Box>

        <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <Box
            bg="#ffffff"
            h="56px"
            border="1px"
            borderColor="#DEE5ED"
            borderRadius="6px"
          >
            <History />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default App;

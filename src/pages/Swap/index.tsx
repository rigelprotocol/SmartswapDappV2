import * as React from 'react';
import { Box, Flex, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import ShowDetails from './components/details/ShowDetails';
import SendToken from './components/sendToken/index';
import History from './components/history/History';

const App = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
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
              <SendToken />
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <Box
                h="56px"
                border="1px"
                borderColor={borderColor}
                borderRadius="6px"
              >
                <ShowDetails />
              </Box>
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <Box
                h="56px"
                border="1px"
                borderColor={borderColor}
                borderRadius="6px"
              >
                <History />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <Box
                h="56px"
                border="1px"
                borderColor={borderColor}
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
                h="56px"
                border="1px"
                borderColor={borderColor}
                borderRadius="6px"
              >
                <History />
              </Box>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default App;

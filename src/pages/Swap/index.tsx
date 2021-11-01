import * as React from 'react';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import ShowDetails from './components/details/ShowDetails';
import SendToken from './components/sendToken/index';
import History from './components/history/History';
import SwapSetting from './modals/swapSetting';


const Swap = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');

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
              <ShowDetails />
              <SwapSetting />
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        ) : (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
              <SwapSetting />
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <SendToken />
            </Box>

            <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Swap;

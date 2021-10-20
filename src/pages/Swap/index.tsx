import * as React from 'react';
import { Box, Flex, useMediaQuery, Button } from '@chakra-ui/react';
import ShowDetails from './components/details/ShowDetails';
import SendToken from './components/sendToken/index';
import History from './components/history/History';
import WalletModal from '../../components/Navbar/modals/walletModal';
import {useDispatch} from "react-redux";
import {addToast} from '../../components/Toast/toastSlice';


const Swap = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const dispatch = useDispatch();
  const add = () => {
      dispatch(addToast({message: 'Swap 4.32221 RGP for 2.3455 USDT', URL: 'google.com'}));
  };
  return (
    <Box fontSize="xl">
      <WalletModal />
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
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        ) : (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
              <Button variant={'brand'} mt={4} onClick={add}>Add Toast</Button>
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

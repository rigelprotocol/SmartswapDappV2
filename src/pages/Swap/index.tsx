import React, { useState, useEffect } from 'react';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import ShowDetails from './components/details/ShowDetails';
import SendToken from './components/sendToken/index';
import History from './components/history/History';
import BridgeCard from './components/bridgeCard';
import WelcomeModal from '../../components/Onboarding/WelcomeModal';

const Swap = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const [welcomeModal, setWelcomeModal] = useState(false);

  useEffect(() => {
    const visits = window.localStorage.getItem('noFirstVisit');
    if (!visits) {
      setWelcomeModal(true);
      // window.localStorage.setItem('noFirstVisit', '1');
    }
  }, []);



  return (
    <>
      <WelcomeModal openModal={welcomeModal} closeModal={() => setWelcomeModal((state) => !state)} />
      <Box fontSize="xl">
        <Flex
          minH="100vh"
          zIndex={1}
          mt={6}
          justifyContent="center"
          flexWrap="wrap"
        >
          {isMobileDevice ? (
            <Box mb="110px">
              <Box mx={4} mt={8} w={['100%', '100%', '45%', '29.5%']} mb={4}>
                <SendToken />
                <BridgeCard />
              </Box>

              <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}  >
                <ShowDetails />
              </Box>

              <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
                <History />
              </Box>
            </Box>
          ) : (
            <>
              <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
                <ShowDetails />
              </Box>

              <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
                <SendToken />
                <BridgeCard />
              </Box>

              <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
                <History />
              </Box>
            </>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default Swap;

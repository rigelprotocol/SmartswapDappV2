import React, { useState, useEffect } from "react";
import { Box, Flex, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import ShowDetails from "../components/details/ShowDetails";
import SendToken from "../components/sendToken/index";
import History from "../components/history/History";
import BridgeCard from "../components/bridgeCard";
import WelcomeModal from "../../../components/Onboarding/WelcomeModal";
import Joyride from "react-joyride";
import { tourSteps } from "../../../components/Onboarding/SwapSteps";
import useGenerateRouterProtocolLink from "../../../utils/hooks/useGenerateRouterProtocolLink";


const ROuterBridge = () => {
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [run, setRun] = useState(false);
  const bgColor = useColorModeValue("#319EF6", "#4CAFFF");

  // useUpdateBalance("");

  useEffect(() => {
    const visits = window.localStorage.getItem("fiirstSwapVisit");
    if (!visits) {
      setWelcomeModal(true);
      window.localStorage.setItem("fiirstSwapVisit", "1");
    }
  }, []);

  function strartWelcomeRide() {
    setRun(true);
  }
  
const [routerProtocolLink] = useGenerateRouterProtocolLink()
  return (
    <>
      
      <Box fontSize='xl' minH='100vh' zIndex={1}>
        {/* <Flex
          minH='100vh'
          zIndex={1}
          mt="40px"
          // justifyContent='center'
          flexWrap='wrap'
          background="red"
        > */}
          {isMobileDevice ? (
            <Box mb='110px'>
              <Box  mt={8} w="96%" mx="auto" mb={4}>
              {routerProtocolLink && <iframe id="widget__iframe" height="610px" width="100%" 
  src={routerProtocolLink}
  style={{border: "none", borderRadius: "11px", boxShadow: "3px 3px 10px 4px rgba(0, 0, 0, 0.05)"}}>
  </iframe>}
              </Box>

              {/* <Box mx={3} w={["95%", "95%", "45%", "29.5%"]} mb={4}>
                <ShowDetails />
              </Box>

              <Box mx={3} w={["95%", "95%", "45%", "29.5%"]} mb={4}>
                <History />
              </Box> */}
            </Box>
          ) : (
            <>
              {/* <Box mx={4} w={["100%", "100%", "45%", "29.5%"]} mb={4}>
                <ShowDetails />
              </Box> */}

              <Box mx={4} w="80%" mb={4}>
              {routerProtocolLink && <iframe id="widget__iframe" height="610px" width="100%" 
  src={routerProtocolLink}
  style={{border: "none", borderRadius: "11px", boxShadow: "3px 3px 10px 4px rgba(0, 0, 0, 0.05)"}}>
  </iframe>}
              </Box>

              {/* <Box mx={5} w={["100%", "100%", "45%", "29.5%"]} mb={4}>
                <History />
              </Box> */}
            </>
          )}
        {/* </Flex> */}
      </Box>
    </>
  );
};

export default ROuterBridge;

/** @format */

import { Box, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Liquidities from "./liquidities";
import { RefreshIcon, LightRefreshIcon } from "./Icons";
import { useColorModeValue } from "@chakra-ui/react";
import { useGetUserLiquidities } from "../../utils/hooks/usePools";
import { Link } from "react-router-dom";
import TransactionSettings from "../../components/TransactionSettings";
import Joyride from "react-joyride";
import { tourSteps } from "../../components/Onboarding/LiquiditySteps";
import WelcomeModal from "../../components/Onboarding/WelcomeModal";
import { useUpdateUserGasPreference } from "../../state/gas/hooks";
import { clearSearchResult } from "../../state/farming/action";
import { useDispatch } from "react-redux";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { GClickedAddLiquidity, GClickedAddNewLiquidity } from "../../components/G-analytics/gLiquidity";

const Index = () => {
  const mode = useColorModeValue("light", "dark");
  const { chainId } = useActiveWeb3React();
  const factory = useGetUserLiquidities();
  const [liquidities, setLiquidities] = useState<any[] | undefined>([]);
  const [liquidityLength, setLiquidityLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false); //false
  const [run, setRun] = useState(false);
  const bgColor = useColorModeValue("#319EF6", "#4CAFFF");
  const dispatch = useDispatch();
  useUpdateUserGasPreference();

  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
  }, [chainId]);

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const details = await factory;
      if (details && !cancel) {
        try {
          setLiquidities(details.liquidities);
          setLiquidityLength(details.liquidityLength);
          setLoading(details.Loading);
        } catch (err) {
          console.log(err);
        }
      }
    };
    load();
    return () => {
      cancel = true;
    };
  }, [factory]);
  useEffect(() => {
    const visits = window.localStorage.getItem("firstLiquidtyVisit");
    if (!visits) {
      setWelcomeModal(true);
      window.localStorage.setItem("firstLiquidtyVisit", "1");
    }
  }, []);

  function startWelcomeRide() {
    setRun(true);
  }

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        styles={{
          options: {
            arrowColor: bgColor,
            backgroundColor: bgColor,
            textColor: "#FFFFFF",
            primaryColor: bgColor,
          },
        }}
      />
      <WelcomeModal
        startToure={startWelcomeRide}
        openModal={welcomeModal}
        closeModal={() => {
      window.localStorage.setItem("firstLiquidtyVisit", "2");
          setWelcomeModal((state) => !state)
        }}
        textHeader={"Welcome to RigelProtocol SmartSwap"}
        welcomeText='With liquidity, you have the option of earning more by depositing tokens to join liquidity pools and receive LP tokens.'
      />
      <Flex
        mx={5}
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        minHeight='70vh'
        rounded='lg'
        mb={["110px", "110px", "4"]}
      >
        <Box
          minHeight='100%'
          w={["100%", "100%", "29.5%", "29.5%"]}
          rounded='lg'
        >
          <Box
            mt={5}
            p={5}
            backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
            border={mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"}
            borderRadius='6px'
          >
            <Flex justifyContent='left' mb={4} flexDirection='column'>
              <Flex justifyContent='space-between'>
                <Text
                  fontSize='16px'
                  color={mode === "dark" ? "#F1F5F8" : "rgba(51, 51, 51, 1)"}
                  className='Liquidity'
                >
                  Liquidity
                </Text>
                <Flex>
                  <TransactionSettings />
                  <Box>
                    {mode === "dark" ? <LightRefreshIcon /> : <RefreshIcon />}
                  </Box>
                </Flex>
              </Flex>

              <Text
                fontSize='14px'
                color={mode === "dark" ? "#DCE5EF" : "#666666"}
                mt={2}
                cursor='pointer'
              >
                Join liquidity pools to receive LP tokens
              </Text>
            </Flex>

            <Flex
              justifyContent='space-between'
              flexDirection={["column", "column", "column", "column"]}
            >
              <Link to='/add'>
                <Button
                  d='block'
                  w={["100%", "100%", "100%", "100%"]}
                  marginTop={["20px", "0px", "20px", "0px"]}
                  className='AddLiquidity'
                  h='50px'
                  my={4}
                  border='none'
                  fontSize='lg'
                  cursor='pointer'
                  boxShadow='0px 1px 7px rgba(41, 45, 50, 0.08)'
                  lineHeight='24px'
                  color='#FFFFFF'
                  bg='#319EF6'
                  borderRadius='6px'
                  _hover={{ outline: "none", background: "#319EF6" }}
                  _active={{ outline: "none", background: "#319EF6" }}
                  onClick={()=>GClickedAddLiquidity()}
                >
                  Add Liquidity
                </Button>
              </Link>
              <Link to='/add'>
                <Button
                  d='block'
                  w={["100%", "100%", "100%", "100%"]}
                  marginTop={["20px", "0px", "20px", "0px"]}
                  _hover={{ bgColor: "transparent" }}
                  _active={{ bgColor: "transparent" }}
                  h='50px'
                  my={4}
                  color='#319EF6'
                  fontSize='lg'
                  cursor='pointer'
                  lineHeight='24px'
                  borderRadius='6px'
                  bg='transparent'
                  border=' 2px solid #319EF6'
                  className='CreatePair'
                  onClick={() => GClickedAddNewLiquidity()}
                >
                  Create a pair
                </Button>
              </Link>
            </Flex>

            <Flex justifyContent='center' mx={5} my={4} className='importPools'>
              <Text
                fontSize='sm'
                color={mode === "dark" ? "#DCE5EF" : "#666666"}
              >
                Dont see a pool you joined?
              </Text>
              <Text fontSize='sm' color='blue.300' ml={3} cursor='pointer'>
                <Link to='/find'> Import it </Link>
              </Text>
            </Flex>
          </Box>
          <Box
            backgroundColor={mode === "dark" ? "#15202B" : "#FFFFFF"}
            border={mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"}
            borderRadius='6px'
            my={4}
            w='100%'
            className='LiquidityPosition'
          >
            <Flex
              mx={5}
              justifyContent='space-between'
              alignItems='center'
              rounded='lg'
              my={4}
            >
              <Text
                color={mode === "dark" ? "#F1F5F8" : "#000000"}
                fontSize='md'
              >
                My Liquidity Positions
              </Text>
            </Flex>
            {loading ? (
              <Flex
                color='#fff'
                h='100px'
                mb='10px'
                justifyContent='center'
                alignItems='center'
                px={4}
                mx={5}
                backgroundColor={mode === "dark" ? "#213345" : "#F2F5F8"}
                border={
                  mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
                }
                borderRadius='6px'
              >
                <Text
                  fontSize='sm'
                  color={mode === "dark" ? "#DCE5EF" : "#666666"}
                >
                  Loading...
                </Text>
              </Flex>
            ) : liquidityLength === 0 ? (
              <Flex
                color='#fff'
                h='100px'
                mb='10px'
                justifyContent='center'
                alignItems='center'
                px={3}
                mx={5}
                backgroundColor={mode === "dark" ? "#213345" : "#F2F5F8"}
                border={
                  mode === "dark" ? "1px solid #324D68" : "1px solid #DEE6ED"
                }
                borderRadius='6px'
              >
                <Text
                  fontSize='sm'
                  color={mode === "dark" ? "#DCE5EF" : "#666666"}
                >
                  No Liquidity Found.
                </Text>
              </Flex>
            ) : (
              <Flex mb={5} justify='center'>
                <Box w='100%'>
                  {liquidities?.map((liquid, index) => (
                    <Liquidities key={`${index}key`} pair={liquid} />
                  ))}
                </Box>
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Index;

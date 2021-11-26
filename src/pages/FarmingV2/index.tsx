import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Alert, AlertDescription, CloseButton, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";
import YieldFarm from "./YieldFarm";
import { contents } from "./mock";
import { AlertSvg } from "./Icon";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useRouteMatch } from "react-router-dom";
import { ethers } from 'ethers';
import Web3 from 'web3';
import configureStore from '../../configureStore';

const { store } = configureStore()

export const LIQUIDITY = "liquidity";
export const STAKING = "staking";
export const V1 = "v1";
export const V2 = "v2";
export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";
export const LIQUIDITY_INDEX = 0;
export const STAKING_INDEX = 1;

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>();
  const contextNetwork = useWeb3React<Web3Provider>("NETWORK");
  return context.active ? context : contextNetwork;
}

export function Index() {
  const { wallet } = store.getState().wallet
  const history = useHistory();
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  const [selected, setSelected] = useState(LIQUIDITY);
  const [isActive, setIsActive] = useState(V2);
  const [showAlert, setShowAlert] = useState(true);
  let match = useRouteMatch("/farming-V2/staking-RGP");

  useEffect(
    () => {
      if (match) setSelected(STAKING);
    },
    [match]
  );

  const changeVersion = (version: string) => {
    history.push(version);
  };

  const handleSelect = (value: string) => {
    if (value === LIQUIDITY) {
      setSelected(LIQUIDITY);
      changeVersion("/farming-v2");
    } else if (value === STAKING) {
      setSelected(STAKING);
      changeVersion("/farming-v2/staking-RGP");
    }
  };

  const handleActive = (value: string) => {
    if (value === V1) {
      setIsActive(V1);
      changeVersion("/farming");
    } else if (value === V2) {
      setIsActive(V2);
      changeVersion("/farming-v2");
    }
  };

  const handleAlert = () => {
    setShowAlert(false);
  };

  const { chainId, library } = useActiveWeb3React();

  return (
    <Box>
      {(chainId && library) || !showAlert ? null : (
        <Box mx={[5, 10, 15, 20]} my={4}>
          <Alert color="#FFFFFF" background={mode === DARK_THEME ? "#319EF6" : "#319EF6"} borderRadius="8px">
            <AlertSvg />
            <AlertDescription
              fontFamily="Inter"
              fontSize={{ base: "16px", md: "18px", lg: "20px" }}
              fontWeight="500"
              lineHeight="24px"
              letterSpacing="0em"
              textAlign="left"
              padding="10px"
            >
              This is the V2 Farm. You should migrate your stakings from V1 Farm.
            </AlertDescription>

            <CloseButton
              position="absolute"
              margin="2px"
              height="14px"
              width="14px"
              background="#319EF6"
              color="#fff"
              right="20px"
              textAign="center"
              onClick={handleAlert}
            />
          </Alert>
        </Box>
      )}

      <Flex justifyContent="flex-end">
        <Tabs
          variant="soft-rounded"
          mx={[5, 10, 15, 20]}
          position={{ base: "relative", md: "absolute" }}
          borderRadius="6px"
          border={
            mode === LIGHT_THEME && isActive === V1
              ? "2px solid #DEE5ED !important"
              : mode === DARK_THEME && isActive === V1
              ? "2px solid  #213345 !important"
              : mode === DARK_THEME && isActive === V2
              ? "2px solid  #213345 !important"
              : mode === LIGHT_THEME && isActive === V2
              ? "2px solid #DEE5ED !important"
              : "2px solid #DEE5ED !important"
          }
          p={1}
          mt={3}
        >
          <TabList>
            <Tab
              padding="8px 34px"
              marginTop="3px"
              background={
                mode === LIGHT_THEME && isActive === V1
                  ? "#FFFFFF !important"
                  : mode === DARK_THEME && isActive === V1
                  ? "#15202B !important"
                  : mode === DARK_THEME && isActive === V2
                  ? "#15202B !important"
                  : mode === LIGHT_THEME && isActive === V2
                  ? "#FFFFFF !important"
                  : "#F2F5F8 !important"
              }
              color={
                mode === LIGHT_THEME && isActive === V1
                  ? "#999999 !important"
                  : mode === DARK_THEME && isActive === V1
                  ? "#7599BD !important"
                  : mode === DARK_THEME && isActive === V2
                  ? "#7599BD !important"
                  : mode === LIGHT_THEME && isActive === V2
                  ? "#999999 !important"
                  : "#333333"
              }
              border="none"
              borderRadius="6px"
              value={V1}
              onClick={() => handleActive(V1)}
            >
              V1
            </Tab>
            <Tab
              padding="8px 34px"
              marginTop="3px"
              background={
                mode === LIGHT_THEME && isActive === V2
                  ? "#F2F5F8 !important"
                  : mode === DARK_THEME && isActive === V2
                  ? "#4A739B !important"
                  : mode === DARK_THEME && isActive === V1
                  ? "#4A739B !important"
                  : mode === LIGHT_THEME && isActive === V1
                  ? "#FFFFFF !important"
                  : "#F2F5F8 !important"
              }
              color={
                mode === LIGHT_THEME && isActive === V2
                  ? "#333333 !important"
                  : mode === DARK_THEME && isActive === V2
                  ? "#F1F5F8 !important"
                  : mode === DARK_THEME && isActive === V1
                  ? "#F1F5F8 !important"
                  : mode === LIGHT_THEME && isActive === V2
                  ? "#333333 !important"
                  : "#333333"
              }
              borderRadius="6px"
              border="none"
              value={V2}
              onClick={() => handleActive(V2)}
            >
              V2
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
      <Tabs
        defaultIndex={match ? STAKING_INDEX : LIQUIDITY_INDEX}
        // isManual
        variant="enclosed"
        mx={[5, 10, 15, 20]}
        my={4}
      >
        <TabList>
          <Tab
            border="1px solid #DEE5ED !important"
            borderRadius="6px 0px 0px 0px"
            background={
              mode === LIGHT_THEME && selected === STAKING
                ? "#FFFFFF !important"
                : mode === DARK_THEME && selected === LIQUIDITY
                ? "#213345 !important"
                : mode === DARK_THEME && selected === STAKING
                ? "#15202B !important"
                : mode === LIGHT_THEME && selected === LIQUIDITY
                ? "#DEE5ED !important"
                : "#DEE5ED !important"
            }
            px={5}
            py={4}
            minWidth={{ base: "none", md: "200px", lg: "200px" }}
            value={LIQUIDITY}
            onClick={() => handleSelect(LIQUIDITY)}
            // onClick={handleSelect}
            borderColor={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? "#F2F5F8 !important"
                : mode === DARK_THEME && selected === LIQUIDITY
                ? "#324D68 !important"
                : mode === DARK_THEME && selected === STAKING
                ? "#324D68 !important"
                : mode === LIGHT_THEME && selected === STAKING
                ? "#F2F5F8 !important"
                : "#F2F5F8 !important"
            }
          >
            <Text
              color={
                mode === LIGHT_THEME && selected === LIQUIDITY
                  ? "#333333"
                  : mode === DARK_THEME && selected === LIQUIDITY
                  ? "#F1F5F8"
                  : mode === DARK_THEME && selected === STAKING
                  ? "#F1F5F8"
                  : mode === LIGHT_THEME && selected === STAKING
                  ? "#333333"
                  : "#333333"
              }
            >
              Liquidity Pools
            </Text>
          </Tab>
          <Tab
            borderRadius="0px 6px 0px 0px"
            border="1px solid #DEE5ED"
            background={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? "#FFFFFF !important"
                : mode === DARK_THEME && selected === STAKING
                ? "#213345 !important"
                : mode === DARK_THEME && selected === LIQUIDITY
                ? "#15202B !important"
                : mode === LIGHT_THEME && selected === STAKING
                ? "#DEE5ED !important"
                : "#DEE5ED !important"
            }
            color={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? "#333333"
                : mode === DARK_THEME && selected === LIQUIDITY
                ? "#F1F5F8"
                : mode === DARK_THEME && selected === STAKING
                ? "#F1F5F8"
                : mode === LIGHT_THEME && selected === STAKING
                ? "#333333"
                : "#333333"
            }
            borderColor={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? "#F2F5F8 !important"
                : mode === DARK_THEME && selected === LIQUIDITY
                ? "#324D68 !important"
                : mode === DARK_THEME && selected === STAKING
                ? "#324D68 !important"
                : mode === LIGHT_THEME && selected === STAKING
                ? "#F2F5F8 !important"
                : "#F2F5F8 !important"
            }
            px={5}
            py={4}
            minWidth={{ base: "none", md: "200px", lg: "200px" }}
            onClick={() => handleSelect(STAKING)}
          >
            <Text>Staking</Text>
          </Tab>
        </TabList>
        <TabPanels padding="0px">
          <TabPanel padding="0px">
            <Flex justifyContent="center" alignItems="center" rounded="lg" mb={4}>
              <Box
                bg="#120136"
                minHeight="89vh"
                w={["100%", "100%", "100%"]}
                background={
                  mode === LIGHT_THEME && selected === STAKING
                    ? "#FFFFFF !important"
                    : mode === DARK_THEME && selected === LIQUIDITY
                    ? "#15202B !important"
                    : mode === DARK_THEME && selected === STAKING
                    ? "#15202B !important"
                    : mode === LIGHT_THEME && selected === LIQUIDITY
                    ? "#FFFFFF !important"
                    : "#FFFFFF !important"
                }
                rounded="lg"
              >
                <Box mx="auto" w={["100%", "100%", "100%"]} pb="70px">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={4}
                    background={
                      mode === LIGHT_THEME && selected === LIQUIDITY
                        ? "#F2F5F8  !important"
                        : mode === DARK_THEME && selected === LIQUIDITY
                        ? "#213345"
                        : mode === DARK_THEME && selected === STAKING
                        ? "#213345"
                        : mode === LIGHT_THEME && selected === STAKING
                        ? "#F2F5F8"
                        : "#F2F5F8 !important"
                    }
                    color={
                      mode === LIGHT_THEME && selected === LIQUIDITY
                        ? "#333333"
                        : mode === DARK_THEME && selected === STAKING
                        ? "#F1F5F8"
                        : mode === DARK_THEME && selected === LIQUIDITY
                        ? "#F1F5F8"
                        : mode === LIGHT_THEME && selected === STAKING
                        ? "#333333"
                        : "#333333"
                    }
                    w={["100%", "100%", "100%"]}
                    align="left"
                    border={
                      mode === LIGHT_THEME
                        ? "1px solid #DEE5ED !important"
                        : mode === DARK_THEME
                        ? "1px solid #324D68 !important"
                        : "1px solid #324D68"
                    }
                    display={{ base: "none", md: "flex", lg: "flex" }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>
                  {contents.map((content: any) => (
                    <YieldFarm content={content} key={content.id} wallet={wallet}/>
                  ))}
                </Box>
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel padding="0px">
            <Flex justifyContent="center" alignItems="center" rounded="lg" mb={4}>
              <Box
                bg="#120136"
                minHeight="89vh"
                w={["100%", "100%", "100%"]}
                background={
                  mode === LIGHT_THEME
                    ? "#FFFFFF !important"
                    : mode === DARK_THEME
                    ? "#15202B !important"
                    : "#FFFFFF !important"
                }
                rounded="lg"
              >
                <Box mx="auto" w={["100%", "100%", "100%"]} pb="70px">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={4}
                    background={mode === DARK_THEME ? "#213345" : mode === LIGHT_THEME ? "#F2F5F8" : "#F2F5F8 !important"}
                    color={mode === LIGHT_THEME ? "#333333" : mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                    w={["100%", "100%", "100%"]}
                    align="left"
                    border={
                      mode === LIGHT_THEME
                        ? "1px solid #DEE5ED !important"
                        : mode === DARK_THEME
                        ? "1px solid #324D68 !important"
                        : "1px solid #324D68"
                    }
                    display={{ base: "none", md: "flex", lg: "flex" }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>
                  {contents.map((content: any, index: number) =>
                    index === 1 ? <YieldFarm content={content} key={content.id} wallet={wallet}/> : null
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Index;

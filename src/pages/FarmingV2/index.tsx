/** @format */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  Button,
  CloseButton,
  Grid,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useClipboard,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { CopyIcon } from "../../theme/components/Icons";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import YieldFarm from "./YieldFarm";
import { AlertSvg } from "./Icon";
import { ChevronDownIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";

import { useDispatch, useSelector } from "react-redux";
import bigNumber from "bignumber.js";
import { useFarms } from "../../state/farm/hooks";
import { shortenCode } from "../../utils";
import { RootState } from "../../state";
import { SupportedChainId } from "../../constants/chains";
import ProductFarm from "./ProductFarm";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import Joyride from "react-joyride";
import { steps } from "../../components/Onboarding/FarmingSteps";
import WelcomeModal from "../../components/Onboarding/WelcomeModal";
import CryptoJS from "crypto-js";
import { useUpdateUserGasPreference } from "../../state/gas/hooks";
import Filter from "../../components/Farming/Modals/Filter";
import { filterFarms } from "../../utils/utilsFunctions";
import { farmStateInterface } from "../../state/farm/reducer";
import {
  useClearFarm,
  useFarmSearch,
  useFilterFarms,
  usePrevious,
  useSearch,
  useSearchResults,
} from "../../state/farming/hooks";
import FarmTab from "./FarmTab";
import FarmHeader from "./FarmHeader";
import {
  clearSearchResult,
  updateSearchResult,
  updateSelectedField,
} from "../../state/farming/action";
// import { useGetFarmData } from "../../utils/hooks/useGetFarmData";
// import { useGetNewFarms } from "../../utils/hooks/useGetNewFarms";

import {
  GFarmingClickListYourProject,
  GFarmingInputSearchFarm,
  GOpenedSpecialPool,
} from "../../components/G-analytics/gFarming";
import { ZERO_ADDRESS } from "../../constants";
import { State } from "../../state/types";
import { clearAllFarms } from "../../state/newFarming/action";
import {
  useFetchFarm,
  useFetchQuickSwap,
  useFetchStable,
  useSpecialPool,
} from "../../utils/hooks/useFarm";

export const BIG_TEN = new bigNumber(10);
export const V1 = "v1";
export const V2 = "v2";
export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";
export const LIQUIDITY_INDEX = 0;
export const STAKING_INDEX = 1;
export enum farmSection {
  LIQUIDITY,
  STAKING,
  PRODUCT_FARM,
  NEW_LP,
  SECOND_NEW_LP,
}

export const MAINNET = 56;

export function Index() {
  const history = useHistory();
  const location = useLocation().pathname;
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  const filterBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const useNotSelectedBackgroundColor = useColorModeValue("#FFFFFF", "#15202B");
  const useSelectedBackgroundColor = useColorModeValue("#DEE5ED", "#213345");
  const useNotSelectedBorderColor = useColorModeValue("#008DFF", "#324D68");
  const useSelectedBorderColor = useColorModeValue("#0760A8", "#F2F5F8");
  const useNotSelectedTextColor = useColorModeValue("#333333", "#0760A8");
  const useSelectedTextColor = useColorModeValue("#0760A8", "#008DFF");

  const borderColor = useColorModeValue("#F2F5F8", "#324D68");
  const useSelectedColor = useColorModeValue("#333333", "#213345");
  const placeholderTextColor = useColorModeValue("#333333", "#DCE5EF");
  const titleColor = useColorModeValue("#333333", "#ffffff");
  const [selected, setSelected] = useState(farmSection.LIQUIDITY);
  const [isActive, setIsActive] = useState(V2);
  const [showAlert, setShowAlert] = useState(true);
  const [farmDataLoading, setfarmDataLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [switchTab, setSwitchTab] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [liquidityIndex, setLiquidityIndex] = useState(0);
  const [productFarmIndex, setProductFarmIndex] = useState(4);
  const [stakingIndex, setStakingIndex] = useState(1);
  const [newFarmIndex, setNewFarmIndex] = useState(5);
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const [referralCode, setReferralCode] = useState("");
  const [refAddress, setRefAddress] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const hostName = window.location.href.split("?")[0];
  const { hasCopied, onCopy } = useClipboard(`${hostName}?ref=${referralCode}`);
  const [URLRefCode, setURLRefCode] = useState("");
  const [newestToOldest, setNewestToOldest] = useState(false);
  const [oldestToNewest, setOldestToNewest] = useState(true);
  const [range0, setRange0] = useState<number | string>(0);
  const [range1, setRange1] = useState<number | string>(10000);
  const [refreshSpecialPool, setRefreshSpecialPool] = useState(false);
  const [searchedFarmData, setSearchedFarmData] =
    useState<farmStateInterface>();

  const [showPopOver, setShowPopover] = useState(false);
  const [saveChanges, setSavedChanges] = useState(false);
  const [keyword, setKeyword] = useState("");

  const refreshSpecialData = () => {
    setRefreshSpecialPool(!refreshSpecialPool);
  };

  const searchSingleFarm = useCallback(
    (value: string) => {
      setKeyword(value);
    },
    [keyword]
  );

  // 👇 look here
  const selector = useSelector((state: State) => state.farming.selectedField);

  const farms = useSelector((state: any) => state.farms);

  const { loading: LpfarmLoading } = useFetchFarm();
  const { loading: quickswapLoading } = useFetchQuickSwap();
  const { loading: stableFarmLoading } = useFetchStable();
  useSpecialPool();

  useEffect(() => {
    if (location && location.includes("RGPv2")) {
      // setSelected(STAKING);
      setSelected(farmSection.STAKING);
      dispatch(updateSelectedField({ value: farmSection.STAKING }));
      setTabIndex(1);
    } else if (location && location.includes("product-farm")) {
      // setSelected(PRODUCT_FARMS);
      setSelected(farmSection.PRODUCT_FARM);
      dispatch(updateSelectedField({ value: farmSection.PRODUCT_FARM }));
      setTabIndex(2);
    } else if (location && location.includes("new-farm")) {
      setSelected(farmSection.NEW_LP);
      dispatch(updateSelectedField({ value: farmSection.NEW_LP }));
      setTabIndex(5);
    } else if (location && location.includes("stable-lp")) {
      setSelected(farmSection.SECOND_NEW_LP);
      dispatch(updateSelectedField({ value: farmSection.SECOND_NEW_LP }));
      setTabIndex(6);
    } else {
      // setSelected(LIQUIDITY)
      setSelected(farmSection.LIQUIDITY);
      dispatch(updateSelectedField({ value: farmSection.LIQUIDITY }));
      setTabIndex(0);
    }
  }, [location, selector]);

  // console.log(count);

  // useMemo(() => {
  //   if (searchedDataResult !== undefined) {
  //     setSearchedFarmData(searchedDataResult);
  //   }
  // }, [searchedDataResult]);

  useUpdateUserGasPreference();

  useFilterFarms({
    newestToOldest,
    min: range0 as number,
    max: range1 as number,
    setSavedChanges,
    saveChanges,
  });

  const handleTabsChange = (index: number) => {
    if (ChainId !== SupportedChainId.OASISMAINNET) {
      const useIndex =
        index === 0
          ? liquidityIndex
          : index === 1
          ? stakingIndex
          : liquidityIndex === 2
          ? setTabIndex(3)
          : index;
      setTabIndex(useIndex);
    }
  };

  const goToV1 = (index: number) => {
    setTabIndex(index);
  };
  const handleStakingTab = (event: { target: { value: string } }) => {
    if (parseInt(event.target.value, 10) === 1) {
      setStakingIndex(1);
      setTabIndex(1);
      history.push(`/farm/RGPv2${search}`);
    } else if (parseInt(event.target.value, 10) === 3) {
      setStakingIndex(3);
      setTabIndex(3);
      history.push(`/farm/RGPv1${search}`);
    }
  };

  const handleLiquidityTab = (event: { target: { value: string } }) => {
    if (parseInt(event.target.value, 10) === 0) {
      setLiquidityIndex(0);
      setTabIndex(0);
    } else if (parseInt(event.target.value, 10) === 2) {
      setLiquidityIndex(2);
      setTabIndex(4);
    }
  };

  const handleNewFarmTab = (event: { target: { value: string } }) => {
    if (parseInt(event.target.value, 10) === 5) {
      setNewFarmIndex(5);
      setTabIndex(5);
      history.push(`/farm/new-farm${search}`);
    } else if (parseInt(event.target.value, 10) === 6) {
      setNewFarmIndex(6);
      setTabIndex(6);
      history.push(`/farm/stable-lp${search}`);
    }
  };

  const { account, chainId, library } = useActiveWeb3React();
  const dispatch = useDispatch();
  let match = useRouteMatch("/farm/RGPv2");
  const FarmData = useFarms();
  // const { farmdata, loadingState } = useGetFarmData();
  // const { LPData, loadingLP } = useGetNewFarms(
  //   selected === farmSection.SECOND_NEW_LP ? 2 : 1
  // );

  const loadingState = false;
  const loadingLP = false;

  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);
  const { search } = useLocation();

  // const data = useFarmData();
  // const newLP = useNewLPData();
  // const farms = useSelector((state) => state.farming.content);
  // const recentFarms = useSelector((state) => state.newFarming.content);
  // const searchSection = useSelector((state) => state.farming);
  // const newSearchSection = useSelector((state) => state.newFarming);

  // const { specialPool } = useSelector((state) => state.newfarm);

  useEffect(() => {
    dispatch(clearAllFarms());
  }, [ChainId]);

  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
    setKeyword("");
  }, [ChainId]);

  // const handleUpdateSearch = useCallback((searchedDataResult) => {
  //   dispatch(
  //     updateSearchResult({
  //       farmData: searchedDataResult,
  //     })
  //   );
  // }, []);

  // useMemo(() => {
  //   handleUpdateSearch(searchedDataResult);
  // }, [searchedDataResult]);

  const [Balance, Symbol] = useNativeBalance();
  const wallet = {
    balance: Balance,
    address: account,
    provider: library,
    signer: library?.getSigner(),
    chainId: chainId,
  };

  const searchResults = useSearchResults();

  const changeVersion = (version: string, external?: boolean) => {
    if (external) {
      window.open(version);
    }
    history.push(version);
  };

  const handleSelect = (value: number) => {
    if (value === farmSection.LIQUIDITY) {
      setSwitchTab(!switchTab);
      setSelected(farmSection.LIQUIDITY);
      dispatch(updateSelectedField({ value: farmSection.LIQUIDITY }));
      changeVersion(`/farm${search}`);
    } else if (value === farmSection.PRODUCT_FARM) {
      setSelected(farmSection.PRODUCT_FARM);
      dispatch(updateSelectedField({ value: farmSection.PRODUCT_FARM }));
      setSwitchTab(!switchTab);
      changeVersion(`/farm/product-farm${search}`);
    } else if (value === farmSection.NEW_LP) {
      setSelected(farmSection.NEW_LP);
      dispatch(updateSelectedField({ value: farmSection.NEW_LP }));
      setSwitchTab(!switchTab);
      changeVersion(`/farm/new-farm${search}`);
    } else if (value === farmSection.SECOND_NEW_LP) {
      setSelected(farmSection.SECOND_NEW_LP);
      dispatch(updateSelectedField({ value: farmSection.SECOND_NEW_LP }));
      setSwitchTab(!switchTab);
      changeVersion(`/farm/stable-lp${search}`);
    } else if (value === farmSection.STAKING) {
      setSwitchTab(!switchTab);
      setSelected(farmSection.STAKING);
      dispatch(updateSelectedField({ value: farmSection.STAKING }));
      GOpenedSpecialPool(tabIndex);
      if (tabIndex === 1) {
        setStakingIndex(1);
        changeVersion(`/farm/RGPv2${search}`);
      } else {
        setStakingIndex(3);
        changeVersion(`/farm/RGPv1${search}`);
      }
    } else {
      setSwitchTab(true);
    }
  };

  const showProject = () => {
    changeVersion(
      "https://docs.google.com/forms/d/e/1FAIpQLSdJGAuABrJd6d0WSprUWB140we9hGqa-IwIbonx9ZJhxN2zsg/viewform",
      true
    );
  };

  const handleAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const handleReferralCode = () => {
      const encryptedReferralCode = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(account)
      ).toString();
      setReferralCode(encryptedReferralCode);
      const refLink = `${hostName}?ref=${referralCode}`;
      setReferralLink(refLink);
    };
    handleReferralCode();
  }, [account]);

  function useURLQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useURLQuery();

  useEffect(() => {
    const handleURLRefCode = () => {
      try {
        const queryRef = query.get("ref");
        const decryptedReferralCode = CryptoJS.enc.Base64.parse(
          queryRef
        ).toString(CryptoJS.enc.Utf8);
        decryptedReferralCode === account
          ? setRefAddress(ZERO_ADDRESS)
          : setRefAddress(decryptedReferralCode);
      } catch (error) {
        console.log(error);
      }
    };
    handleURLRefCode();
  }, [account]);

  const FilterFarm = () => {
    filterFarms(
      newestToOldest,
      FarmData,
      range0 as number,
      range1 as number,
      setSearchedFarmData,
      ChainId as number
    );
    setShowPopover(false);
  };

  const [welcomeModal, setWelcomeModal] = useState(false);
  const [run, setRun] = useState(false);
  const bgColor = useColorModeValue("#319EF6", "#4CAFFF");

  useEffect(() => {
    const visits = window.localStorage.getItem("firstFarmVisit");
    if (!visits) {
      setWelcomeModal(true);
      window.localStorage.setItem("firstFarmVisit", "1");
    }
  }, []);

  function strartWelcomeRide() {
    setRun(true);
  }

  return (
    // <YieldFarm
    //                         farmDataLoading={farmDataLoading}
    //                         content2={content}
    //                         key={content?.id}
    //                         refreshSpecialData={refreshSpecialData}
    //                         section={"normal"}
    //                         wallet={wallet}
    //                         LoadingState={loadingState}
    //                       />
    <Box>
      <Joyride
        steps={steps}
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
        startToure={strartWelcomeRide}
        openModal={welcomeModal}
        closeModal={() => {
          window.localStorage.setItem("firstFarmVisit", "2");
          setWelcomeModal((state) => !state);
        }}
        textHeader={"Welcome to SmartSwap Farming"}
        welcomeText='With farming, you can maximize the rate of return on capital and generate rewards on your cryptocurrency holdings.'
      />

      {!showAlert || tabIndex === 0 ? null : (tabIndex === 1 &&
          stakingIndex === 1) ||
        tabIndex === 2 ? (
        <Box mx={[5, 10, 15, 20]} my={4}>
          <Alert
            color='#FFFFFF'
            background={mode === DARK_THEME ? "#319EF6" : "#319EF6"}
            borderRadius='8px'
          >
            <AlertSvg />
            <AlertDescription
              fontFamily='Inter'
              fontSize={{ base: "12px", md: "14px", lg: "16px" }}
              fontWeight='500'
              lineHeight='24px'
              letterSpacing='0em'
              textAlign='left'
              padding='8px'
            >
              {chainId && library ? (
                <Box display='flex'>
                  Your referral link is {hostName}?ref=
                  {shortenCode(referralCode)}
                  <Tooltip
                    hasArrow
                    label={hasCopied ? "Copied!" : "Copy"}
                    bg='gray.300'
                    color='black'
                  >
                    <IconButton
                      onClick={onCopy}
                      aria-label='Copy referral link'
                      icon={<CopyIcon />}
                      colorScheme='ghost'
                      pl={3}
                    />
                  </Tooltip>
                  <Text>Copy link</Text>
                </Box>
              ) : (
                `Connect your wallet to get a referral link`
              )}
            </AlertDescription>

            <CloseButton
              position='absolute'
              margin='2px'
              height='14px'
              width='14px'
              background='#319EF6'
              color='#fff'
              right='20px'
              textAign='center'
              onClick={handleAlert}
            />
          </Alert>
        </Box>
      ) : null}

      <Flex
        mx={[5, 10, 15, 20]}
        my={4}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Heading fontSize={"24px"}>Farm</Heading>
        <Link
          href='https://docs.google.com/forms/d/e/1FAIpQLSdJGAuABrJd6d0WSprUWB140we9hGqa-IwIbonx9ZJhxN2zsg/viewform'
          _hover={{ textDecoration: "none" }}
          _active={{ textDecoration: "none" }}
          isExternal
        >
          <Button
            background='#4CAFFF'
            boxShadow='0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)'
            borderRadius='6px'
            padding='12px 16px'
            variant='brand'
            leftIcon={<SmallAddIcon color={"white"} />}
            display={isMobileDevice ? "none" : undefined}
            className={"list"}
          >
            List your project
          </Button>
        </Link>
      </Flex>

      <Tabs
        variant='line'
        mx={[5, 10, 15, 20]}
        my={4}
        isFitted={isMobileDevice}
        onChange={(index) => handleSelect(index)}
      >
        <TabList>
          <Tab>Liquidity Pool</Tab>
          <Tab>Staking Pool</Tab>
          {Number(ChainId) === Number(SupportedChainId.OASISTEST) ||
          Number(ChainId) === Number(SupportedChainId.OASISMAINNET) ? null : (
            <>
              <Tab>Product Farm</Tab>
              <Tab>New Farms</Tab>
            </>
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Tabs isFitted variant='unstyled' onChange={() => handleSelect(0)}>
              <FarmTab
                oldestToNewest={oldestToNewest}
                setOldestToNewset={setOldestToNewest}
                setNewestToOldest={setNewestToOldest}
                newestToOldest={newestToOldest}
                range0={range0}
                range1={range1}
                setRange0={setRange0}
                setRange1={setRange1}
                FilterFarm={() => FilterFarm()}
                showPopOver={showPopOver}
                setShowPopover={setShowPopover}
                setSavedChanges={setSavedChanges}
                tabTwoName={
                  Number(ChainId) === Number(SupportedChainId.POLYGON) ||
                  Number(ChainId) === Number(SupportedChainId.POLYGONTEST) ||
                  Number(ChainId) === Number(SupportedChainId.OASISMAINNET)
                    ? null
                    : "Version 1"
                }
                tabOneName={"Version 2"}
                setKeyword={searchSingleFarm}
              />
              <TabPanels>
                <TabPanel px={0} py={"40px"}>
                  <FarmHeader />
                  <Box mx='auto' w={["100%", "100%", "100%"]} pb='70px'>
                    {LpfarmLoading ? (
                      <Stack mt={2}>
                        {new Array(4).fill("1").map((item, index) => {
                          return (
                            <Box
                              p={isMobileDevice ? "3" : "6"}
                              h={isMobileDevice ? undefined : 20}
                              border='1px'
                              borderColor={filterBorderColor}
                            >
                              <Flex
                                flexDirection={
                                  isMobileDevice ? "column" : "row"
                                }
                                justifyContent={
                                  isMobileDevice ? "center" : "space-between"
                                }
                                alignItems={
                                  isMobileDevice ? "center" : undefined
                                }
                              >
                                {new Array(4).fill("1").map((item, index) => {
                                  return (
                                    <Flex
                                      ml={isMobileDevice ? undefined : 2}
                                      mt={isMobileDevice ? 2 : undefined}
                                      flexDirection='column'
                                    >
                                      <Skeleton
                                        background='red.300'
                                        height='20px'
                                        w={isMobileDevice ? "320px" : "208px"}
                                      />
                                    </Flex>
                                  );
                                })}
                              </Flex>
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : (
                      farms?.LpFarm.map((content: any) => (
                        <YieldFarm
                          farmDataLoading={farmDataLoading}
                          content2={content}
                          key={content?.id}
                          refreshSpecialData={refreshSpecialData}
                          section={"normal"}
                          wallet={wallet}
                          LoadingState={LpfarmLoading}
                        />
                      ))
                    )}
                  </Box>
                </TabPanel>
                {Number(ChainId) === Number(SupportedChainId.POLYGON) ||
                Number(ChainId) === Number(SupportedChainId.POLYGONTEST) ||
                Number(ChainId) ===
                  Number(SupportedChainId.OASISMAINNET) ? null : (
                  <TabPanel px={0} py={"40px"}>
                    <Flex
                      justifyContent='center'
                      alignItems='center'
                      rounded='lg'
                      mb={4}
                    >
                      <Box
                        bg='#120136'
                        minHeight='89vh'
                        w={["100%", "100%", "100%"]}
                        background={
                          mode === LIGHT_THEME &&
                          selected === farmSection.STAKING
                            ? "#FFFFFF !important"
                            : mode === DARK_THEME &&
                              selected === farmSection.LIQUIDITY
                            ? "#15202B !important"
                            : mode === DARK_THEME &&
                              selected === farmSection.STAKING
                            ? "#15202B !important"
                            : mode === LIGHT_THEME &&
                              selected === farmSection.LIQUIDITY
                            ? "#FFFFFF !important"
                            : "#FFFFFF !important"
                        }
                        rounded='lg'
                      >
                        <Box mx='auto' w={["100%", "100%", "100%"]} pb='70px'>
                          <Flex
                            alignItems='center'
                            justifyContent='space-between'
                            px={4}
                            py={4}
                            background={
                              mode === LIGHT_THEME &&
                              selected === farmSection.LIQUIDITY
                                ? "#F2F5F8  !important"
                                : mode === DARK_THEME &&
                                  selected === farmSection.LIQUIDITY
                                ? "#213345"
                                : mode === DARK_THEME &&
                                  selected === farmSection.STAKING
                                ? "#213345"
                                : mode === LIGHT_THEME &&
                                  selected === farmSection.STAKING
                                ? "#F2F5F8"
                                : "#F2F5F8 !important"
                            }
                            color={
                              mode === LIGHT_THEME &&
                              selected === farmSection.LIQUIDITY
                                ? "#333333"
                                : mode === DARK_THEME &&
                                  selected === farmSection.STAKING
                                ? "#F1F5F8"
                                : mode === DARK_THEME &&
                                  selected === farmSection.LIQUIDITY
                                ? "#F1F5F8"
                                : mode === LIGHT_THEME &&
                                  selected === farmSection.STAKING
                                ? "#333333"
                                : "#333333"
                            }
                            w={["100%", "100%", "100%"]}
                            align='left'
                            border={
                              mode === LIGHT_THEME
                                ? "1px solid #DEE5ED !important"
                                : mode === DARK_THEME
                                ? "1px solid #324D68 !important"
                                : "1px solid #324D68"
                            }
                            display={{ base: "none", md: "flex", lg: "flex" }}
                          >
                            <Text>
                              Please Migrate your LP farm tokens from V1 to V2
                            </Text>
                          </Flex>

                          <Link
                            href='https://smartswapv1.rigelprotocol.com/farming'
                            isExternal
                          >
                            <Button
                              background='#4CAFFF'
                              boxShadow='0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)'
                              borderRadius='6px'
                              mx={[5, 10, 15, 20]}
                              position={{ base: "relative", md: "absolute" }}
                              padding=' 12px 32px'
                              mt={3}
                              variant='brand'
                            >
                              Go to farming V1
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                    </Flex>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel px={0} py={"40px"}>
            <Tabs
              isFitted
              variant='unstyled'
              onChange={(index) => handleSelect(1)}
            >
              <FarmTab
                oldestToNewest={oldestToNewest}
                setOldestToNewset={setOldestToNewest}
                setNewestToOldest={setNewestToOldest}
                newestToOldest={newestToOldest}
                range0={range0}
                range1={range1}
                setRange0={setRange0}
                setRange1={setRange1}
                FilterFarm={() => FilterFarm()}
                showPopOver={showPopOver}
                setShowPopover={setShowPopover}
                setSavedChanges={setSavedChanges}
                tabOneName={"Version 2"}
                setKeyword={searchSingleFarm}
              />
              <TabPanels>
                <TabPanel px={0} py={"40px"}>
                  <FarmHeader />

                  {farms?.SpecialPool?.map((content: any, index: number) => (
                    <YieldFarm
                      farmDataLoading={farmDataLoading}
                      content={content}
                      refreshSpecialData={refreshSpecialData}
                      key={content.pid}
                      wallet={wallet}
                      URLReferrerAddress={refAddress}
                    />
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs isFitted variant='unstyled' onChange={() => handleSelect(2)}>
              <FarmTab
                oldestToNewest={oldestToNewest}
                setOldestToNewset={setOldestToNewest}
                setNewestToOldest={setNewestToOldest}
                newestToOldest={newestToOldest}
                range0={range0}
                range1={range1}
                setRange0={setRange0}
                setRange1={setRange1}
                FilterFarm={() => FilterFarm()}
                showPopOver={showPopOver}
                setShowPopover={setShowPopover}
                setSavedChanges={setSavedChanges}
                tabOneName={"Product Farm"}
                setKeyword={searchSingleFarm}
              />
              <TabPanels>
                <TabPanel px={0} py={"40px"}>
                  <Flex
                    justifyContent='center'
                    alignItems='center'
                    rounded='lg'
                    mb={4}
                  >
                    <Box
                      bg='#120136'
                      minHeight='89vh'
                      w={["100%", "100%", "100%"]}
                      background={
                        mode === LIGHT_THEME
                          ? "#FFFFFF !important"
                          : mode === DARK_THEME
                          ? "#15202B !important"
                          : "#FFFFFF !important"
                      }
                      rounded='lg'
                    >
                      <Box mx='auto' w={["100%", "100%", "100%"]} pb='70px'>
                        <Grid
                          templateColumns={[
                            "repeat(1,1fr)",
                            "repeat(1,1fr)",
                            "repeat(6,1fr)",
                          ]}
                          px={4}
                          py={4}
                          background={
                            mode === DARK_THEME
                              ? "#213345"
                              : mode === LIGHT_THEME
                              ? "#F2F5F8"
                              : "#F2F5F8 !important"
                          }
                          color={
                            mode === LIGHT_THEME
                              ? "#333333"
                              : mode === DARK_THEME
                              ? "#F1F5F8"
                              : "#333333"
                          }
                          w={["100%", "100%", "100%"]}
                          align='left'
                          border={
                            mode === LIGHT_THEME
                              ? "1px solid #DEE5ED !important"
                              : mode === DARK_THEME
                              ? "1px solid #324D68 !important"
                              : "1px solid #324D68"
                          }
                          display={isMobileDevice ? "none" : "grid"}
                        >
                          <Text fontSize='14px'>
                            {selected === farmSection.PRODUCT_FARM
                              ? "AutoTrade Product"
                              : "Deposit"}
                          </Text>
                          <Text ml={4} fontSize='14px'>
                            {selected === farmSection.PRODUCT_FARM
                              ? "Percentage Profit Share"
                              : "Earn"}
                          </Text>
                          <Text ml={4} fontSize='14px'>
                            {selected === farmSection.PRODUCT_FARM
                              ? "Profit Timeline"
                              : "APY"}
                          </Text>
                          <Text ml={4} fontSize='14px'>
                            Total Liquidity
                          </Text>
                          {selected === farmSection.PRODUCT_FARM && (
                            <Text ml={4} fontSize='14px'>
                              Estimated Total Profits
                            </Text>
                          )}
                          <Text />
                        </Grid>
                        {FarmData.productFarm.map(
                          (content: any, index: number) =>
                            index === 0 ? (
                              <ProductFarm
                                farmDataLoading={farmDataLoading}
                                content={content}
                                key={content.pid}
                                refreshSpecialData={refreshSpecialData}
                                wallet={wallet}
                                URLReferrerAddress={refAddress}
                              />
                            ) : null
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs
              isFitted
              variant='unstyled'
              onChange={(index) => handleSelect(index + 3)}
            >
              <FarmTab
                oldestToNewest={oldestToNewest}
                setOldestToNewset={setOldestToNewest}
                setNewestToOldest={setNewestToOldest}
                newestToOldest={newestToOldest}
                range0={range0}
                range1={range1}
                setRange0={setRange0}
                setRange1={setRange1}
                FilterFarm={() => FilterFarm()}
                showPopOver={showPopOver}
                setShowPopover={setShowPopover}
                setSavedChanges={setSavedChanges}
                tabOneName={
                  Number(ChainId) === Number(SupportedChainId.POLYGON) ||
                  Number(ChainId) === Number(SupportedChainId.POLYGONTEST)
                    ? "QuickSwap LP"
                    : "Pancake LP"
                }
                tabTwoName={"Stable LP"}
                setKeyword={searchSingleFarm}
              />
              <TabPanels>
                <TabPanel px={0} py={"40px"}>
                  <Flex
                    justifyContent='center'
                    alignItems='center'
                    rounded='lg'
                    mb={4}
                  >
                    <Box
                      bg='#120136'
                      minHeight='89vh'
                      w={["100%", "100%", "100%"]}
                      background={
                        mode === LIGHT_THEME && selected === farmSection.STAKING
                          ? "#FFFFFF !important"
                          : mode === DARK_THEME &&
                            selected === farmSection.NEW_LP
                          ? "#15202B !important"
                          : mode === DARK_THEME &&
                            selected === farmSection.STAKING
                          ? "#15202B !important"
                          : mode === LIGHT_THEME &&
                            selected === farmSection.NEW_LP
                          ? "#FFFFFF !important"
                          : "#FFFFFF !important"
                      }
                      rounded='lg'
                    >
                      <Box mx='auto' w={["100%", "100%", "100%"]} pb='70px'>
                        <Flex
                          alignItems='center'
                          justifyContent='space-around'
                          px={4}
                          py={4}
                          background={
                            mode === LIGHT_THEME &&
                            selected === farmSection.NEW_LP
                              ? "#F2F5F8  !important"
                              : mode === DARK_THEME &&
                                selected === farmSection.NEW_LP
                              ? "#213345"
                              : mode === DARK_THEME &&
                                selected === farmSection.STAKING
                              ? "#213345"
                              : mode === LIGHT_THEME &&
                                selected === farmSection.STAKING
                              ? "#F2F5F8"
                              : "#F2F5F8 !important"
                          }
                          color={
                            mode === LIGHT_THEME &&
                            selected === farmSection.NEW_LP
                              ? "#333333"
                              : mode === DARK_THEME &&
                                selected === farmSection.STAKING
                              ? "#F1F5F8"
                              : mode === DARK_THEME &&
                                selected === farmSection.NEW_LP
                              ? "#F1F5F8"
                              : mode === LIGHT_THEME &&
                                selected === farmSection.STAKING
                              ? "#333333"
                              : "#333333"
                          }
                          w={["100%", "100%", "100%"]}
                          align='left'
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
                          <Text>LP Locked</Text>
                          <Text />
                        </Flex>

                        {quickswapLoading ? (
                          <Stack mt={2}>
                            {new Array(4).fill("1").map((item, index) => {
                              return (
                                <Box
                                  p={isMobileDevice ? "3" : "6"}
                                  h={isMobileDevice ? undefined : 20}
                                  border='1px'
                                  borderColor={filterBorderColor}
                                >
                                  <Flex
                                    flexDirection={
                                      isMobileDevice ? "column" : "row"
                                    }
                                    justifyContent={
                                      isMobileDevice
                                        ? "center"
                                        : "space-between"
                                    }
                                    alignItems={
                                      isMobileDevice ? "center" : undefined
                                    }
                                  >
                                    {new Array(4)
                                      .fill("1")
                                      .map((item, index) => {
                                        return (
                                          <Flex
                                            ml={isMobileDevice ? undefined : 2}
                                            mt={isMobileDevice ? 2 : undefined}
                                            flexDirection='column'
                                          >
                                            <Skeleton
                                              background='red.300'
                                              height='20px'
                                              w={
                                                isMobileDevice
                                                  ? "320px"
                                                  : "208px"
                                              }
                                            />
                                          </Flex>
                                        );
                                      })}
                                  </Flex>
                                </Box>
                              );
                            })}
                          </Stack>
                        ) : (
                          farms?.QuickswapFarm.map((content: any) => (
                            <YieldFarm
                              farmDataLoading={farmDataLoading}
                              content2={content}
                              key={content?.id}
                              section={"normal"}
                              wallet={wallet}
                              LoadingState={quickswapLoading}
                              contractID={1}
                              refreshSpecialData={refreshSpecialData}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </TabPanel>
                <TabPanel px={0} py={"40px"}>
                  <Flex
                    justifyContent='center'
                    alignItems='center'
                    rounded='lg'
                    mb={4}
                  >
                    <Box
                      bg='#120136'
                      minHeight='89vh'
                      w={["100%", "100%", "100%"]}
                      background={
                        mode === LIGHT_THEME && selected === farmSection.STAKING
                          ? "#FFFFFF !important"
                          : mode === DARK_THEME &&
                            selected === farmSection.SECOND_NEW_LP
                          ? "#15202B !important"
                          : mode === DARK_THEME &&
                            selected === farmSection.STAKING
                          ? "#15202B !important"
                          : mode === LIGHT_THEME &&
                            selected === farmSection.SECOND_NEW_LP
                          ? "#FFFFFF !important"
                          : "#FFFFFF !important"
                      }
                      rounded='lg'
                    >
                      <Box mx='auto' w={["100%", "100%", "100%"]} pb='70px'>
                        <Flex
                          alignItems='center'
                          justifyContent='space-around'
                          px={4}
                          py={4}
                          background={
                            mode === LIGHT_THEME &&
                            selected === farmSection.SECOND_NEW_LP
                              ? "#F2F5F8  !important"
                              : mode === DARK_THEME &&
                                selected === farmSection.SECOND_NEW_LP
                              ? "#213345"
                              : "#F2F5F8 !important"
                          }
                          color={
                            mode === LIGHT_THEME &&
                            selected === farmSection.SECOND_NEW_LP
                              ? "#333333"
                              : mode === DARK_THEME &&
                                selected === farmSection.STAKING
                              ? "#F1F5F8"
                              : mode === DARK_THEME &&
                                selected === farmSection.SECOND_NEW_LP
                              ? "#F1F5F8"
                              : mode === LIGHT_THEME &&
                                selected === farmSection.STAKING
                              ? "#333333"
                              : "#333333"
                          }
                          w={["100%", "100%", "100%"]}
                          align='left'
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
                          <Text>LP Locked</Text>
                          <Text />
                        </Flex>

                        {stableFarmLoading ? (
                          <Stack mt={2}>
                            {new Array(4).fill("1").map((item, index) => {
                              return (
                                <Box
                                  p={isMobileDevice ? "3" : "6"}
                                  h={isMobileDevice ? undefined : 20}
                                  border='1px'
                                  borderColor={filterBorderColor}
                                >
                                  <Flex
                                    flexDirection={
                                      isMobileDevice ? "column" : "row"
                                    }
                                    justifyContent={
                                      isMobileDevice
                                        ? "center"
                                        : "space-between"
                                    }
                                    alignItems={
                                      isMobileDevice ? "center" : undefined
                                    }
                                  >
                                    {new Array(4)
                                      .fill("1")
                                      .map((item, index) => {
                                        return (
                                          <Flex
                                            ml={isMobileDevice ? undefined : 2}
                                            mt={isMobileDevice ? 2 : undefined}
                                            flexDirection='column'
                                          >
                                            <Skeleton
                                              background='red.300'
                                              height='20px'
                                              w={
                                                isMobileDevice
                                                  ? "320px"
                                                  : "208px"
                                              }
                                            />
                                          </Flex>
                                        );
                                      })}
                                  </Flex>
                                </Box>
                              );
                            })}
                          </Stack>
                        ) : (
                          farms?.StableFarm.map((content: any) => (
                            <YieldFarm
                              farmDataLoading={farmDataLoading}
                              content2={content}
                              key={content?.id}
                              section={"normal"}
                              wallet={wallet}
                              LoadingState={stableFarmLoading}
                              refreshSpecialData={refreshSpecialData}
                              contractID={2}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Index;

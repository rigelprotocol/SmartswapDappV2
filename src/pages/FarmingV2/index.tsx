/** @format */

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Alert,
  AlertDescription,
  Button,
  CloseButton,
  Link,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useMediaQuery,
  Tooltip,
  IconButton,
  useClipboard,
  InputGroup,
  InputLeftAddon,
  Input,
  Grid,
  Stack,
  Skeleton,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
} from "@chakra-ui/react";
import { CopyIcon } from "../../theme/components/Icons";
import { useHistory, useRouteMatch } from "react-router-dom";
import YieldFarm from "./YieldFarm";
import { AlertSvg } from "./Icon";
import {HamburgerIcon} from "@chakra-ui/icons";

import { useDispatch, useSelector } from "react-redux";
import bigNumber from "bignumber.js";
import { ethers } from "ethers";
import {
  updateFarmBalances,
  updatePoolId,
  updateTokenStaked,
  updateTotalLiquidity,
  updateFarmProductLiquidity,
  updateProductStaked
} from "../../state/farm/actions";
import { useFarms } from "../../state/farm/hooks";
import {
  MasterChefV2Contract,
  RGPSpecialPool,
  RGPSpecialPool2,
  rigelToken,
  smartSwapLPTokenPoolOne,
  smartSwapLPTokenPoolThree,
  smartSwapLPTokenPoolTwo,
  smartSwapLPTokenV2,
  smartSwapLPTokenV2PoolFive,
  smartSwapLPTokenV2PoolFour,
  smartSwapLPTokenV2PoolSeven,
  smartSwapLPTokenV2PoolSix,
  smartSwapLPTokenV2PoolEight,
  smartSwapLPTokenV2PoolNine,
  smartSwapLPTokenV2PoolTwelve,
  smartSwapLPTokenV2PoolThirteen,
  productStakingContract,
} from "../../utils/Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  RGP,
  RGPSPECIALPOOLADDRESSES,
  RGPSPECIALPOOLADDRESSES2,
  SMARTSWAPLP_TOKEN1ADDRESSES,
  SMARTSWAPLP_TOKEN2ADDRESSES,
  SMARTSWAPLP_TOKEN3ADDRESSES,
  SMARTSWAPLP_TOKEN4ADDRESSES,
  SMARTSWAPLP_TOKEN5ADDRESSES,
  SMARTSWAPLP_TOKEN6ADDRESSES,
  SMARTSWAPLP_TOKEN7ADDRESSES,
  SMARTSWAPLP_TOKEN8ADDRESSES,
  SMARTSWAPLP_TOKEN9ADDRESSES,
  SMARTSWAPLP_TOKEN12ADDRESSES,
  SMARTSWAPLP_TOKEN13ADDRESSES,
  PRODUCTSTAKINGADDRESSES,
} from "../../utils/addresses";
import { formatBigNumber } from "../../utils";
import { RootState } from "../../state";
import { SupportedChainId } from "../../constants/chains";
import ProductFarm from "./ProductFarm"
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import Joyride from "react-joyride";
import { steps } from "../../components/Onboarding/FarmingSteps";
import WelcomeModal from "../../components/Onboarding/WelcomeModal";
import CryptoJS from "crypto-js";
import { shortenCode } from "../../utils";
import { useLocation } from "react-router-dom";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { useUpdateUserGasPreference } from "../../state/gas/hooks";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import Filter from "../../components/Farming/Modals/Filter";
import { filterFarms } from "../../utils/utilsFunctions";
import { farmStateInterface } from "../../state/farm/reducer";
import {
  useFarmSearch,
  usePrevious,
  useSearch,
  useFilterFarms,
  useSearchResults,
} from "../../state/farming/hooks";
import {
  clearSearchResult,
  updateSearchResult,
} from "../../state/farming/action";
import { useGetFarmData } from "../../utils/hooks/useGetFarmData";
import {useGetNewFarms} from "../../utils/hooks/useGetNewFarms";
import { useClearFarm } from "../../state/farming/hooks";

import { useFarmData } from "../../state/newfarm/hooks";
import { useNewLPData} from "../../state/LPFarm/hooks";
import { GFarmingClickListYourProject, GFarmingInputSearchFarm, GOpenedSpecialPool } from "../../components/G-analytics/gFarming";
import { ZERO_ADDRESS } from "../../constants";
import {updateSelectedField} from "../../state/farming/action";
import {State} from "../../state/types";
import {clearAllFarms} from "../../state/newFarming/action";

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
  const useNotSelectedBackgroundColor = useColorModeValue("#FFFFFF","#15202B");
  const useSelectedBackgroundColor = useColorModeValue("#DEE5ED","#213345");
  const useNotSelectedBorderColor = useColorModeValue("#008DFF","#324D68");
  const useSelectedBorderColor = useColorModeValue("#0760A8","#F2F5F8");
  const useNotSelectedTextColor = useColorModeValue("#333333","#0760A8");
  const useSelectedTextColor = useColorModeValue("#0760A8","#008DFF");
  
  const borderColor = useColorModeValue("#F2F5F8","#324D68");
  const useSelectedColor = useColorModeValue("#333333","#213345");
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
  const [ productFarmIndex, setProductFarmIndex] = useState(4);
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
  const [searchedFarmData, setSearchedFarmData] =
    useState<farmStateInterface>();

  const [showPopOver, setShowPopover] = useState(false);
  const [saveChanges, setSavedChanges] = useState(false);
  const [keyword, setKeyword] = useState("");



  // 👇 look here
  const previousKeyword = usePrevious(keyword);

  const filter = useSearch();
  useClearFarm();
  const selector = useSelector((state: State) => state.farming.selectedField);

  const [searchedDataResult] = useFarmSearch({
    keyword,
    previousKeyword,
    searchData: filter,
  });
      useEffect(() => {
          if(location && location.includes("RGPv2")){
              // setSelected(STAKING);
              setSelected(farmSection.STAKING);
              dispatch(updateSelectedField({value: farmSection.STAKING}));
              setTabIndex(1);
            } else if (location && location.includes("product-farm")){
              // setSelected(PRODUCT_FARMS);
              setSelected(farmSection.PRODUCT_FARM);
            dispatch(updateSelectedField({value: farmSection.PRODUCT_FARM}));
              setTabIndex(2)
            } else if (location && location.includes("new-farm")) {
              setSelected(farmSection.NEW_LP);
              dispatch(updateSelectedField({value: farmSection.NEW_LP}));
              setTabIndex(5)
            } else if (location && location.includes("second-farm")) {
            setSelected(farmSection.SECOND_NEW_LP);
            dispatch(updateSelectedField({value: farmSection.SECOND_NEW_LP}));
            setTabIndex(6)
          } else {
              // setSelected(LIQUIDITY)
              setSelected(farmSection.LIQUIDITY);
            dispatch(updateSelectedField({value: farmSection.LIQUIDITY}));
              setTabIndex(0);
            }
      },[location, selector]);


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
    if (chainId !== SupportedChainId.OASISMAINNET) {
      const useIndex =
        index === 0 ? liquidityIndex : index === 1 ? stakingIndex :liquidityIndex=== 2 ? setTabIndex(3) : index;
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
      history.push("/farming-v2/staking-RGPv2");
    } else if (parseInt(event.target.value, 10) === 3) {
      setStakingIndex(3);
      setTabIndex(3);
      history.push("/farming-v2/staking-RGPv1");
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
      history.push("/farming-v2/new-farm");
    } else if (parseInt(event.target.value, 10) === 6) {
      setNewFarmIndex(6);
      setTabIndex(6);
      history.push("/farming-v2/second-farm");
    }
  };

  const { account, chainId, library } = useActiveWeb3React();
  const dispatch = useDispatch();
  let match = useRouteMatch("/farming-V2/staking-RGPv2");
  const FarmData = useFarms();
  const { farmdata, loadingState } = useGetFarmData();
  const { LPData, loadingLP } = useGetNewFarms(selected === farmSection.SECOND_NEW_LP ? 2 : 1);

  const data = useFarmData();
  const newLP = useNewLPData();
  const farms = useSelector((state) => state.farming.content);
  const recentFarms = useSelector((state) => state.newFarming.content);
  const searchSection = useSelector((state) => state.farming);
  const newSearchSection = useSelector((state) => state.newFarming);

  useEffect(() => {
    dispatch(clearAllFarms())
  }, [chainId]);


  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
    setKeyword("");
  }, [chainId]);

  const handleUpdateSearch = useCallback((searchedDataResult) => {
    dispatch(
      updateSearchResult({
        farmData: searchedDataResult,
      })
    );
  }, []);

  useMemo(() => {
    handleUpdateSearch(searchedDataResult);
  }, [searchedDataResult]);

  const [Balance, Symbol] = useNativeBalance();
  const wallet = {
    balance: Balance,
    address: account,
    provider: library,
    signer: library?.getSigner(),
    chainId: chainId,
  };

  const searchResults = useSearchResults();

  const ChainId = useSelector<RootState>((state) => state.newfarm.chainId);

  //temporary
  // useEffect(() => {
  //   getFarmData();
  //   getTokenStaked();
  //   getFarmTokenBalance();
  // }, [account, chainId, stateChanged]);
  //
  // const refreshData = () => {
  //   getFarmData();
  //   getTokenStaked();
  //   getFarmTokenBalance();
  // };
  //
  // useEffect(() => {
  //   refreshData();
  // }, []);

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
      dispatch(updateSelectedField({value: farmSection.LIQUIDITY}));
      changeVersion("/farming-v2");
    }else if(value === farmSection.PRODUCT_FARM) {
      setSelected(farmSection.PRODUCT_FARM);
      dispatch(updateSelectedField({value: farmSection.PRODUCT_FARM}));
      setSwitchTab(!switchTab);
      changeVersion("/farming-V2/product-farm");
    }else if(value === farmSection.NEW_LP) {
      setSelected(farmSection.NEW_LP);
      dispatch(updateSelectedField({value: farmSection.NEW_LP}));
      setSwitchTab(!switchTab);
      changeVersion("/farming-V2/new-farm");
    }else if(value === farmSection.SECOND_NEW_LP) {
      setSelected(farmSection.SECOND_NEW_LP);
      dispatch(updateSelectedField({value: farmSection.SECOND_NEW_LP}));
      setSwitchTab(!switchTab);
      changeVersion("/farming-V2/second-farm");
    } else if (value === farmSection.STAKING) {
      setSwitchTab(!switchTab);
      setSelected(farmSection.STAKING);
      dispatch(updateSelectedField({value: farmSection.STAKING}));
      GOpenedSpecialPool(tabIndex);
      if (tabIndex === 1) {
        setStakingIndex(1);
        changeVersion("/farming-v2/staking-RGPv2");
      } else {
        setStakingIndex(3);
        changeVersion("/farming-v2/staking-RGPv1");
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
      chainId as number
    );
    setShowPopover(false);
  };

  const getFarmTokenBalance = async () => {
    if (account) {
      try {
        if (
          Number(chainId) === Number(SupportedChainId.POLYGON) ||
          (account && Number(chainId) === Number(SupportedChainId.POLYGONTEST))
        ) {
          const [RGPToken, poolOne, poolTwo, poolThree, RGPToken2] =
            await Promise.all([
              rigelToken(RGP[chainId as number], library),
              smartSwapLPTokenPoolOne(
                SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
                library
              ),
              smartSwapLPTokenPoolTwo(
                SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
                library
              ),
              smartSwapLPTokenPoolThree(
                SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
                library
              ),
              rigelToken(RGP[chainId as number], library),
              // smartSwapLPTokenV2PoolFour(
              //   SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number],
              //   library
              // ),
              // smartSwapLPTokenV2PoolFive(
              //   SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number],
              //   library
              // ),
            ]);

          const [
            RGPbalance,
            poolOneBalance,
            poolTwoBalance,
            poolThreeBalance,
            RGPbalance2,
          ] = await Promise.all([
            RGPToken.balanceOf(account),
            poolOne.balanceOf(account),
            poolTwo.balanceOf(account),
            poolThree.balanceOf(account),
            RGPToken2.balanceOf(account),
          ]);

          dispatch(
            updateFarmBalances([
              formatBigNumber(RGPbalance),
              formatBigNumber(poolOneBalance),
              formatBigNumber(poolTwoBalance),
              formatBigNumber(poolThreeBalance),
              0,
              0,
              0,
              0,
              0,
              0,
              formatBigNumber(RGPbalance2),
              // formatBigNumber(poolFourBalance),
              // formatBigNumber(poolFiveBalance),
            ])
          );
          dispatch(updatePoolId([0, 1, 2, 3]));
        } else if (Number(chainId) === Number(SupportedChainId.OASISTEST)) {
          const [RGPToken, poolOne, poolTwo, poolThree] = await Promise.all([
            rigelToken(RGP[chainId as number], library),
            smartSwapLPTokenPoolOne(
              SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolTwo(
              SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolThree(
              SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
              library
            ),
          ]);

          const [RGPbalance, poolOneBalance, poolTwoBalance, poolThreeBalance] =
            await Promise.all([
              RGPToken.balanceOf(account),
              poolOne.balanceOf(account),
              poolTwo.balanceOf(account),
              poolThree.balanceOf(account),
            ]);

          dispatch(
            updateFarmBalances([
              formatBigNumber(RGPbalance),
              formatBigNumber(poolOneBalance),
              formatBigNumber(poolTwoBalance),
              formatBigNumber(poolThreeBalance),
            ])
          );
          dispatch(updatePoolId([0, 1, 2, 3]));
        } else if (Number(chainId) === Number(SupportedChainId.OASISMAINNET)) {
          const [RGPToken, poolOne, poolTwo, poolThree] = await Promise.all([
            rigelToken(RGP[chainId as number], library),
            smartSwapLPTokenPoolOne(
              SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolTwo(
              SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolThree(
              SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
              library
            ),
          ]);

          const [RGPbalance, poolOneBalance, poolTwoBalance, poolThreeBalance] =
            await Promise.all([
              RGPToken.balanceOf(account),
              poolOne.balanceOf(account),
              poolTwo.balanceOf(account),
              poolThree.balanceOf(account),
            ]);

          dispatch(
            updateFarmBalances([
              formatBigNumber(RGPbalance),
              formatBigNumber(poolOneBalance),
              formatBigNumber(poolTwoBalance),
              formatBigNumber(poolThreeBalance),
            ])
          );
          dispatch(updatePoolId([0, 1, 2, 3]));
        } else {
          const [
            RGPToken,
            poolOne,
            poolTwo,
            poolThree,
            poolFour,
            poolFive,
            poolSix,
            poolSeven,
            poolEight,
            poolNine,
            poolTwelve,
            poolThirteen,
            RGPToken2
          ] = await Promise.all([
            rigelToken(RGP[chainId as number], library),
            smartSwapLPTokenPoolOne(
              SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolTwo(
              SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolThree(
              SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolFour(
              SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolFive(
              SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolSix(
              SMARTSWAPLP_TOKEN6ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolSeven(
              SMARTSWAPLP_TOKEN7ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolEight(
              SMARTSWAPLP_TOKEN8ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolNine(
              SMARTSWAPLP_TOKEN9ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolNine(
              SMARTSWAPLP_TOKEN12ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenV2PoolNine(
              SMARTSWAPLP_TOKEN13ADDRESSES[chainId as number],
              library
            ),
            rigelToken(RGP[chainId as number], library)
          ]);

          const [
            RGPbalance,
            poolOneBalance,
            poolTwoBalance,
            poolThreeBalance,
            poolFourBalance,
            poolFiveBalance,
            poolSixBalance,
            poolSevenBalance,
            poolEightBalance,
            poolNineBalance,
            poolTwelveBalance,
            poolThirteenBalance,
            RGPbalance2,
          ] = await Promise.all([
            RGPToken.balanceOf(account),
            poolOne.balanceOf(account),
            poolTwo.balanceOf(account),
            poolThree.balanceOf(account),
            poolFour.balanceOf(account),
            poolFive.balanceOf(account),
            poolSix.balanceOf(account),
            poolSeven.balanceOf(account),
            poolEight.balanceOf(account),
            poolNine.balanceOf(account),
            poolTwelve.balanceOf(account),
            poolThirteen.balanceOf(account),
            RGPToken2.balanceOf(account),
          ]);



          dispatch(
            updateFarmBalances([
              formatBigNumber(RGPbalance),
              formatBigNumber(poolTwoBalance),
              formatBigNumber(poolOneBalance),
              formatBigNumber(poolThreeBalance),
              formatBigNumber(poolFourBalance),
              formatBigNumber(poolFiveBalance),
              formatBigNumber(poolSixBalance),
              formatBigNumber(poolSevenBalance),
              formatBigNumber(poolEightBalance),
              formatBigNumber(poolNineBalance),
              formatBigNumber(poolTwelveBalance),
              formatBigNumber(poolThirteenBalance),
              formatBigNumber(RGPbalance2),
            ])
          );
        }
      } catch (error) {
        console.error(error, "getFarmTokenBalance => Farminv2");
      }
    }
  };

  const getFarmData = async () => {
    setfarmDataLoading(true);

    try {
      const deposit = async (token0: any, token1: any) => {
        let sym0 = await (
          await smartSwapLPTokenV2(await token0(), library)
        ).symbol();
        let sym1 = await (
          await smartSwapLPTokenV2(await token1(), library)
        ).symbol();
        if (sym0 === "WMATIC") sym0 = "MATIC";
        if (sym1 === "WMATIC") sym1 = "MATIC";
        if (sym0 === "WROSE") sym0 = "ROSE";
        if (sym1 === "WROSE") sym1 = "ROSE";
        if (sym0 === "wROSE") sym0 = "ROSE";
        if (sym1 === "wROSE") sym1 = "ROSE";

        return `${sym0}-${sym1}`;
      };

      if (Number(chainId) === Number(SupportedChainId.POLYGONTEST)) {
        const [specialPool, pool1, pool2, pool3, specialPool2] =
          await Promise.all([
            RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number], library),
            smartSwapLPTokenPoolOne(
              SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolTwo(
              SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolThree(
              SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
              library
            ),
            RGPSpecialPool2(
              RGPSPECIALPOOLADDRESSES2[chainId as number],
              library
            ),
          ]);

        const [
          rgpTotalStaking,
          pool1Reserve,
          pool2Reserve,
          pool3Reserve,
          rgpTotalStakingV2,
        ] = await Promise.all([
          await specialPool.totalStaking(),
          pool1.getReserves(),
          pool2.getReserves(),
          pool3.getReserves(),
          await specialPool2.totalStaking(),
        ]);

        const MRGPprice: number | any = ethers.utils.formatUnits(
          pool3Reserve[1].mul(1000).div(pool3Reserve[0]),
          3
        );
        // const getMaticPrice = (): number => {
        //   let MaticPrice;
        //   MaticPrice = ethers.utils.formatUnits(
        //     pool5Reserve[0].mul(1000).div(pool5Reserve[1]),
        //     3
        //   );
        //
        //   return Number(MaticPrice);
        // };
        // const MaticPrice = getMaticPrice();

        //
        // const RGP_WMATICLiquidity = ethers.utils
        //   .formatUnits(
        //     pool1Reserve[0].mul(Math.floor(MaticPrice * 1000 * 2)),
        //     18
        //   )
        //   .toString();

        // const USDT_RGPLiquidity = ethers.utils
        //   .formatEther(pool2Reserve[0].mul(Number(MRGPprice) * 1000 * 2))
        //   .toString();
        //
        // const RGP_USDCLiquidity = ethers.utils
        //   .formatEther(pool3Reserve[1].mul(Number(MRGPprice) * 1000 * 2))
        //   .toString();
        //
        // const USDT_WMATICLiquidity = ethers.utils
        //   .formatEther(pool4Reserve[1].mul(Number(MaticPrice) * 1000 * 2))
        //   .toString();
        //
        // const WMATIC_USDCLiquidity = ethers.utils
        //   .formatEther(pool5Reserve[1].mul(Number(MaticPrice) * 1000 * 2))
        //   .toString();

        const totalUSDT2: number | any = ethers.utils.formatUnits(
          pool2Reserve[0],
          18
        );
        const totalRGP2: number | any = ethers.utils.formatUnits(
          pool2Reserve[1],
          18
        );
        const totalRGP1: number | any = ethers.utils.formatUnits(
          pool1Reserve[0],
          18
        );
        const totalRGP3: number | any = ethers.utils.formatUnits(
          pool3Reserve[0],
          18
        );

        const rgpPrice = totalUSDT2 / totalRGP2;

        const RGPprice: number | any = ethers.utils.formatUnits(
          pool1Reserve[0].mul(1000).div(pool1Reserve[1]),
          3
        );

        const RGP_USDTLiq = totalUSDT2 * 2;
        const RGP_WMATICLiquidity = Number(totalRGP1) * Number(rgpPrice) * 2;
        const USDC_RGPLiq = totalRGP3 * rgpPrice * 2;

        const RGPLiquidityV2 =
          (ethers.utils.formatUnits(rgpTotalStakingV2, 18) * rgpPrice) / 2;

        dispatch(
          updateTotalLiquidity([
            {
              deposit: "RGP",
              liquidity: "0", //MRGPLiquidity,
              apy: "0", //calculateApy(MRGPprice, MRGPLiquidity, 250),
            },
            {
              deposit: await deposit(pool1.token0, pool1.token1),
              liquidity: RGP_WMATICLiquidity,
              apy: calculateApy(rgpPrice, RGP_WMATICLiquidity, 1500),
            },
            {
              deposit: await deposit(pool2.token0, pool2.token1),
              liquidity: RGP_USDTLiq,
              apy: calculateApy(rgpPrice, RGP_USDTLiq, 1050),
            },
            {
              deposit: await deposit(pool3.token0, pool3.token1),
              liquidity: USDC_RGPLiq,
              apy: calculateApy(rgpPrice, USDC_RGPLiq, 1050),
            },
            {
              deposit: "",
              liquidity: "",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "RGP",
              liquidity: RGPLiquidityV2,
              apy: 8.756,
            },
            // {
            //   deposit: await deposit(pool4.token0, pool4.token1),
            //   liquidity: USDT_WMATICLiquidity,
            //   apy: calculateApy(MRGPprice, USDT_WMATICLiquidity, 334.875),
            // },
            // {
            //   deposit: await deposit(pool5.token0, pool5.token1),
            //   liquidity: WMATIC_USDCLiquidity,
            //   apy: calculateApy(MRGPprice, WMATIC_USDCLiquidity, 334.875),
            // },
          ])
        );
      } else if (Number(chainId) === Number(SupportedChainId.POLYGON)) {
        const [specialPool, pool1, pool2, pool3, specialPool2, farmProductContract] =
          await Promise.all([
            RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number], library),
            smartSwapLPTokenPoolOne(
              SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolTwo(
              SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
              library
            ),
            smartSwapLPTokenPoolThree(
              SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
              library
            ),
            RGPSpecialPool2(
              RGPSPECIALPOOLADDRESSES2[chainId as number],
              library
            ),
            productStakingContract(
              PRODUCTSTAKINGADDRESSES[chainId as number],
              library
            )
          ]);

        const [
          // rgpTotalStaking,
          pool1Reserve,
          pool2Reserve,
          pool3Reserve,
          rgpTotalStakingV2,
          farmProductTotalStaking
          // pool4Reserve,
          // pool5Reserve,
        ] = await Promise.all([
          // await specialPool.totalStaking(),
          pool1.getReserves(),
          pool2.getReserves(),
          pool3.getReserves(),
          await specialPool2.totalStaking(),
          farmProductContract.totalStaking()
          // pool4.getReserves(),
          // pool5.getReserves(),
        ]);
        const MRGPprice: number | any = ethers.utils.formatUnits(
          pool3Reserve[0].mul(1000).div(pool3Reserve[1]),
          3
        );

        const totalUSDT2: number | any = ethers.utils.formatUnits(
          pool2Reserve[1],
          6
        );
        const totalRGP2: number | any = ethers.utils.formatUnits(
          pool2Reserve[0],
          18
        );
        const totalRGP1: number | any = ethers.utils.formatUnits(
          pool1Reserve[1],
          18
        );
        const totalRGP3: number | any = ethers.utils.formatUnits(
          pool3Reserve[1],
          18
        );
        const rgpPrice = totalUSDT2 / totalRGP2;

        const RGP_USDTLiquidity = totalUSDT2 * 2;

        const RGP_WMATICLiquidity = Number(totalRGP1) * Number(rgpPrice) * 2;
        const USDC_RGPLiq = totalRGP3 * rgpPrice * 2;

        const productFarmLiquidity = ethers.utils
        .formatUnits(farmProductTotalStaking.mul(Math.floor(1000 * rgpPrice)), 21)
        .toString();
        console.log({productFarmLiquidity});

        const RGPLiquidityV2 =
          (ethers.utils.formatUnits(rgpTotalStakingV2, 18) * rgpPrice) / 2;

        dispatch(
          updateTotalLiquidity([
            {
              deposit: "RGP",
              liquidity: "0", // MRGPLiquidity,
              apy: "0", // calculateApy(MRGPprice, MRGPLiquidity, 250),
            },
            {
              deposit: await deposit(pool1.token0, pool1.token1),
              liquidity: RGP_WMATICLiquidity,
              apy: calculateApy(rgpPrice, RGP_WMATICLiquidity, 1500),
            },
            {
              deposit: await deposit(pool2.token0, pool2.token1),
              liquidity: RGP_USDTLiquidity,
              apy: calculateApy(rgpPrice, RGP_USDTLiquidity, 1050),
            },
            {
              deposit: "RGP-USDC", //await deposit(pool3.token0, pool3.token1),
              liquidity: USDC_RGPLiq,
              apy: calculateApy(rgpPrice, USDC_RGPLiq, 1050),
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: "RGP",
              liquidity: RGPLiquidityV2,
              apy: "8.756",
            },
          ])
        );
        dispatch(updateFarmProductLiquidity([
          {
            deposit:"RGP",
            liquidity:productFarmLiquidity
          }
        ]))
      } else if (Number(chainId) === Number(SupportedChainId.OASISTEST)) {
        const [pool1, pool2, pool3] = await Promise.all([
          // RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number]),
          smartSwapLPTokenPoolOne(
            SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolTwo(
            SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolThree(
            SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
            library
          ),
        ]);

        const [
          // rgpTotalStaking,
          pool1Reserve,
          pool2Reserve,
          pool3Reserve,
          // pool4Reserve,
          // pool5Reserve,
        ] = await Promise.all([
          // await specialPool.totalStaking(),
          pool1.getReserves(),
          pool2.getReserves(),
          pool3.getReserves(),
          // pool4.getReserves(),
          // pool5.getReserves(),
        ]);

        const totalUSDT2: number | any = ethers.utils.formatUnits(
          pool2Reserve[1],
          6
        );
        const totalRGP2: number | any = ethers.utils.formatUnits(
          pool2Reserve[0],
          18
        );
        const totalRGP1: number | any = ethers.utils.formatUnits(
          pool1Reserve[0],
          18
        );
        const totalUSDT3: number | any = ethers.utils.formatUnits(
          pool3Reserve[1],
          6
        );
        const rgpPrice = totalUSDT2 / totalRGP2;
        const RGP_USDTLiq = totalUSDT2 * 2;

        const RGP_WROSELiquidity = Number(totalRGP1) * Number(rgpPrice) * 2;
        const USDT_WROSELiquidity = totalUSDT3 * 2;

        dispatch(
          updateTotalLiquidity([
            {
              deposit: "RGP",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: await deposit(pool1.token0, pool1.token1),
              liquidity: RGP_WROSELiquidity,
              apy: calculateApy(rgpPrice, RGP_WROSELiquidity, 1200),
            },
            {
              deposit: await deposit(pool2.token0, pool2.token1),
              liquidity: RGP_USDTLiq,
              apy: calculateApy(rgpPrice, RGP_USDTLiq, 700),
            },
            {
              deposit: await deposit(pool3.token0, pool3.token1), //await deposit(pool3.token0, pool3.token1),
              liquidity: USDT_WROSELiquidity,
              apy: calculateApy(rgpPrice, USDT_WROSELiquidity, 100),
            },
          ])
        );
      } else if (Number(chainId) === Number(SupportedChainId.OASISMAINNET)) {
        const [pool1, pool2, pool3] = await Promise.all([
          // RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number]),
          smartSwapLPTokenPoolOne(
            SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolTwo(
            SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolThree(
            SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
            library
          ),
        ]);

        const [
          // rgpTotalStaking,
          pool1Reserve,
          pool2Reserve,
          pool3Reserve,
          // pool4Reserve,
          // pool5Reserve,
        ] = await Promise.all([
          // await specialPool.totalStaking(),
          pool1.getReserves(),
          pool2.getReserves(),
          pool3.getReserves(),
          // pool4.getReserves(),
          // pool5.getReserves(),
        ]);

        const totalUSDT2: number | any = ethers.utils.formatUnits(
          pool2Reserve[1],
          6
        );
        const totalRGP2: number | any = ethers.utils.formatUnits(
          pool2Reserve[0],
          18
        );
        const totalRGP1: number | any = ethers.utils.formatUnits(
          pool1Reserve[0],
          18
        );
        const totalUSDT3: number | any = ethers.utils.formatUnits(
          pool3Reserve[1],
          6
        );
        const rgpPrice = totalUSDT2 / totalRGP2;
        const RGP_USDTLiq = totalUSDT2 * 2;

        const RGP_WROSELiquidity = Number(totalRGP1) * Number(rgpPrice) * 2;
        const USDT_WROSELiquidity = totalUSDT3 * 2;

        dispatch(
          updateTotalLiquidity([
            {
              deposit: "RGP",
              liquidity: "0",
              apy: "0",
            },
            {
              deposit: await deposit(pool1.token0, pool1.token1),
              liquidity: RGP_WROSELiquidity,
              apy: calculateApy(rgpPrice, RGP_WROSELiquidity, 1200),
            },
            {
              deposit: await deposit(pool2.token0, pool2.token1),
              liquidity: RGP_USDTLiq,
              apy: calculateApy(rgpPrice, RGP_USDTLiq, 700),
            },
            {
              deposit: await deposit(pool3.token0, pool3.token1), //await deposit(pool3.token0, pool3.token1),
              liquidity: USDT_WROSELiquidity,
              apy: calculateApy(rgpPrice, USDT_WROSELiquidity, 100),
            },
          ])
        );
      } else {
        const [
          specialPool,
          pool1,
          pool2,
          pool3,
          pool4,
          pool5,
          pool6,
          pool7,
          pool8,
          pool9,
          pool12,
          pool13,
          specialPool2,
          farmProductContract
        ] = await Promise.all([
          RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number], library),
          smartSwapLPTokenPoolOne(
            SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolTwo(
            SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolThree(
            SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolFour(
            SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolFive(
            SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolSix(
            SMARTSWAPLP_TOKEN6ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolSeven(
            SMARTSWAPLP_TOKEN7ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolEight(
            SMARTSWAPLP_TOKEN8ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolNine(
            SMARTSWAPLP_TOKEN9ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolTwelve(
            SMARTSWAPLP_TOKEN12ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolThirteen(
            SMARTSWAPLP_TOKEN13ADDRESSES[chainId as number],
            library
          ),
          RGPSpecialPool2(RGPSPECIALPOOLADDRESSES2[chainId as number], library),
            productStakingContract(
              PRODUCTSTAKINGADDRESSES[chainId as number],
              library
            )
        ]);

        const [
          rgpTotalStaking,
          pool1Reserve,
          pool2Reserve,
          pool3Reserve,
          pool4Reserve,
          pool5Reserve,
          pool6Reserve,
          pool7Reserve,
          pool8Reserve,
          pool9Reserve,
          pool12Reserve,
          pool13Reserve,
          rgpTotalStakingV2,
          farmProductTotalStaking
        ] = await Promise.all([
          await specialPool.totalStaking(),
          pool1.getReserves(),
          pool2.getReserves(),
          pool3.getReserves(),
          pool4.getReserves(),
          pool5.getReserves(),
          pool6.getReserves(),
          pool7.getReserves(),
          pool8.getReserves(),
          pool9.getReserves(),
          pool12.getReserves(),
          pool13.getReserves(),
          await specialPool2.totalStaking(),
          farmProductContract.totalStaking()
        ]);
        const RGPprice: number | any = ethers.utils.formatUnits(
          pool1Reserve[0].mul(1000).div(pool1Reserve[1]),
          3
        );
        const BNBprice = getBnbPrice(pool3, pool3Reserve);
        const RGPLiquidity = ethers.utils
          .formatUnits(rgpTotalStaking.mul(Math.floor(1000 * RGPprice)), 21)
          .toString();
        const RGPLiquidityV2 = ethers.utils
          .formatUnits(rgpTotalStakingV2.mul(Math.floor(1000 * RGPprice)), 21)
          .toString();
          const productFarmLiquidity = ethers.utils
          .formatUnits(farmProductTotalStaking.mul(Math.floor(1000 * RGPprice)), 21)
          .toString();
          console.log({productFarmLiquidity});


        const BUSD_RGPLiquidity = ethers.utils
          .formatEther(pool1Reserve[0].mul(2))
          .toString();

        const RGP_BNBLiquidity = ethers.utils
          .formatUnits(pool2Reserve[0].mul(Math.floor(BNBprice * 1000 * 2)), 21)
          .toString();
        const BUSD_BNBLiquidity = getBusdBnbLiquidity(pool3, pool3Reserve);

        const AXS_BUSDLiquidity = getAXSBUSDLiquidity(pool5, pool5Reserve);
        const AXS_RGPLiquidity = ethers.utils
          .formatUnits(
            pool4Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();
        const PLACE_RGPLiquidity = ethers.utils
          .formatUnits(
            pool6Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        const MHT_RGPLiquidity = ethers.utils
          .formatUnits(
            pool7Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        const RGP_SHIBLiquidity = ethers.utils
          .formatUnits(
            pool8Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        const RGP_MBOXLiquidity = ethers.utils
          .formatUnits(
            pool9Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        const RGP_WARSLiquidity = ethers.utils
          .formatUnits(
            pool12Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        const RGP_METOLiquidity = ethers.utils
          .formatUnits(
            pool13Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)),
            21
          )
          .toString();

        dispatch(
          updateTotalLiquidity([
            {
              deposit: "RGP",
              liquidity: RGPLiquidity,
              apy: 8.756,
            },
            {
              deposit: "RGP-BNB",
              liquidity: RGP_BNBLiquidity,
              apy: calculateApy(RGPprice, RGP_BNBLiquidity, 515.3153153),
            },
            {
              deposit: "RGP-BUSD",
              liquidity: BUSD_RGPLiquidity,
              apy: calculateApy(RGPprice, BUSD_RGPLiquidity, 1803.603604),
            },
            {
              deposit: "BNB-BUSD",
              liquidity: BUSD_BNBLiquidity,
              apy: calculateApy(RGPprice, BUSD_BNBLiquidity, 257.6576577),
            },
            {
              deposit: "AXS-RGP",
              liquidity: AXS_RGPLiquidity,
              apy: calculateApy(RGPprice, AXS_RGPLiquidity, 386.4864865),
            },
            {
              deposit: "AXS-BUSD",
              liquidity: AXS_BUSDLiquidity,
              apy: calculateApy(RGPprice, AXS_BUSDLiquidity, 128.8288288),
            },
            {
              deposit: "PLACE-RGP",
              liquidity: PLACE_RGPLiquidity,
              apy: calculateApy(RGPprice, PLACE_RGPLiquidity, 257.6576577),
            },
            {
              deposit: "MHT-RGP",
              liquidity: MHT_RGPLiquidity,
              apy: calculateApy(RGPprice, MHT_RGPLiquidity, 257.6576577),
            },
            {
              deposit: "SHIB-RGP",
              liquidity: RGP_SHIBLiquidity,
              apy: calculateApy(RGPprice, RGP_SHIBLiquidity, 386.4864865),
            },
            {
              deposit: "MBOX-RGP",
              liquidity: RGP_MBOXLiquidity,
              apy: calculateApy(RGPprice, RGP_MBOXLiquidity, 257.6576577),
            },
            {
              deposit: "WARS-RGP",
              liquidity: RGP_WARSLiquidity,
              apy: calculateApy(RGPprice, RGP_WARSLiquidity, 257.6576577),
            },
            {
              deposit: "METO-RGP",
              liquidity: RGP_METOLiquidity,
              apy: calculateApy(RGPprice, RGP_METOLiquidity, 257.6576577),
            },

            {
              deposit: "RGP",
              liquidity: RGPLiquidityV2,
              apy: 8.756,
            },
          ])
        );
        dispatch(updateFarmProductLiquidity([
          {
            deposit:"RGP",
            liquidity:productFarmLiquidity
          }
        ]))
      }
    } catch (error) {
      console.log(error, "get farm data");
      setfarmDataLoading(false);
      //if (!toast.isActive(id)) {
      //  showErrorToast();
    }
    setfarmDataLoading(false);
  };

  const specialPoolStaked = async () => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool(
          RGPSPECIALPOOLADDRESSES[chainId as number],
          library
        );
        const RGPStakedEarned = await Promise.all([
          await specialPool.userData(account),
          await specialPool.calculateRewards(account),
        ]);
        return RGPStakedEarned;
      } catch (error) {
        return error;
      }
    }
  };

  const specialPoolStakedV2 = async () => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool2(
          RGPSPECIALPOOLADDRESSES2[chainId as number],
          library
        );
        const RGPStakedEarnedV2 = await Promise.all([
          await specialPool.userData(account),
          await specialPool.calculateRewards(account),
        ]);
        return RGPStakedEarnedV2;
      } catch (error) {
        return error;
      }
    }
  };
  const productFarmStaked = async () => {
    if (account) {
      try {
        const productFarm = await productStakingContract(
          PRODUCTSTAKINGADDRESSES[chainId as number],
          library
        );
        const productFarmStakedEarned =  await Promise.all([
          productFarm.userInfo(account),
          productFarm.userData(account),
        ]);
        return productFarmStakedEarned;
      } catch (error) {
        return error;
      }
    }
  };

  const getTokenStaked = async () => {
    try {
      if (
        (account && Number(chainId) === Number(SupportedChainId.POLYGON)) ||
        (account && Number(chainId) === Number(SupportedChainId.POLYGONTEST))
      ) {
        const masterChefV2 = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const [
          poolOneEarned,
          poolTwoEarned,
          poolThreeEarned,
          // poolFourEarned,
          // poolFiveEarned,
          poolOneStaked,
          poolTwoStaked,
          poolThreeStaked,
          // poolFourStaked,
          // poolFiveStaked,
        ] = await Promise.all([
          masterChefV2.pendingRigel(1, account),
          masterChefV2.pendingRigel(2, account),
          masterChefV2.pendingRigel(3, account),
          // masterChefV2.pendingRigel(4, account),
          // masterChefV2.pendingRigel(5, account),
          masterChefV2.userInfo(1, account),
          masterChefV2.userInfo(2, account),
          masterChefV2.userInfo(3, account),
          // masterChefV2.userInfo(4, account),
          // masterChefV2.userInfo(5, account),
        ]);

        const RGPStakedEarnedV2 = await specialPoolStakedV2();
       
        let RGPStakedV2;
        let RGPEarnedV2;

        if (RGPStakedEarnedV2) {
          const [specialPoolStakedV2, specialPoolEarnedV2] = RGPStakedEarnedV2;

          RGPStakedV2 = formatBigNumber(specialPoolStakedV2.tokenQuantity);
          RGPEarnedV2 = formatBigNumber(specialPoolEarnedV2);
        } else {
          RGPStakedV2 = 0;
          RGPEarnedV2 = 0;
        }

        dispatch(
          updateTokenStaked([
            { staked: 0, earned: 0, symbol: "RGP" },
            {
              staked: formatBigNumber(poolOneStaked.amount),
              earned: formatBigNumber(poolOneEarned),
            },
            {
              staked: formatBigNumber(poolTwoStaked.amount),
              earned: formatBigNumber(poolTwoEarned),
            },
            {
              staked: formatBigNumber(poolThreeStaked.amount),
              earned: formatBigNumber(poolThreeEarned),
            },
            { staked: 0, earned: 0 },
            { staked: 0, earned: 0 },
            { staked: 0, earned: 0 },
            { staked: 0, earned: 0 },
            { staked: 0, earned: 0 },
            { staked: 0, earned: 0 },
            { staked: RGPStakedV2, earned: RGPEarnedV2, symbol: "RGP" },
          ])
        );
        const productFarmStakedEarn = await productFarmStaked();
        let productStakedValue;
        if(productFarmStakedEarn){
          const [productStaked] = productFarmStakedEarn;
          productStakedValue = formatBigNumber(productStaked.tokenQuantity)

        }
        dispatch(
          updateProductStaked([{staked:productStakedValue}])
        );
       

        setInitialLoad(false);
      } else if (
        account &&
        Number(chainId) === Number(SupportedChainId.OASISTEST)
      ) {
        const masterChefV2 = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const [
          poolOneEarned,
          poolTwoEarned,
          poolThreeEarned,
          // poolFourEarned,
          // poolFiveEarned,
          poolOneStaked,
          poolTwoStaked,
          poolThreeStaked,
          // poolFourStaked,
          // poolFiveStaked,
        ] = await Promise.all([
          masterChefV2.pendingRigel(1, account),
          masterChefV2.pendingRigel(2, account),
          masterChefV2.pendingRigel(3, account),
          // masterChefV2.pendingRigel(4, account),
          // masterChefV2.pendingRigel(5, account),
          masterChefV2.userInfo(1, account),
          masterChefV2.userInfo(2, account),
          masterChefV2.userInfo(3, account),
          // masterChefV2.userInfo(4, account),
          // masterChefV2.userInfo(5, account),
        ]);

        dispatch(
          updateTokenStaked([
            { staked: 0, earned: 0 },
            {
              staked: formatBigNumber(poolOneStaked.amount),
              earned: formatBigNumber(poolOneEarned),
            },
            {
              staked: formatBigNumber(poolTwoStaked.amount),
              earned: formatBigNumber(poolTwoEarned),
            },
            {
              staked: formatBigNumber(poolThreeStaked.amount),
              earned: formatBigNumber(poolThreeEarned),
            },
          ])
        );

        setInitialLoad(false);
      } else if (
        account &&
        Number(chainId) === Number(SupportedChainId.OASISMAINNET)
      ) {
        const masterChefV2 = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const [
          poolOneEarned,
          poolTwoEarned,
          poolThreeEarned,
          // poolFourEarned,
          // poolFiveEarned,
          poolOneStaked,
          poolTwoStaked,
          poolThreeStaked,
          // poolFourStaked,
          // poolFiveStaked,
        ] = await Promise.all([
          masterChefV2.pendingRigel(1, account),
          masterChefV2.pendingRigel(2, account),
          masterChefV2.pendingRigel(3, account),
          // masterChefV2.pendingRigel(4, account),
          // masterChefV2.pendingRigel(5, account),
          masterChefV2.userInfo(1, account),
          masterChefV2.userInfo(2, account),
          masterChefV2.userInfo(3, account),
          // masterChefV2.userInfo(4, account),
          // masterChefV2.userInfo(5, account),
        ]);

        dispatch(
          updateTokenStaked([
            { staked: 0, earned: 0 },
            {
              staked: formatBigNumber(poolOneStaked.amount),
              earned: formatBigNumber(poolOneEarned),
            },
            {
              staked: formatBigNumber(poolTwoStaked.amount),
              earned: formatBigNumber(poolTwoEarned),
            },
            {
              staked: formatBigNumber(poolThreeStaked.amount),
              earned: formatBigNumber(poolThreeEarned),
            },
          ])
        );

        setInitialLoad(false);
      } else if (
        account &&
        Number(chainId) !== Number(SupportedChainId.POLYGON)
      ) {
        const masterChefV2 = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const [
          poolOneEarned,
          poolTwoEarned,
          poolThreeEarned,
          poolFourEarned,
          poolFiveEarned,
          poolSixEarned,
          poolSevenEarned,
          poolEightEarned,
          poolNineEarned,
          poolTwelveEarned,
          poolThirteenEarned,
          poolOneStaked,
          poolTwoStaked,
          poolThreeStaked,
          poolFourStaked,
          poolFiveStaked,
          poolSixStaked,
          poolSevenStaked,
          poolEightStaked,
          poolNineStaked,
          poolTwelveStaked,
          poolThirteenStaked,
        ] = await Promise.all([
          masterChefV2.pendingRigel(1, account),
          masterChefV2.pendingRigel(2, account),
          masterChefV2.pendingRigel(3, account),
          masterChefV2.pendingRigel(4, account),
          masterChefV2.pendingRigel(5, account),
          masterChefV2.pendingRigel(6, account),
          masterChefV2.pendingRigel(7, account),
          masterChefV2.pendingRigel(8, account),
          masterChefV2.pendingRigel(9, account),
          masterChefV2.pendingRigel(12, account),
          masterChefV2.pendingRigel(13, account),
          masterChefV2.userInfo(1, account),
          masterChefV2.userInfo(2, account),
          masterChefV2.userInfo(3, account),
          masterChefV2.userInfo(4, account),
          masterChefV2.userInfo(5, account),
          masterChefV2.userInfo(6, account),
          masterChefV2.userInfo(7, account),
          masterChefV2.userInfo(8, account),
          masterChefV2.userInfo(9, account),
          masterChefV2.userInfo(12, account),
          masterChefV2.userInfo(13, account),
        ]);

        const RGPStakedEarned = await specialPoolStaked();
        const RGPStakedEarnedV2 = await specialPoolStakedV2();

        let RGPStaked;
        let RGPEarned;

        let RGPStakedV2;
        let RGPEarnedV2;
        const productFarmStakedEarn = await productFarmStaked();
        let productStakedValue;
        if(productFarmStakedEarn){
          const [productStaked,productEarned] = productFarmStakedEarn;
          productStakedValue = formatBigNumber(productStaked.tokenQuantity)

        }
        dispatch(
          updateProductStaked([{staked:productStakedValue}])
        );
        if (RGPStakedEarned) {
          const [specialPoolStaked, specialPoolEarned] = RGPStakedEarned;

          RGPStaked = formatBigNumber(specialPoolStaked.tokenQuantity);
          RGPEarned = formatBigNumber(specialPoolEarned);
        } else {
          RGPStaked = 0;
          RGPEarned = 0;
        }

        if (RGPStakedEarnedV2) {
          const [specialPoolStakedV2, specialPoolEarnedV2] = RGPStakedEarnedV2;

          RGPStakedV2 = formatBigNumber(specialPoolStakedV2.tokenQuantity);
          RGPEarnedV2 = formatBigNumber(specialPoolEarnedV2);
        } else {
          RGPStakedV2 = 0;
          RGPEarnedV2 = 0;
        }

        dispatch(
          updateTokenStaked([
            { staked: RGPStaked, earned: RGPEarned, symbol: "RGP" },
            {
              staked: formatBigNumber(poolTwoStaked.amount),
              earned: formatBigNumber(poolTwoEarned),
            },
            {
              staked: formatBigNumber(poolOneStaked.amount),
              earned: formatBigNumber(poolOneEarned),
            },
            {
              staked: formatBigNumber(poolThreeStaked.amount),
              earned: formatBigNumber(poolThreeEarned),
            },
            {
              staked: formatBigNumber(poolFourStaked.amount),
              earned: formatBigNumber(poolFourEarned),
            },
            {
              staked: formatBigNumber(poolFiveStaked.amount),
              earned: formatBigNumber(poolFiveEarned),
            },
            {
              staked: formatBigNumber(poolSixStaked.amount),
              earned: formatBigNumber(poolSixEarned),
            },
            {
              staked: formatBigNumber(poolSevenStaked.amount),
              earned: formatBigNumber(poolSevenEarned),
            },
            {
              staked: formatBigNumber(poolEightStaked.amount),
              earned: formatBigNumber(poolEightEarned),
            },
            {
              staked: formatBigNumber(poolNineStaked.amount),
              earned: formatBigNumber(poolNineEarned),
            },
            {
              staked: formatBigNumber(poolTwelveStaked.amount),
              earned: formatBigNumber(poolTwelveEarned),
            },
            {
              staked: formatBigNumber(poolThirteenStaked.amount),
              earned: formatBigNumber(poolThirteenEarned),
            },
            { staked: RGPStakedV2, earned: RGPEarnedV2, symbol: "RGP" },
          ])
        );

        setInitialLoad(false);
      }
    } catch (error) {
      if (error.code == -32603) {
        dispatch(
          setOpenModal({
            message: `RPC URL Error. Failed to load accurate data.`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
      console.error(error, "getTokenStaked =>Farming v2");
    }
  };

  const calculateApy = (rgpPrice: any, totalLiquidity: any, inflation: any) =>
    (rgpPrice * inflation * 365 * 100) / totalLiquidity;

  const getBusdBnbLiquidity = (pool3: any, pool3Reserve: any) => {
    const pool3Testnet = "0x120f3E6908899Af930715ee598BE013016cde8A5";
    let BUSD_BNBLiquidity;
    if (pool3 && pool3.address === pool3Testnet) {
      BUSD_BNBLiquidity = ethers.utils
        .formatEther(pool3Reserve[0].mul(2))
        .toString();
    } else {
      BUSD_BNBLiquidity = ethers.utils
        .formatEther(pool3Reserve[1].mul(2))
        .toString();
    }
    return BUSD_BNBLiquidity;
  };

  const getBnbPrice = (pool3: any, pool3Reserve: any): number => {
    const pool3testnet = "0x120f3E6908899Af930715ee598BE013016cde8A5";
    let BNBprice;
    if (pool3 && pool3.address === pool3testnet) {
      BNBprice = ethers.utils.formatUnits(
        pool3Reserve[0].mul(1000).div(pool3Reserve[1]),
        3
      );
    } else {
      BNBprice = ethers.utils.formatUnits(
        pool3Reserve[1].mul(1000).div(pool3Reserve[0]),
        3
      );
    }
    return Number(BNBprice);
  };

  const getAXSBUSDLiquidity = (pool5: any, pool5Reserve: any) => {
    const pool5Testnet = "0x816b823d9C7F30327B2c626DEe4aD731Dc9D3641";
    let AXS_BUSDLiquidity;
    // BUSD is token0 on testnet but token1 on mainnet, thus the reason to check
    // before calculating the liquidity based on BUSD
    if (pool5 && pool5.address === pool5Testnet) {
      AXS_BUSDLiquidity = ethers.utils
        .formatEther(pool5Reserve[0].mul(2))
        .toString();
    } else {
      AXS_BUSDLiquidity = ethers.utils
        .formatEther(pool5Reserve[1].mul(2))
        .toString();
    }
    return AXS_BUSDLiquidity;
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

      {!showAlert || tabIndex === 0  ? null : (tabIndex === 1 &&
        stakingIndex === 1) ||tabIndex ===2 ? (
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
      ) : null
      //     (
      //   <Box mx={[5, 10, 15, 20]} my={4}>
      //     <Alert
      //       color='#FFFFFF'
      //       background={mode === DARK_THEME ? "#319EF6" : "#319EF6"}
      //       borderRadius='8px'
      //     >
      //       <AlertSvg />
      //       <AlertDescription
      //         fontFamily='Inter'
      //         fontSize={{ base: "16px", md: "18px", lg: "20px" }}
      //         fontWeight='500'
      //         lineHeight='24px'
      //         letterSpacing='0em'
      //         textAlign='left'
      //         padding='10px'
      //       >
      //         {`This is the V2 Farm. You should migrate your stakings from V1 Farm.`}
      //       </AlertDescription>
      //
      //       <CloseButton
      //         position='absolute'
      //         margin='2px'
      //         height='14px'
      //         width='14px'
      //         background='#319EF6'
      //         color='#fff'
      //         right='20px'
      //         textAign='center'
      //         onClick={handleAlert}
      //       />
      //     </Alert>
      //   </Box>
      // )
      }

      <Flex
        display={isMobileDevice ? undefined : "none"}
        justifyContent='flex-end'
      >
        <Link
          href='https://docs.google.com/forms/d/e/1FAIpQLSdJGAuABrJd6d0WSprUWB140we9hGqa-IwIbonx9ZJhxN2zsg/viewform'
          position={{ base: "relative", md: "absolute" }}
          isExternal
        >
          <Button
            background='#4CAFFF'
            boxShadow='0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)'
            borderRadius='6px'
            mx={[5, 10, 15, 20]}
            padding=' 12px 32px'
            mt={3}
            variant='brand'
            className={"list"}
            onClick={()=>GFarmingClickListYourProject()}
          >
            List your project
          </Button>
        </Link>
      </Flex>

      <Tabs
        defaultIndex={match ? STAKING_INDEX : LIQUIDITY_INDEX}
        index={tabIndex}
        onChange={handleTabsChange}
        // isManual
        variant='enclosed'
        mx={[5, 10, 15, 20]}
        my={4}
        isFitted={isMobileDevice ? true : false}
      >
        <Flex justifyContent='space-between' mt={10}>
          <TabList h={isMobileDevice ? undefined : 14} borderBottom={0} width={'100%'}>
            <Tab
              display='flex'
              flex-direction='row'
              justify-content='center'
              align-items='center'
              flexWrap={isMobileDevice ? "wrap" : undefined}
              padding={isMobileDevice ? "2px 4px" : undefined}
              border='1px solid #DEE5ED'
              background={selected === farmSection.LIQUIDITY ? useSelectedBackgroundColor : useNotSelectedBackgroundColor}
              color={useSelectedColor}
              value={farmSection.LIQUIDITY}
              fontSize={isMobileDevice ? '12px' : '14px'}
              onClick={() => handleSelect(farmSection.LIQUIDITY)}
              borderRadius={isMobileDevice ? "10px 0px 0px 10px" : 0}
            >
              <Text className={"liquidity"} color={titleColor}>
                Liquidity Pools
              </Text>
              {Number(chainId) === Number(SupportedChainId.POLYGON) ||
              Number(chainId) === Number(SupportedChainId.POLYGONTEST) ||
              Number(chainId) ===
                Number(SupportedChainId.OASISMAINNET) ? null : (
                <Select
                  size={isMobileDevice ? undefined : "sm"}
                  // borderColor={
                  //   mode === LIGHT_THEME && selected === LIQUIDITY
                  //     ? "#0760A8 !important"
                  //     : mode === DARK_THEME && selected === LIQUIDITY
                  //     ? "#008DFF !important"
                  //     : mode === DARK_THEME && selected === STAKING
                  //     ? "#324D68 !important"
                  //     : mode === LIGHT_THEME && selected === STAKING
                  //     ? "#0760A8 !important"
                  //     : "#F2F5F8 !important"
                  // }
                  borderColor={selected === farmSection.LIQUIDITY ? useNotSelectedBorderColor : useSelectedBorderColor}
                  color={selected === farmSection.LIQUIDITY ? useNotSelectedTextColor : useSelectedTextColor}
                  // color={
                  //   mode === LIGHT_THEME && selected === LIQUIDITY
                  //     ? "#0760A8"
                  //     : mode === DARK_THEME && selected === LIQUIDITY
                  //     ? "#008DFF"
                  //     : mode === DARK_THEME && selected === STAKING
                  //     ? "#F1F5F8"
                  //     : mode === LIGHT_THEME && selected === STAKING
                  //     ? "#0760A8"
                  //     : "#333333"
                  // }
                  onChange={handleLiquidityTab}
                  background={mode === LIGHT_THEME ? "#f7f7f8" : "#15202B"}
                  cursor='pointer'
                  border=' 1px solid #008DFF'
                  box-sizing='border-box'
                  borderRadius='50px'
                  width={isMobileDevice ? undefined : "fit-content"}
                  flex='none'
                  order='1'
                  onClick={(e) => e.stopPropagation()}
                  flex-grow='0'
                  margin={isMobileDevice ? "5px 12px" : '10px 16px'}
                >
                  <option value={0}>V2</option>
                  <option value={2}>V1</option>
                </Select>
              )}
            </Tab>
            <Tab
              display='flex'
              flex-direction='row'
              justify-content='center'
              align-items='center'
              flexWrap={isMobileDevice ? "wrap" : undefined}
              padding={isMobileDevice ? "4px 12px" : undefined}
              border='1px solid #DEE5ED'
              borderRadius={0}
              // border={`1px solid ${borderColor}`}
              background={selected === farmSection.STAKING ? useSelectedBackgroundColor : useNotSelectedBackgroundColor}
              color={useSelectedColor}
              fontSize={isMobileDevice ? '12px' : '14px'}
              // px={5}
              // py={4}
              // minWidth={{ base: "none", md: "200px", lg: "200px" }}

              onClick={() => {
                handleSelect(farmSection.STAKING);
              }}
            >
              <Text className={"staking"} color={titleColor}>
                Staking
              </Text>
              {Number(chainId) === Number(SupportedChainId.POLYGON) ||
              Number(chainId) === Number(SupportedChainId.POLYGONTEST) ||
              Number(chainId) ===
                Number(SupportedChainId.OASISMAINNET) ? null : (
                <Select
                  size={isMobileDevice ? undefined : "sm"}
                  borderColor={selected === farmSection.LIQUIDITY ? useNotSelectedBorderColor : useSelectedBorderColor}
                  color={selected === farmSection.LIQUIDITY ? useNotSelectedTextColor : useSelectedTextColor}
                  onChange={handleStakingTab}
                  background={mode === LIGHT_THEME ? "#f7f7f8" : "#15202B"}
                  onClick={(e) => e.stopPropagation()}
                  border=' 1px solid #008DFF'
                  box-sizing='border-box'
                  borderRadius='50px'
                  /* Inside auto layout */
                  width={isMobileDevice ? undefined : "fit-content"}
                  flex='none'
                  order='1'
                  flex-grow='0'
                  margin={isMobileDevice ? "5px 12px" : '10px 16px'}
                >
                  <option value={1}>V2</option>
                  <option value={3}>V1</option>
                </Select>
              )}
            </Tab>
           {Number(chainId) === Number(SupportedChainId.OASISTEST)  ||
              Number(chainId) ===
                Number(SupportedChainId.OASISMAINNET) ? null : (
                    <Tab
                      border='1px solid #DEE5ED'
                      borderRadius={0}
                      background={selected === farmSection.PRODUCT_FARM ? useSelectedBackgroundColor : useNotSelectedBackgroundColor}
                      color={useSelectedColor}
                      // px={5}
                      // py={4}
                      // minWidth={{ base: "none", md: "200px", lg: "200px" }}
                      onClick={() => handleSelect(farmSection.PRODUCT_FARM)}
                     >
              <Menu>
                  <MenuButton
                    // mr={1}
                    variant="ghost"
                    fontSize={isMobileDevice ? '12px' : '14px'}
                    as={Button}
                    whiteSpace={'wrap'}
                    transition="all 0.2s"
                    borderRadius="md"
                    _hover={{ bg: "none" }}
                    _focus={{ boxShadow: "none" }}
                    rightIcon={!isMobileDevice && <ChevronDownIcon />}
                  >
                    Product Farm
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <Stack direction={'column'} spacing={0} >
                        <Text my={2}>Product Farm</Text>
                      </Stack>

                    </MenuItem>
                    <MenuItem disabled={true} cursor="not-allowed">
                      <Tooltip label="launching soon">
                         <Stack direction={'column'} spacing={0} >
                          <Text my={2} color={placeholderTextColor}>Other Farm</Text>
                        </Stack>
                      </Tooltip>

                    </MenuItem>
                  </MenuList>
         </Menu>
            </Tab>)
            }

            {
              isMobileDevice ? (
                  <Tab
                      border='1px solid #DEE5ED'
                      background={selected === farmSection.NEW_LP || selected === farmSection.SECOND_NEW_LP ?
                          useSelectedBackgroundColor : useNotSelectedBackgroundColor}
                      color={useSelectedColor}
                      display='flex'
                      flex-direction='row'
                      justify-content='center'
                      align-items='center'
                      flexWrap={"wrap"}
                      padding={"2px 4px"}
                      fontSize={'12px'}
                      borderRadius={"0px 10px 0px 0px"}
                  >
                    <Menu>
                      <MenuButton
                          variant="ghost"
                          fontSize={'14px'}
                          as={Button}
                          transition="all 0.2s"
                          borderRadius="md"
                          _hover={{ bg: "none" }}
                          _focus={{ boxShadow: "none" }}
                      >

                        <HamburgerIcon w={6} h={6} color={titleColor}/>
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleSelect(farmSection.NEW_LP)}>
                          <Stack direction={'column'} spacing={0}>
                            <Text my={2}>{
                              Number(chainId) === Number(SupportedChainId.POLYGONTEST) ||  Number(chainId) === Number(SupportedChainId.POLYGON) ?
                                  'QuickSwap' : 'Pancake LP Farm'
                            }</Text>
                          </Stack>
                        </MenuItem>

                        {
                          Number(chainId) === Number(SupportedChainId.POLYGONTEST) ||  Number(chainId) === Number(SupportedChainId.POLYGON) ? (
                              <MenuItem onClick={() => handleSelect(farmSection.SECOND_NEW_LP)}>
                                <Stack direction={'column'} spacing={0}>
                                  <Text my={2}>Uniswap</Text>
                                </Stack>
                              </MenuItem>
                          ) : null
                        }
                      </MenuList>
                    </Menu>
                {/*<HamburgerIcon w={'80%'} h={'80%'} color={titleColor} onClick={() => setShowDropDown(!showDropDown)}/>*/}
              </Tab>
              ) : (
                    Number(chainId) === Number(SupportedChainId.POLYGONTEST) ||  Number(chainId) === Number(SupportedChainId.POLYGON) ? (
                      <Tab
                          border='1px solid #DEE5ED'
                          background={selected === farmSection.NEW_LP || selected === farmSection.SECOND_NEW_LP ?
                              useSelectedBackgroundColor : useNotSelectedBackgroundColor}
                          color={useSelectedColor}
                          onClick={() => handleSelect(farmSection.NEW_LP)}
                          display='flex'
                          flex-direction='row'
                          justify-content='center'
                          align-items='center'
                          flexWrap={isMobileDevice ? "wrap" : undefined}
                          padding={isMobileDevice ? "2px 4px" : undefined}
                          value={farmSection.LIQUIDITY}
                          fontSize={isMobileDevice ? '12px' : '14px'}
                          borderRadius={isMobileDevice ? "0px 10px 10px 0px" : 0}
                      >
                        <Text color={titleColor}>New Farms</Text>
                        <Select
                            size={isMobileDevice ? undefined : "sm"}
                            borderColor={selected === farmSection.NEW_LP ? useNotSelectedBorderColor : useSelectedBorderColor}
                            color={selected === farmSection.NEW_LP ? useNotSelectedTextColor : useSelectedTextColor}
                            onChange={handleNewFarmTab}
                            background={mode === LIGHT_THEME ? "#f7f7f8" : "#15202B"}
                            onClick={(e) => e.stopPropagation()}
                            border=' 1px solid #008DFF'
                            box-sizing='border-box'
                            borderRadius='50px'
                            /* Inside auto layout */
                            width={isMobileDevice ? undefined : "fit-content"}
                            flex='none'
                            order='1'
                            flex-grow='0'
                            margin='10px 16px'
                        >
                          <option value={5}>QuickSwap</option>
                          <option value={6}>UniSwap</option>
                        </Select>
                      </Tab>
                  ) : (
                      <Tab
                          display='flex'
                          flex-direction='row'
                          justify-content='center'
                          align-items='center'
                          flexWrap={isMobileDevice ? "wrap" : undefined}
                          padding={isMobileDevice ? "2px 4px" : undefined}
                          border='1px solid #DEE5ED'
                          background={selected === farmSection.NEW_LP ? useSelectedBackgroundColor : useNotSelectedBackgroundColor}
                          color={useSelectedColor}
                          value={farmSection.NEW_LP}
                          fontSize={isMobileDevice ? '12px' : '14px'}
                          onClick={() => handleSelect(farmSection.NEW_LP)}
                          borderRadius={isMobileDevice ? "0px 10px 10px 0px" : 0}
                      >
                        <Text className={"liquidity"} color={titleColor}>Pancake LP Farm</Text>
                      </Tab>
                  ))
            }

          </TabList>
          {/* <Divider display={isMobileDevice ? undefined : "none"} my='4' /> */}
          <Flex
            ml={5}
            display={isMobileDevice ? "none" : undefined}
            justifyContent='space-between'
            width={'60%'}
          >
            <Filter
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
            />

            <InputGroup w='40%' mx={'10px'}>
              <InputLeftAddon
                bgColor='transparent'
                borderColor={filterBorderColor}
                // border={0}
                w='2%'
                children={<SearchIcon mr={4} />}
              />
              <Input
                textAlign='left'
                fontSize='14px'
                placeholder='Search for farms'
                _placeholder={{ color: placeholderTextColor }}
                value={keyword}
                onChange={(e) => {
                  GFarmingInputSearchFarm(true);
                  const formattedValue = e.target.value.toUpperCase();
                  setKeyword(formattedValue);
                }}
                borderLeft={0}
                borderColor={filterBorderColor}
                _focus={{ borderColor: "none" }}
              />
            </InputGroup>
            <Link
              href='https://docs.google.com/forms/d/e/1FAIpQLSdJGAuABrJd6d0WSprUWB140we9hGqa-IwIbonx9ZJhxN2zsg/viewform'
              // position={{ base: "relative", md: "absolute" }}

              _hover={{ textDecoration: "none" }}
              _active={{ textDecoration: "none" }}
              isExternal
            >
              <Button
                background='#4CAFFF'
                boxShadow='0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)'
                borderRadius='6px'
                // mx={[5, 10, 15, 20]}
                padding=' 12px 32px'
                // mt={3}
                variant='brand'
                display={isMobileDevice ? "none" : undefined}
                className={"list"}
              >
                List your project
              </Button>
            </Link>
          </Flex>
        </Flex>

        <TabPanels padding='0px'>
          <TabPanel padding='0px'>
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
                    : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                    ? "#15202B !important"
                    : mode === DARK_THEME && selected === farmSection.STAKING
                    ? "#15202B !important"
                    : mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
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
                      mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                        ? "#F2F5F8  !important"
                        : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                        ? "#213345"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                        ? "#213345"
                        : mode === LIGHT_THEME && selected === farmSection.STAKING
                        ? "#F2F5F8"
                        : "#F2F5F8 !important"
                    }
                    color={
                      mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                        ? "#333333"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                        ? "#F1F5F8"
                        : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                        ? "#F1F5F8"
                        : mode === LIGHT_THEME && selected === farmSection.STAKING
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
                    <Text />
                  </Flex>

                  {!account ? null : ChainId !== chainId ? (
                    <Stack mt={2}>
                       {new Array(5).fill("1").map((item,index)=>{
                           return (
                             <Box
                        p={isMobileDevice ? "3" : "6"}
                        h={isMobileDevice ? undefined : 20}
                        border='1px'
                        borderColor={filterBorderColor}
                      >
                        <Flex
                          flexDirection={isMobileDevice ? "column" : "row"}
                          justifyContent={
                            isMobileDevice ? "center" : "space-between"
                          }
                          alignItems={isMobileDevice ? "center" : undefined}
                        >
                         {new Array(5).fill("1").map((item,index)=>{
                           return (
                            <Flex
                            ml={isMobileDevice ? undefined : 2}
                            mt={isMobileDevice ? 2 : undefined}
                            flexDirection='column'
                          >
                            <Skeleton
                            background="red.300"
                              height='20px'
                              w={isMobileDevice ? "320px" : "208px"}
                            />
                          </Flex>
 
                           )
                         })}
                        </Flex>
                      </Box>
    )
                         })}
                     
                     
                    </Stack>
                  ) : // </Stack>
                  keyword &&
                    searchResults.searchResult === undefined ? null : keyword &&
                    searchResults.searchResult !== undefined ? (
                    searchSection.newSearchResult === undefined ? (
                      searchResults.searchResult.map(
                        (content: any, index: number) => (
                          <YieldFarm
                            farmDataLoading={farmDataLoading}
                            content2={content}
                            key={content?.id}
                            section={"search"}
                            wallet={wallet}
                            LoadingState={loadingState}
                          />
                        )
                      )
                    ) : (
                      searchSection.newSearchResult.map(
                        (content: any, index: number) => (
                          <YieldFarm
                            farmDataLoading={farmDataLoading}
                            content2={content}
                            key={content?.id}
                            section={"search"}
                            wallet={wallet}
                            LoadingState={loadingState}
                          />
                        )
                      )
                    )
                  ) : searchResults.filterResult !== undefined ? (
                    searchSection.newFilterResult === undefined ? (
                      searchResults.filterResult.map(
                        (content: any, index: number) => (
                          <YieldFarm
                            farmDataLoading={farmDataLoading}
                            content2={content}
                            section={"filter"}
                            key={content?.id}
                            wallet={wallet}
                            LoadingState={loadingState}
                          />
                        )
                      )
                    ) : (
                      searchSection.newFilterResult.map(
                        (content: any, index: number) => (
                          <YieldFarm
                            farmDataLoading={farmDataLoading}
                            content2={content}
                            key={content?.id}
                            section={"filter"}
                            wallet={wallet}
                            LoadingState={loadingState}
                          />
                        )
                      )
                    )
                  ) : searchResults.filterResult === undefined ? (
                    farms === undefined ? (
                      data.contents?.map((content: any, index: number) => (
                        <YieldFarm
                          farmDataLoading={farmDataLoading}
                          content2={content}
                          key={content?.id}
                          section={"normal"}
                          wallet={wallet}
                          LoadingState={loadingState}
                        />
                      ))
                    ) : (
                      farms.map((content: any, index: number) => (
                        <YieldFarm
                          farmDataLoading={farmDataLoading}
                          content2={content}
                          key={content?.id}
                          section={"normal"}
                          wallet={wallet}
                          LoadingState={loadingState}
                        />
                      ))
                    )
                  ) : null}
                </Box>
              </Box>
            </Flex>
          </TabPanel>

          <TabPanel padding='0px'>
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
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
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
                    display={{ base: "none", md: "flex", lg: "flex" }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>
                  {FarmData.contents.map((content: any, index: number) =>
                    content.id === "13" ? (
                      <YieldFarm
                        farmDataLoading={farmDataLoading}
                        content={content}
                        key={content.pid}
                        wallet={wallet}
                        URLReferrerAddress={refAddress}
                      />
                    ) : null
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>

          <TabPanel padding='0px'>
           
            {/* <Flex
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
                    : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                    ? "#15202B !important"
                    : mode === DARK_THEME && selected === farmSection.STAKING
                    ? "#15202B !important"
                    : mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
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
                      mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                        ? "#F2F5F8  !important"
                        : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                        ? "#213345"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                        ? "#213345"
                        : mode === LIGHT_THEME && selected === farmSection.STAKING
                        ? "#F2F5F8"
                        : "#F2F5F8 !important"
                    }
                    color={
                      mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                        ? "#333333"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                        ? "#F1F5F8"
                        : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                        ? "#F1F5F8"
                        : mode === LIGHT_THEME && selected === farmSection.STAKING
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
                      Please Migrate your LP token farming from farming V1 to
                      this V2
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
            </Flex> */}
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
                    // alignItems='center'
                    // justifyContent='space-between'
                    templateColumns={["repeat(1,1fr)","repeat(1,1fr)","repeat(6,1fr)"]}
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
                    display={isMobileDevice ? "none" :"grid"}
                  >
                     <Text fontSize="14px">{selected ===farmSection.PRODUCT_FARM ? "Auto-Period Product" : "Deposit"}</Text>
                    <Text ml={4} fontSize="14px">{selected ===farmSection.PRODUCT_FARM ? "Percentage Profit Share" : "Earn"}</Text>
                    <Text ml={4} fontSize="14px">{selected ===farmSection.PRODUCT_FARM ? "Profit Timeline" : "APY"}</Text>
                    <Text ml={4} fontSize="14px">Total Liquidity</Text>
                    {selected ===farmSection.PRODUCT_FARM && <Text ml={4} fontSize="14px">Estimated Total Profits</Text>}
                    <Text />
                  </Grid>
                  {FarmData.productFarm.map((content: any, index: number) =>
                    index === 0 ? (
                      <ProductFarm
                        farmDataLoading={farmDataLoading}
                        content={content}
                        key={content.pid}
                        wallet={wallet}
                        URLReferrerAddress={refAddress}
                      />
                    ) : null
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>


          <TabPanel padding='0px'>
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
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
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
                    display={{ base: "none", md: "flex", lg: "flex" }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>
                  {FarmData.contents.map((content: any, index: number) =>
                    index === 0 ? (
                      <YieldFarm
                        farmDataLoading={farmDataLoading}
                        content={content}
                        key={content.pid}
                        wallet={wallet}
                      />
                    ) : null
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>

                      {/* special */}
                      <TabPanel padding='0px'>
           
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
                   : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                   ? "#15202B !important"
                   : mode === DARK_THEME && selected === farmSection.STAKING
                   ? "#15202B !important"
                   : mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
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
                     mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                       ? "#F2F5F8  !important"
                       : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                       ? "#213345"
                       : mode === DARK_THEME && selected === farmSection.STAKING
                       ? "#213345"
                       : mode === LIGHT_THEME && selected === farmSection.STAKING
                       ? "#F2F5F8"
                       : "#F2F5F8 !important"
                   }
                   color={
                     mode === LIGHT_THEME && selected === farmSection.LIQUIDITY
                       ? "#333333"
                       : mode === DARK_THEME && selected === farmSection.STAKING
                       ? "#F1F5F8"
                       : mode === DARK_THEME && selected === farmSection.LIQUIDITY
                       ? "#F1F5F8"
                       : mode === LIGHT_THEME && selected === farmSection.STAKING
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
                     Please Migrate your LP token farming from farming V1 to
                     this V2
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

          <TabPanel padding='0px'>
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
                        : mode === DARK_THEME && selected === farmSection.NEW_LP
                        ? "#15202B !important"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                            ? "#15202B !important"
                            : mode === LIGHT_THEME && selected === farmSection.NEW_LP
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
                        mode === LIGHT_THEME && selected === farmSection.NEW_LP
                            ? "#F2F5F8  !important"
                            : mode === DARK_THEME && selected === farmSection.NEW_LP
                            ? "#213345"
                            : mode === DARK_THEME && selected === farmSection.STAKING
                                ? "#213345"
                                : mode === LIGHT_THEME && selected === farmSection.STAKING
                                    ? "#F2F5F8"
                                    : "#F2F5F8 !important"
                      }
                      color={
                        mode === LIGHT_THEME && selected === farmSection.NEW_LP
                            ? "#333333"
                            : mode === DARK_THEME && selected === farmSection.STAKING
                            ? "#F1F5F8"
                            : mode === DARK_THEME && selected === farmSection.NEW_LP
                                ? "#F1F5F8"
                                : mode === LIGHT_THEME && selected === farmSection.STAKING
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
                    <Text/>
                  </Flex>

                  {!account ? null : ChainId !== chainId ? (
                          <Stack mt={2}>
                            {new Array(5).fill("1").map((item,index)=>{
                              return (
                                  <Box
                                      p={isMobileDevice ? "3" : "6"}
                                      h={isMobileDevice ? undefined : 20}
                                      border='1px'
                                      borderColor={filterBorderColor}
                                  >
                                    <Flex
                                        flexDirection={isMobileDevice ? "column" : "row"}
                                        justifyContent={
                                          isMobileDevice ? "center" : "space-between"
                                        }
                                        alignItems={isMobileDevice ? "center" : undefined}
                                    >
                                      {new Array(5).fill("1").map((item,index)=>{
                                        return (
                                            <Flex
                                                ml={isMobileDevice ? undefined : 2}
                                                mt={isMobileDevice ? 2 : undefined}
                                                flexDirection='column'
                                            >
                                              <Skeleton
                                                  background="red.300"
                                                  height='20px'
                                                  w={isMobileDevice ? "320px" : "208px"}
                                              />
                                            </Flex>

                                        )
                                      })}
                                    </Flex>
                                  </Box>
                              )
                            })}


                          </Stack>
                      ) : // </Stack>
                      keyword &&
                      searchResults.searchResult === undefined ? null : keyword &&
                      searchResults.searchResult !== undefined ? (
                          newSearchSection.newSearchResult === undefined ? (
                              searchResults.searchResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"search"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          ) : (
                              newSearchSection.newSearchResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"search"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          )
                      ) : searchResults.filterResult !== undefined ? (
                          newSearchSection.newFilterResult === undefined ? (
                              searchResults.filterResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          section={"filter"}
                                          key={content?.id}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          ) : (
                              newSearchSection.newFilterResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"filter"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          )
                      ) : searchResults.filterResult === undefined ? (
                          recentFarms === undefined ? (
                              newLP.contents?.map((content: any, index: number) => (
                                  <YieldFarm
                                      farmDataLoading={farmDataLoading}
                                      content2={content}
                                      key={content?.id}
                                      section={"normal"}
                                      wallet={wallet}
                                      LoadingState={loadingLP}
                                      contractID={1}
                                  />
                              ))
                          )
                              : (
                              recentFarms.map((content: any, index: number) => (
                                  <YieldFarm
                                      farmDataLoading={farmDataLoading}
                                      content2={content}
                                      key={content?.id}
                                      section={"normal"}
                                      wallet={wallet}
                                      LoadingState={loadingLP}
                                      contractID={1}
                                  />
                              ))
                          )
                          )
                              : null}
                </Box>
              </Box>
            </Flex>
          </TabPanel>

          <TabPanel padding='0px'>
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
                        : mode === DARK_THEME && selected === farmSection.SECOND_NEW_LP
                        ? "#15202B !important"
                        : mode === DARK_THEME && selected === farmSection.STAKING
                            ? "#15202B !important"
                            : mode === LIGHT_THEME && selected === farmSection.SECOND_NEW_LP
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
                        mode === LIGHT_THEME && selected === farmSection.SECOND_NEW_LP
                            ? "#F2F5F8  !important"
                            : mode === DARK_THEME && selected === farmSection.SECOND_NEW_LP
                            ? "#213345"
                            : mode === DARK_THEME && selected === farmSection.STAKING
                                ? "#213345"
                                : mode === LIGHT_THEME && selected === farmSection.STAKING
                                    ? "#F2F5F8"
                                    : "#F2F5F8 !important"
                      }
                      color={
                        mode === LIGHT_THEME && selected === farmSection.SECOND_NEW_LP
                            ? "#333333"
                            : mode === DARK_THEME && selected === farmSection.STAKING
                            ? "#F1F5F8"
                            : mode === DARK_THEME && selected === farmSection.SECOND_NEW_LP
                                ? "#F1F5F8"
                                : mode === LIGHT_THEME && selected === farmSection.STAKING
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
                    <Text/>
                  </Flex>

                  {!account ? null : ChainId !== chainId || loadingLP ? (
                          <Stack mt={2}>
                            {new Array(4).fill("1").map((item,index)=>{
                              return (
                                  <Box
                                      p={isMobileDevice ? "3" : "6"}
                                      h={isMobileDevice ? undefined : 20}
                                      border='1px'
                                      borderColor={filterBorderColor}
                                  >
                                    <Flex
                                        flexDirection={isMobileDevice ? "column" : "row"}
                                        justifyContent={
                                          isMobileDevice ? "center" : "space-between"
                                        }
                                        alignItems={isMobileDevice ? "center" : undefined}
                                    >
                                      {new Array(4).fill("1").map((item,index)=>{
                                        return (
                                            <Flex
                                                ml={isMobileDevice ? undefined : 2}
                                                mt={isMobileDevice ? 2 : undefined}
                                                flexDirection='column'
                                            >
                                              <Skeleton
                                                  background="red.300"
                                                  height='20px'
                                                  w={isMobileDevice ? "320px" : "208px"}
                                              />
                                            </Flex>

                                        )
                                      })}
                                    </Flex>
                                  </Box>
                              )
                            })}


                          </Stack>
                      ) :
                      keyword &&
                      searchResults.searchResult === undefined ? null : keyword &&
                      searchResults.searchResult !== undefined ? (
                          newSearchSection.newSearchResult === undefined ? (
                              searchResults.searchResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"search"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          ) : (
                              newSearchSection.newSearchResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"search"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          )
                      ) : searchResults.filterResult !== undefined ? (
                          newSearchSection.newFilterResult === undefined ? (
                              searchResults.filterResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          section={"filter"}
                                          key={content?.id}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          ) : (
                              newSearchSection.newFilterResult.map(
                                  (content: any, index: number) => (
                                      <YieldFarm
                                          farmDataLoading={farmDataLoading}
                                          content2={content}
                                          key={content?.id}
                                          section={"filter"}
                                          wallet={wallet}
                                          LoadingState={loadingState}
                                      />
                                  )
                              )
                          )
                      ) : searchResults.filterResult === undefined ? (
                              recentFarms === undefined ? (
                                      newLP.contents?.map((content: any, index: number) => (
                                          <YieldFarm
                                              farmDataLoading={farmDataLoading}
                                              content2={content}
                                              key={content?.id}
                                              section={"normal"}
                                              wallet={wallet}
                                              LoadingState={loadingLP}
                                              contractID={2}
                                          />
                                      ))
                                  )
                                  : (
                                      recentFarms.map((content: any, index: number) => (
                                          <YieldFarm
                                              farmDataLoading={farmDataLoading}
                                              content2={content}
                                              key={content?.id}
                                              section={"normal"}
                                              wallet={wallet}
                                              LoadingState={loadingLP}
                                              contractID={2}
                                          />
                                      ))
                                  )
                          )
                          : null}
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

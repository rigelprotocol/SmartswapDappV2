/** @format */

import React, { useState, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import {
  Alert,
  AlertDescription,
  CloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { useColorModeValue } from '@chakra-ui/react'
import YieldFarm from './YieldFarm'
import { contents } from './mock'
import { AlertSvg } from './Icon'
import { useWeb3React } from '@web3-react/core'
import { useRouteMatch } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux";
import bigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { updateFarmBalances, updateTokenStaked, updateTotalLiquidity } from '../../state/farm/actions'
import { useFarms } from '../../state/farm/hooks'
import { MasterChefV2Contract, smartSwapLPTokenPoolOne, smartSwapLPTokenPoolThree, smartSwapLPTokenPoolTwo, smartSwapLPTokenV2PoolFive, smartSwapLPTokenV2PoolFour, RGPSpecialPool, rigelToken } from '../../utils/Contracts'
import { RGPADDRESSES, RGPSPECIALPOOLADDRESSES, MASTERCHEFV2ADDRESSES, SMARTSWAPLP_TOKEN1ADDRESSES, SMARTSWAPLP_TOKEN2ADDRESSES, SMARTSWAPLP_TOKEN3ADDRESSES, SMARTSWAPLP_TOKEN4ADDRESSES, SMARTSWAPLP_TOKEN5ADDRESSES, RGP } from '../../utils/addresses'
import { formatBigNumber } from '../../utils'
import {RootState} from "../../state";
import { useNativeBalance, useRGPBalance } from '../../utils/hooks/useBalances';

export const BIG_TEN = new bigNumber(10);

export const LIQUIDITY = 'liquidity';
export const STAKING = 'staking';
export const V1 = 'v1';
export const V2 = 'v2';
export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';
export const LIQUIDITY_INDEX = 0;
export const STAKING_INDEX = 1;
export const MAINNET = 56;
export const TESTNET = 97;


export function Index() {
  const history = useHistory();
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  const [selected, setSelected] = useState(LIQUIDITY);
  const [isActive, setIsActive] = useState(V2);
  const [showAlert, setShowAlert] = useState(true);
  const [farmDataLoading, setfarmDataLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  //const { data: farmsLP } = useFarms()
  const [farms, setFarms] = useState(contents);
  const { account, chainId, library } = useWeb3React();
  const dispatch = useDispatch();
  let match = useRouteMatch('/farming-V2/staking-RGP');
  const FarmData = useFarms();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [Balance, Symbol] = useNativeBalance();
  const wallet = {
      balance: Balance,
      address: account,
      provider: provider,
      signer: signer,
      chainId: chainId,
  }

  const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
  const stateChanged: boolean = trxState === 2;

  //temporary
  useEffect(() => {
    getFarmData();
    getTokenStaked()
    getFarmTokenBalance()
  }, [account, chainId, stateChanged]);


  useEffect(() => {
    if (match) setSelected(STAKING)
  }, [match]);

  const changeVersion = (version: string) => {
    history.push(version)
  };

  const handleSelect = (value: string) => {
    if (value === LIQUIDITY) {
      setSelected(LIQUIDITY);
      changeVersion('/farming-v2')
    } else if (value === STAKING) {
      setSelected(STAKING);
      changeVersion('/farming-v2/staking-RGP')
    }
  };

  const handleActive = (value: string) => {
    if (value === V1) {
      setIsActive(V1);
      changeVersion('/farming')
    } else if (value === V2) {
      setIsActive(V2);
      changeVersion('/farming-v2')
    }
  };

  const handleAlert = () => {
    setShowAlert(false)
  }

  const getFarmTokenBalance = async () => {
    if (account) {
      try {
        const [RGPToken, poolOne, poolTwo, poolThree, poolFour, poolFive] = await Promise.all([
          rigelToken(RGP[chainId as number]),
          smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]),
          smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]),
          smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]),
          smartSwapLPTokenV2PoolFour(SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number]),
          smartSwapLPTokenV2PoolFive(SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number]),


        ]);

        const [
          RGPbalance,
          poolOneBalance,
          poolTwoBalance,
          poolThreeBalance,
          poolFourBalance,
          poolFiveBalance,
        ] = await Promise.all([
          RGPToken.balanceOf(account),
          poolOne.balanceOf(account),
          poolTwo.balanceOf(account),
          poolThree.balanceOf(account),
          poolFour.balanceOf(account),
          poolFive.balanceOf(account),
        ]);

        dispatch(updateFarmBalances([
          formatBigNumber(RGPbalance),
          formatBigNumber(poolTwoBalance),
          formatBigNumber(poolOneBalance),
          formatBigNumber(poolThreeBalance),
          formatBigNumber(poolFourBalance),
          formatBigNumber(poolFiveBalance),

        ]))

      } catch (error) {
        console.error(error);
      }
    }
  };

  const getFarmData = async () => {
    setfarmDataLoading(true);

    try {
      const [specialPool, pool1, pool2, pool3, pool4, pool5] = await Promise.all([
        RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number]),
        smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]),
        smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]),
        smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]),
        smartSwapLPTokenV2PoolFour(SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number]),
        smartSwapLPTokenV2PoolFive(SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number]),
      ]);

      const [
        rgpTotalStaking,
        pool1Reserve,
        pool2Reserve,
        pool3Reserve,
        pool4Reserve,
        pool5Reserve,
      ] = await Promise.all([
        specialPool.totalStaking(),
        pool1.getReserves(),
        pool2.getReserves(),
        pool3.getReserves(),
        pool4.getReserves(),
        pool5.getReserves(),
      ]);

      const RGPprice: number | any = ethers.utils.formatUnits(
        pool1Reserve[0].mul(1000).div(pool1Reserve[1]),
        3,
      );

      const BNBprice = getBnbPrice(pool3, pool3Reserve);
      const RGPLiquidity = ethers.utils
        .formatUnits(rgpTotalStaking.mul(Math.floor(1000 * RGPprice)), 21)
        .toString();
      const BUSD_RGPLiquidity = ethers.utils
        .formatEther(pool1Reserve[0].mul(2))
        .toString();

      const RGP_BNBLiquidity = ethers.utils
        .formatUnits(pool2Reserve[0].mul(Math.floor(BNBprice * 1000 * 2)), 21)
        .toString();
      const BUSD_BNBLiquidity = getBusdBnbLiquidity(pool3, pool3Reserve);

      const AXS_BUSDLiquidity = getAXSBUSDLiquidity(pool5, pool5Reserve);
      const AXS_RGPLiquidity = ethers.utils
        .formatUnits(pool4Reserve[1].mul(Math.floor(Number(RGPprice) * 1000 * 2)), 21)
        .toString();

      dispatch(updateTotalLiquidity([
        {
          liquidity: RGPLiquidity,
          apy: calculateApy(RGPprice, RGPLiquidity, 250),
        },
        {
          liquidity: RGP_BNBLiquidity,
          apy: calculateApy(RGPprice, RGP_BNBLiquidity, 953.3333333),
        },
        {
          liquidity: BUSD_RGPLiquidity,
          apy: calculateApy(RGPprice, BUSD_RGPLiquidity, 3336.666667),
        },
        {
          liquidity: BUSD_BNBLiquidity,
          apy: calculateApy(RGPprice, BUSD_BNBLiquidity, 476.6666667),
        },
        {
          liquidity: AXS_RGPLiquidity,
          apy: calculateApy(RGPprice, AXS_RGPLiquidity, 715),
        },
        {
          liquidity: AXS_BUSDLiquidity,
          apy: calculateApy(RGPprice, AXS_BUSDLiquidity, 238.3333333),
        },
      ]))

    } catch (error: any) {
      console.log(error.message);
      setfarmDataLoading(false)
      //if (!toast.isActive(id)) {
      //  showErrorToast();
    }
    setfarmDataLoading(false)
  };

  const specialPoolStaked = async () => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool(RGPADDRESSES[chainId as number]);
        const RGPStakedEarned = await Promise.all([
          specialPool.userData(account),
          specialPool.calculateRewards(account),
        ]);
        return RGPStakedEarned;
      } catch (error) {
        return error;
      }
    }
  };
  const getTokenStaked = async () => {
    try {
      if (account) {
        const masterChefV2 = await MasterChefV2Contract(MASTERCHEFV2ADDRESSES[chainId as number]);
        const [
          poolOneEarned,
          poolTwoEarned,
          poolThreeEarned,
          poolFourEarned,
          poolFiveEarned,
          poolOneStaked,
          poolTwoStaked,
          poolThreeStaked,
          poolFourStaked,
          poolFiveStaked,

        ] = await Promise.all([
          masterChefV2.pendingRigel(1, account),
          masterChefV2.pendingRigel(2, account),
          masterChefV2.pendingRigel(3, account),
          masterChefV2.pendingRigel(4, account),
          masterChefV2.pendingRigel(5, account),
          masterChefV2.userInfo(1, account),
          masterChefV2.userInfo(2, account),
          masterChefV2.userInfo(3, account),
          masterChefV2.userInfo(4, account),
          masterChefV2.userInfo(5, account),

        ]);

        //console.log("poolFourStaked", poolFourStaked)
        //const RGPStakedEarned = await specialPoolStaked();
        let RGPStaked;
        let RGPEarned;

        //console.log("EARRNED", RGPStakedEarned)

        //  if (RGPStakedEarned) {
        //const [specialPoolStaked, specialPoolEarned] = RGPStakedEarned;

        //  RGPStaked = formatBigNumber(specialPoolStaked.tokenQuantity);
        // RGPEarned = formatBigNumber(specialPoolEarned);
        //   } else {
        RGPStaked = 0;
        RGPEarned = 0;
        //  }


        dispatch(updateTokenStaked([
          { staked: RGPStaked, earned: RGPEarned },
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
        ]));

        setInitialLoad(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateApy = (rgpPrice: any, totalLiquidity: any, inflation: any) =>
    (rgpPrice * inflation * 365 * 100) / totalLiquidity;

  const getBusdBnbLiquidity = (pool3: any, pool3Reserve: any) => {
    const pool3Testnet = '0x120f3E6908899Af930715ee598BE013016cde8A5';
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
    const pool3testnet = '0x120f3E6908899Af930715ee598BE013016cde8A5';
    let BNBprice;
    if (pool3 && pool3.address === pool3testnet) {
      BNBprice = ethers.utils.formatUnits(
        pool3Reserve[0].mul(1000).div(pool3Reserve[1]),
        3,
      );
    } else {
      BNBprice = ethers.utils.formatUnits(
        pool3Reserve[1].mul(1000).div(pool3Reserve[0]),
        3,
      );
    }
    return Number(BNBprice);
  };

  const getAXSBUSDLiquidity = (pool5: any, pool5Reserve: any) => {
    const pool5Testnet = '0x816b823d9C7F30327B2c626DEe4aD731Dc9D3641';
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

  return (
    <Box>
      {(chainId && library) || !showAlert ? null : (
        <Box mx={[5, 10, 15, 20]} my={4}>
          <Alert
            color="#FFFFFF"
            background={mode === DARK_THEME ? '#319EF6' : '#319EF6'}
            borderRadius="8px"
          >
            <AlertSvg />
            <AlertDescription
              fontFamily="Inter"
              fontSize={{ base: '16px', md: '18px', lg: '20px' }}
              fontWeight="500"
              lineHeight="24px"
              letterSpacing="0em"
              textAlign="left"
              padding="10px"
            >
              This is the V2 Farm. You should migrate your stakings from V1
              Farm.
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
          position={{ base: 'relative', md: 'absolute' }}
          borderRadius="6px"
          border={
            mode === LIGHT_THEME && isActive === V1
              ? '2px solid #DEE5ED !important'
              : mode === DARK_THEME && isActive === V1
                ? '2px solid  #213345 !important'
                : mode === DARK_THEME && isActive === V2
                  ? '2px solid  #213345 !important'
                  : mode === LIGHT_THEME && isActive === V2
                    ? '2px solid #DEE5ED !important'
                    : '2px solid #DEE5ED !important'
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
                  ? '#FFFFFF !important'
                  : mode === DARK_THEME && isActive === V1
                    ? '#15202B !important'
                    : mode === DARK_THEME && isActive === V2
                      ? '#15202B !important'
                      : mode === LIGHT_THEME && isActive === V2
                        ? '#FFFFFF !important'
                        : '#F2F5F8 !important'
              }
              color={
                mode === LIGHT_THEME && isActive === V1
                  ? '#999999 !important'
                  : mode === DARK_THEME && isActive === V1
                    ? '#7599BD !important'
                    : mode === DARK_THEME && isActive === V2
                      ? '#7599BD !important'
                      : mode === LIGHT_THEME && isActive === V2
                        ? '#999999 !important'
                        : '#333333'
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
                  ? '#F2F5F8 !important'
                  : mode === DARK_THEME && isActive === V2
                    ? '#4A739B !important'
                    : mode === DARK_THEME && isActive === V1
                      ? '#4A739B !important'
                      : mode === LIGHT_THEME && isActive === V1
                        ? '#FFFFFF !important'
                        : '#F2F5F8 !important'
              }
              color={
                mode === LIGHT_THEME && isActive === V2
                  ? '#333333 !important'
                  : mode === DARK_THEME && isActive === V2
                    ? '#F1F5F8 !important'
                    : mode === DARK_THEME && isActive === V1
                      ? '#F1F5F8 !important'
                      : mode === LIGHT_THEME && isActive === V2
                        ? '#333333 !important'
                        : '#333333'
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
                ? '#FFFFFF !important'
                : mode === DARK_THEME && selected === LIQUIDITY
                  ? '#213345 !important'
                  : mode === DARK_THEME && selected === STAKING
                    ? '#15202B !important'
                    : mode === LIGHT_THEME && selected === LIQUIDITY
                      ? '#DEE5ED !important'
                      : '#DEE5ED !important'
            }
            px={5}
            py={4}
            minWidth={{ base: 'none', md: '200px', lg: '200px' }}
            value={LIQUIDITY}
            onClick={() => handleSelect(LIQUIDITY)}
            // onClick={handleSelect}
            borderColor={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? '#F2F5F8 !important'
                : mode === DARK_THEME && selected === LIQUIDITY
                  ? '#324D68 !important'
                  : mode === DARK_THEME && selected === STAKING
                    ? '#324D68 !important'
                    : mode === LIGHT_THEME && selected === STAKING
                      ? '#F2F5F8 !important'
                      : '#F2F5F8 !important'
            }
          >
            <Text
              color={
                mode === LIGHT_THEME && selected === LIQUIDITY
                  ? '#333333'
                  : mode === DARK_THEME && selected === LIQUIDITY
                    ? '#F1F5F8'
                    : mode === DARK_THEME && selected === STAKING
                      ? '#F1F5F8'
                      : mode === LIGHT_THEME && selected === STAKING
                        ? '#333333'
                        : '#333333'
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
                ? '#FFFFFF !important'
                : mode === DARK_THEME && selected === STAKING
                  ? '#213345 !important'
                  : mode === DARK_THEME && selected === LIQUIDITY
                    ? '#15202B !important'
                    : mode === LIGHT_THEME && selected === STAKING
                      ? '#DEE5ED !important'
                      : '#DEE5ED !important'
            }
            color={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? '#333333'
                : mode === DARK_THEME && selected === LIQUIDITY
                  ? '#F1F5F8'
                  : mode === DARK_THEME && selected === STAKING
                    ? '#F1F5F8'
                    : mode === LIGHT_THEME && selected === STAKING
                      ? '#333333'
                      : '#333333'
            }
            borderColor={
              mode === LIGHT_THEME && selected === LIQUIDITY
                ? '#F2F5F8 !important'
                : mode === DARK_THEME && selected === LIQUIDITY
                  ? '#324D68 !important'
                  : mode === DARK_THEME && selected === STAKING
                    ? '#324D68 !important'
                    : mode === LIGHT_THEME && selected === STAKING
                      ? '#F2F5F8 !important'
                      : '#F2F5F8 !important'
            }
            px={5}
            py={4}
            minWidth={{ base: 'none', md: '200px', lg: '200px' }}
            onClick={() => handleSelect(STAKING)}
          >
            <Text>Staking</Text>
          </Tab>
        </TabList>
        <TabPanels padding="0px">
          <TabPanel padding="0px">
            <Flex
              justifyContent="center"
              alignItems="center"
              rounded="lg"
              mb={4}
            >
              <Box
                bg="#120136"
                minHeight="89vh"
                w={['100%', '100%', '100%']}
                background={
                  mode === LIGHT_THEME && selected === STAKING
                    ? '#FFFFFF !important'
                    : mode === DARK_THEME && selected === LIQUIDITY
                      ? '#15202B !important'
                      : mode === DARK_THEME && selected === STAKING
                        ? '#15202B !important'
                        : mode === LIGHT_THEME && selected === LIQUIDITY
                          ? '#FFFFFF !important'
                          : '#FFFFFF !important'
                }
                rounded="lg"
              >
                <Box mx="auto" w={['100%', '100%', '100%']} pb="70px">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={4}
                    background={
                      mode === LIGHT_THEME && selected === LIQUIDITY
                        ? '#F2F5F8  !important'
                        : mode === DARK_THEME && selected === LIQUIDITY
                          ? '#213345'
                          : mode === DARK_THEME && selected === STAKING
                            ? '#213345'
                            : mode === LIGHT_THEME && selected === STAKING
                              ? '#F2F5F8'
                              : '#F2F5F8 !important'
                    }
                    color={
                      mode === LIGHT_THEME && selected === LIQUIDITY
                        ? '#333333'
                        : mode === DARK_THEME && selected === STAKING
                          ? '#F1F5F8'
                          : mode === DARK_THEME && selected === LIQUIDITY
                            ? '#F1F5F8'
                            : mode === LIGHT_THEME && selected === STAKING
                              ? '#333333'
                              : '#333333'
                    }
                    w={['100%', '100%', '100%']}
                    align="left"
                    border={
                      mode === LIGHT_THEME
                        ? '1px solid #DEE5ED !important'
                        : mode === DARK_THEME
                          ? '1px solid #324D68 !important'
                          : '1px solid #324D68'
                    }
                    display={{ base: 'none', md: 'flex', lg: 'flex' }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>

                  {FarmData.contents.map((content: any, index: number) =>
                    index !== 0 ? (
                      <YieldFarm farmDataLoading={farmDataLoading} content={content} key={content.pid} wallet={wallet}/>
                    ) : null,
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel padding="0px">
            <Flex
              justifyContent="center"
              alignItems="center"
              rounded="lg"
              mb={4}
            >
              <Box
                bg="#120136"
                minHeight="89vh"
                w={['100%', '100%', '100%']}
                background={
                  mode === LIGHT_THEME
                    ? '#FFFFFF !important'
                    : mode === DARK_THEME
                      ? '#15202B !important'
                      : '#FFFFFF !important'
                }
                rounded="lg"
              >
                <Box mx="auto" w={['100%', '100%', '100%']} pb="70px">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={4}
                    background={
                      mode === DARK_THEME
                        ? '#213345'
                        : mode === LIGHT_THEME
                          ? '#F2F5F8'
                          : '#F2F5F8 !important'
                    }
                    color={
                      mode === LIGHT_THEME
                        ? '#333333'
                        : mode === DARK_THEME
                          ? '#F1F5F8'
                          : '#333333'
                    }
                    w={['100%', '100%', '100%']}
                    align="left"
                    border={
                      mode === LIGHT_THEME
                        ? '1px solid #DEE5ED !important'
                        : mode === DARK_THEME
                          ? '1px solid #324D68 !important'
                          : '1px solid #324D68'
                    }
                    display={{ base: 'none', md: 'flex', lg: 'flex' }}
                  >
                    <Text>Deposit</Text>
                    <Text>Earn</Text>
                    <Text>APY</Text>
                    <Text>Total Liquidity</Text>
                    <Text />
                  </Flex>
                  {FarmData.contents.map((content: any, index: number) =>
                    index === 0 ? (
                      <YieldFarm farmDataLoading={farmDataLoading} content={content} key={content.pid} wallet={wallet}/>
                    ) : null,
                  )}
                </Box>
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Index

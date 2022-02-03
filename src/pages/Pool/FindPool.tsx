import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Spacer,
  Text,
  Heading,
  useColorModeValue,
  Center,
  useMediaQuery,
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router';
import { useDerivedSwapInfo } from '../../state/swap/hooks';
import { Field } from '../../state/swap/actions';
import From from './FindPoolInputs/From';
import To from './FindPoolInputs/To';
import CurrencyLogo from '../../components/currencyLogo';
import { Currency } from '@uniswap/sdk-core';
import { useDefaultsFromURLSearch } from '../../state/swap/hooks';
import { useCurrency } from '../../hooks/Tokens';
import { selectCurrency } from '../../state/swap/actions';
import { useDispatch } from 'react-redux';
import { useGetUserLiquidities } from '../../utils/hooks/usePools';
import { useWeb3React } from '@web3-react/core';
import { filterPools } from '../../utils/hooks/usePools';
import { Link } from 'react-router-dom';
import { GetAddressTokenBalance } from '../../state/wallet/hooks';
import TransactionSettings from '../../components/TransactionSettings';


export type Currencies = {
  TokenA: Currency | undefined;
  TokenB: Currency | undefined;
};

const FindPool = () => {
  const mode = useColorModeValue('light', 'dark');
  const infoBg = useColorModeValue('#EBF6FE', '#EAF6FF');
  const genBorder = useColorModeValue('#DEE6ED', '#324D68');
  const bgColor = useColorModeValue('#F2F5F8', '#213345');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const manageColor = useColorModeValue('#319EF6', '#4CAFFF');
  const hrBorderColor = useColorModeValue('#DEE5ED', '#324D68');
  const { currencies } = useDerivedSwapInfo();
  const [TokenA, setTokenA] = useState<Currency>();
  const [TokenB, setTokenB] = useState<Currency>();
  const [liquidities, setLiquidities] = useState<any[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState<any[] | undefined>([]);
  const [price, setPrice] = useState<number[]>([]);
  const { account, chainId } = useWeb3React();

  const [balance] = GetAddressTokenBalance(TokenA);
  const [balance2] = GetAddressTokenBalance(TokenB);

  const factory = useGetUserLiquidities();

  const loadedUrlParams = useDefaultsFromURLSearch();

  const history = useHistory();

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const details = await factory;
      if (details && !cancel) {
        try {
          setLiquidities(details.liquidities);
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

  const dispatch = useDispatch();

  useMemo(async () => {
    if (account && TokenA && TokenB) {
      setLoading(true);
      try {
        const data = filterPools({ TokenA, TokenB, liquidities });
        setPool(data);
        setLoading(false);
      } catch (err) {
        setPool([]);
        setLoading(false);
      }
    } else {
      setPool([]);
      setPrice([]);
      setLoading(false);
    }
  }, [TokenA, TokenB, liquidities, account, chainId]);

  useEffect(() => {
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: '',
      })
    );
  }, []);

  useEffect(() => {
    if (TokenA === undefined) {
      setTokenA(currencies[Field.INPUT]);
    }
  }, [currencies, TokenA]);

  return (
    <Center m={8}>
      <Box
        maxW="496px"
        borderWidth="1px"
        borderRadius="md"
        borderColor={genBorder}
        overflow="hidden"
        alignItems="center"
        p={4}
        mb={["110px","110px","4"]}
      >
        <Flex>
          <ArrowBackIcon
            onClick={() => history.goBack()}
            w={6}
            h={6}
            color={topIcons}
            cursor="pointer"
          />
          <Spacer />
          <Heading as="h4" size="md">
            Import Pool
          </Heading>
          <Spacer />
          <TransactionSettings />
          <TimeIcon w={6} h={7} pt={1} color={topIcons} />
        </Flex>
        <Box
          bg={mode === 'dark' ? '#213345' : '#F2F5F8'}
          borderRadius="md"
          p={4}
          mt={4}
          mb={5}
        >
          <Text color={manageColor} fontWeight="400" fontSize="14px">
            Tip: Use this tool to find pairs that don’t automatically appear on
            the platform.{' '}
          </Text>
        </Box>
        <From setTokenA={setTokenA} />
        <Flex justifyContent="center">
          <Center
            w="40px"
            h="40px"
            bg={bgColor}
            borderWidth="3px"
            borderColor={genBorder}
            color="#333333"
            borderRadius="xl"
            mt={5}
            mb={5}
          >
            <AddIcon color={textColorOne} />
          </Center>
        </Flex>
        <To setTokenB={setTokenB} TokenB={TokenB} />
        {loading ? (
          <Flex
            color="#fff"
            h="100px"
            mb="2px"
            mt="14px"
            justifyContent="center"
            alignItems="center"
            backgroundColor={mode === 'dark' ? '#213345' : '#F2F5F8'}
            border={mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'}
            borderRadius="6px"
          >
            <Text fontSize="sm" color={mode === 'dark' ? '#DCE5EF' : '#666666'}>
              Loading...
            </Text>
          </Flex>
        ) : !account ? (
          <Flex
            color="#fff"
            h="100px"
            mb="2px"
            mt="14px"
            justifyContent="center"
            alignItems="center"
            backgroundColor={mode === 'dark' ? '#213345' : '#F2F5F8'}
            border={mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'}
            borderRadius="6px"
          >
            <Text fontSize="sm" color={mode === 'dark' ? '#DCE5EF' : '#666666'}>
              Connect wallet
            </Text>
          </Flex>
        ) : !TokenA || !TokenB ? (
          <Flex
            color="#fff"
            h="100px"
            mb="2px"
            mt="14px"
            justifyContent="center"
            alignItems="center"
            backgroundColor={mode === 'dark' ? '#213345' : '#F2F5F8'}
            border={mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'}
            borderRadius="6px"
          >
            <Text fontSize="sm" color={mode === 'dark' ? '#DCE5EF' : '#666666'}>
              Select tokens to find your liquidity
            </Text>
          </Flex>
        ) : pool && pool?.length > 0 ? (
          <Flex flexDirection="column">
            <Flex flexDirection="column">
              <Text color={textColorOne} textAlign="center" mt={6} mb={1}>
                Pool Found!
              </Text>
              <Text color={manageColor} textAlign="center" mb={6}>
              <Link to="/pool">
                Manage this pool.
              </Link>
              </Text>
            </Flex>
            <Flex
              h="180px"
              border="1px"
              borderRadius="6px"
              borderColor={genBorder}
              flexDirection="column"
            >
              <Flex p={3} flexDirection="column">
                <Flex justifyContent="flex-start" mb={3}>
                  <Text>Your position</Text>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex>
                    <Flex mr={1}>
                      <CurrencyLogo
                        currency={currencies[Field.INPUT] ?? undefined}
                        size={24}
                        squared={true}
                      />
                    </Flex>
                    <Flex mr={2}>
                      <CurrencyLogo
                        currency={currencies[Field.OUTPUT] ?? undefined}
                        size={24}
                        squared={true}
                      />
                    </Flex>
                    <Text fontWeight="400" fontSize="16px">
                      {TokenA?.symbol} / {TokenB?.symbol}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" fontSize="14px" mr={3}>
                      {pool && parseFloat(pool[0].poolToken).toFixed(6)}
                    </Text>
                    <Text fontSize="14px">Pool Tokens</Text>
                  </Flex>
                </Flex>
              </Flex>
              <hr style={{ borderTopColor: hrBorderColor }} />
              <Flex
                justifyContent="space-between"
                alignItems="center"
                px={10}
                p={3}
                mt={3}
              >
                <Flex flexDirection="column">
                  <Text textAlign="center" fontWeight="bold" fontSize="16px">
                    {balance.currency?.isToken
                      ? balance.toSignificant(6)
                      : balance}
                  </Text>
                  <Text textAlign="center" fontSize="14px">
                    {currencies[Field.INPUT]?.symbol}
                  </Text>
                </Flex>
                <Flex flexDirection="column">
                  <Text textAlign="center" fontWeight="bold" fontSize="16px">
                    {balance2.currency?.isToken
                      ? balance2.toSignificant(6)
                      : balance2}
                  </Text>
                  <Text textAlign="center" fontSize="14px">
                    {currencies[Field.OUTPUT]?.symbol}
                  </Text>
                </Flex>
                <Flex fontSize="16px" flexDirection="column">
                  <Text fontWeight="bold" textAlign="center" fontSize="16px">
                    {pool && parseFloat(pool[0].poolShare).toFixed(6)}%
                  </Text>
                  <Text fontSize="14px">Share of Pool</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex
            color="#fff"
            h="100px"
            mb="2px"
            mt="14px"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            backgroundColor={mode === 'dark' ? '#213345' : '#F2F5F8'}
            border={mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'}
            borderRadius="6px"
          >
            <Text fontSize="sm" color={mode === 'dark' ? '#DCE5EF' : '#666666'}>
              You don’t have liquidity in this pool yet
            </Text>
            <Text color={manageColor} fontSize="14px" textAlign="center">
              <Link to="/add">Add liquidity</Link>
            </Text>
          </Flex>
        )}
      </Box>
    </Center>
  );
};
export default FindPool;

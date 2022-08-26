import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Field } from "../../state/mint/actions";
import { RouteComponentProps } from "react-router-dom";
import TransactionSettings from "../../components/TransactionSettings";
import {
  Box,
  Flex,
  Spacer,
  Text,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  Divider,
  Center,
} from "@chakra-ui/react";
import { ZERO_ADDRESS } from "../../constants";
import { TimeIcon, ArrowBackIcon, AddIcon } from "@chakra-ui/icons";
import { useDerivedMintInfo, useMintState } from "../../state/mint/hooks";
import OutputCurrecy from "./AddLquidityInputs/OutputCurrecy";
import InputCurrency from "./AddLquidityInputs/InputCurrency";
import Joyride from "react-joyride";
import { tourSteps } from "../../components/Onboarding/AddLiquidityStep";
import { useMintActionHandlers } from "../../state/mint/hooks";
import {
  useIsPoolsAvailable,
  usePricePerToken,
  useAllowance,
  usePriceForNewPool,
  useMintedLiquidity,
  getAddress,
} from "../../utils/hooks/usePools";
import { maxAmountSpend } from "../../utils/maxAmountSpend";
import {
  getERC20Token,
  getDeadline,
  formatAmountIn,
  getOutPutDataFromEvent,
} from "../../utils/utilsFunctions";
import { SMARTSWAPROUTER } from "../../utils/addresses";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { useDispatch } from "react-redux";
import { getExplorerLink, ExplorerDataType } from "../../utils/getExplorerLink";
import { addToast } from "../../components/Toast/toastSlice";
import { calculateSlippageAmount } from "../../utils/calculateSlippageAmount";
import ConfirmModal from "./modals/ConfirmModal";
import { useUserSlippageTolerance } from "../../state/user/hooks";
import { useUserTransactionTTL } from "../../state/user/hooks";
import { Currency } from "@uniswap/sdk";
import { SmartSwapRouter } from "../../utils/Contracts";
import { ethers } from "ethers";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { calculateGas } from "../Swap/components/sendToken";
import {
  useUserGasPricePercentage,
  useUpdateUserGasPreference,
} from "../../state/gas/hooks";
import { clearSearchResult } from "../../state/farming/action";
import {
  GFailedTransaction,
  GSuccessfullyTransaction,
} from "../../components/G-analytics/gIndex";

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const infoBg = useColorModeValue("#EBF6FE", "#EAF6FF");
  const genBorder = useColorModeValue("#DEE6ED", "#324D68");
  const bgColor = useColorModeValue("#F2F5F8", "#213345");
  const topIcons = useColorModeValue("#666666", "#DCE6EF");
  const textColorOne = useColorModeValue("#333333", "#F1F5F8");
  const btnTextColor = useColorModeValue("#999999", "#7599BD");
  const approveButtonBgColor = useColorModeValue("#319EF6", "#4CAFFF");
  const approveButtonColor = useColorModeValue("#FFFFFF", "#F1F5F8");

  const { independentField, typedValue, otherTypedValue } = useMintState();
  //const [loading, setLoading] = useState(false);
  const [run, setRun] = useState(false);
  const bgColorRide = useColorModeValue("#319EF6", "#4CAFFF");
  const { onCurrencySelection, onUserInput, onCurrencyFor } =
    useMintActionHandlers();
  const {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    showWrap,
    address,
  } = useDerivedMintInfo();
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const { chainId, account, library } = useActiveWeb3React();
  const dispatch = useDispatch();

  const { pairAvailable } = useIsPoolsAvailable(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

  useUpdateUserGasPreference();
  const [userGasPricePercentage, setUserGasPricePercentage] =
    useUserGasPricePercentage();

  const [balanceA, setBalanceA] = useState("");
  const [balanceB, setBalanceB] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [checkTokenApproval, setCheckTokenApproval] = useState(0);

  const [isLoadingValue, setIsLoadingValue] = useState(false);
  const [userSlippageTolerance] = useUserSlippageTolerance();
  const [userDeadline] = useUserTransactionTTL();

  useEffect(() => {
    if (currencyIdA && currencyIdB) {
      onCurrencyFor(currencyIdA, Field.INPUT);
      onCurrencyFor(currencyIdB, Field.OUTPUT);
    }
  }, [currencyIdB, currencyIdA]);

  function startWelcomeRide() {
    setRun(true);
  }
  useEffect(() => {
    const visits = window.localStorage.getItem("continueLiquidtyVisit");
    const liquidityVisits = window.localStorage.getItem("firstLiquidtyVisit");
    if (!visits) {
      window.localStorage.setItem("continueLiquidtyVisit", "1");
    }
    if (!visits && liquidityVisits !== "2") {
      startWelcomeRide();
      window.localStorage.setItem("firstYieldVisit", "1");
    }
  }, []);

  const { priceAToB, priceBToA } = usePricePerToken(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
  }, [chainId]);

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: typedValue,
            [Field.OUTPUT]: typedValue,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT ? parsedAmount : bestTrade,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT ? parsedAmount : bestTrade,
          },
    [independentField, parsedAmount, showWrap, bestTrade, typedValue]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: !pairAvailable
      ? otherTypedValue
      : showWrap
      ? parsedAmounts[independentField] ?? ""
      : parsedAmounts[dependentField] ?? "",
  };
  const { priceAperB, priceBperA } = usePriceForNewPool(
    formattedAmounts[Field.INPUT],
    formattedAmounts[Field.OUTPUT],
    pairAvailable
  );

  // const { poolShare } = usePoolShare(
  //   currencies[Field.INPUT],
  //   currencies[Field.OUTPUT]
  // );

  const { hasTokenABeenApproved, hasTokenBBeenApproved } = useAllowance(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    checkTokenApproval,
    formattedAmounts[Field.INPUT],
    formattedAmounts[Field.OUTPUT]
  );

  const { minted, poolShare } = useMintedLiquidity(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    formattedAmounts[Field.INPUT],
    formattedAmounts[Field.OUTPUT]
  );

  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT], library);
    const maxAmountInput = maxAmountSpend(value, currencies[Field.INPUT]);
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput, pairAvailable);
    }
  };
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value, pairAvailable);
    },
    [onUserInput, pairAvailable]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value, pairAvailable);
    },
    [onUserInput, pairAvailable]
  );

  const approveTokens = async (address: string, symbol: string) => {
    if (account) {
      const token = await getERC20Token(address, library);
      try {
        dispatch(
          setOpenModal({
            message: `${symbol} Approval`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const walletBal = await token.balanceOf(account);
        const approval = await token.approve(
          SMARTSWAPROUTER[chainId as number],
          walletBal,
          {
            from: account,
          }
        );
        const { confirmations } = await approval.wait(1);
        const { hash } = approval;
        if (confirmations >= 1) {
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          setCheckTokenApproval(checkTokenApproval + 1);
          dispatch(
            setOpenModal({
              message: `${symbol} Approval Successful`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          GSuccessfullyTransaction(
            "liquidity",
            "liquidity approval token",
            symbol
          );
          dispatch(
            addToast({
              message: `Approve ${symbol}`,
              URL: explorerLink,
            })
          );
        }
      } catch (err) {
        console.log(err);
        dispatch(
          setOpenModal({
            message: `${symbol} Approval`,
            trxState: TrxState.TransactionFailed,
          })
        );
        GFailedTransaction("liquidity", "liquidity approval token", symbol);
      }
    }
  };

  const addLiquidityETH = async (
    amountA: string,
    amountB: string,
    currencyA: Currency,
    currencyB: Currency
  ) => {
    if (account) {
      const smartswaprouter = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      const deadLine = getDeadline(userDeadline);
      const AmountAMin = formatAmountIn(amountA, currencyA.decimals);
      const AmountBMin = formatAmountIn(amountB, currencyB.decimals);

      try {
        dispatch(
          setOpenModal({
            message: `Supplying ${parseFloat(amountA).toFixed(6)} ${
              currencyA.symbol
            } and ${parseFloat(amountB).toFixed(6)} ${currencyB.symbol}`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );

        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();

        const data = await smartswaprouter.addLiquidityETH(
          currencyA.isNative ? currencyB.address : currencyA.address,
          currencyA.isNative ? AmountBMin : AmountAMin,
          currencyA.isNative
            ? calculateSlippageAmount(
                AmountBMin,
                pairAvailable ? userSlippageTolerance : 0
              )
            : calculateSlippageAmount(
                AmountAMin,
                pairAvailable ? userSlippageTolerance : 0
              ),
          currencyA.isNative
            ? calculateSlippageAmount(
                AmountAMin,
                pairAvailable ? userSlippageTolerance : 0
              )
            : calculateSlippageAmount(
                AmountBMin,
                pairAvailable ? userSlippageTolerance : 0
              ),
          account,
          deadLine,
          {
            value: currencyA.isNative ? AmountAMin : AmountBMin,
            maxPriorityFeePerGas:
              isEIP1559 && chainId === 137
                ? ethers.utils.parseUnits(format1, 9).toString()
                : null,
            maxFeePerGas:
              isEIP1559 && chainId === 137
                ? ethers.utils.parseUnits(format2, 9).toString()
                : null,
            // gasLimit: 290000,
            gasPrice:
              chainId === 137
                ? null
                : chainId === 80001
                ? null
                : ethers.utils.parseUnits(format3, 9).toString(),
          }
        );
        const { confirmations, events } = await data.wait(3);
        const { hash } = data;
        const addressA = getAddress(currencyA);
        const addressB = getAddress(currencyB);
        if (confirmations >= 3) {
          const inputValueForTokenA = await getOutPutDataFromEvent(
            addressA,
            events,
            currencyA.decimals
          );
          const inputValueForTokenB = await getOutPutDataFromEvent(
            addressB,
            events,
            currencyB.decimals
          );

          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );

          onUserInput(Field.OUTPUT, "", pairAvailable);
          onUserInput(Field.INPUT, "", pairAvailable);

          dispatch(
            setOpenModal({
              message: "Transaction Successful",
              trxState: TrxState.TransactionSuccessful,
            })
          );
          GSuccessfullyTransaction(
            "liquidity",
            "liquidity supplied successful",
            currencyA.symbol,
            currencyB.symbol
          );
          dispatch(
            addToast({
              message: `Add ${parseFloat(inputValueForTokenA as string).toFixed(
                6
              )} ${currencyA.symbol} and ${parseFloat(
                inputValueForTokenB as string
              ).toFixed(6)} ${currencyB.symbol} to Smartswap V2`,
              URL: explorerLink,
            })
          );
        }
      } catch (err) {
        console.log(err);
        GFailedTransaction(
          "liquidity",
          "liquidity supplied failed",
          err.message,
          currencyA.symbol,
          currencyB.symbol
        );
        dispatch(
          setOpenModal({
            message: `Transaction Failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const addLiquidity = async (
    amountA: string,
    amountB: string,
    currencyA: Currency,
    currencyB: Currency
  ) => {
    if (account) {
      const smartswaprouter = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      const deadLine = getDeadline(userDeadline);
      const AmountAMin = formatAmountIn(amountA, currencyA.decimals);
      const AmountBMin = formatAmountIn(amountB, currencyB.decimals);

      try {
        dispatch(
          setOpenModal({
            message: `Supplying ${parseFloat(amountA).toFixed(6)} ${
              currencyA.symbol
            } and ${parseFloat(amountB).toFixed(6)} ${currencyB.symbol}`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );

        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();

        const data = await smartswaprouter.addLiquidity(
          currencyA.address,
          currencyB.address,
          AmountAMin,
          AmountBMin,
          calculateSlippageAmount(
            AmountAMin,
            pairAvailable ? userSlippageTolerance : 0
          ),
          calculateSlippageAmount(
            AmountBMin,
            pairAvailable ? userSlippageTolerance : 0
          ),
          account,
          deadLine,
          {
            maxPriorityFeePerGas:
              isEIP1559 && chainId === 137
                ? ethers.utils.parseUnits(format1, 9).toString()
                : null,
            maxFeePerGas:
              isEIP1559 && chainId === 137
                ? ethers.utils.parseUnits(format2, 9).toString()
                : null,
            gasPrice:
              chainId === 137
                ? null
                : chainId === 80001
                ? null
                : ethers.utils.parseUnits(format3, 9).toString(),
          }
        );
        const { confirmations, events } = await data.wait(3);
        const { hash } = data;
        const addressA = getAddress(currencyA);
        const addressB = getAddress(currencyB);
        if (confirmations >= 3) {
          const inputValueForTokenA = await getOutPutDataFromEvent(
            addressA,
            events,
            currencyA.decimals
          );
          const inputValueForTokenB = await getOutPutDataFromEvent(
            addressB,
            events,
            currencyB.decimals
          );

          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );

          onUserInput(Field.OUTPUT, "", pairAvailable);
          onUserInput(Field.INPUT, "", pairAvailable);

          dispatch(
            setOpenModal({
              message: "Transaction Successful",
              trxState: TrxState.TransactionSuccessful,
            })
          );
          GSuccessfullyTransaction(
            "liquidity",
            "liquidity supplied successfully",
            currencyA.symbol,
            currencyB.symbol
          );
          dispatch(
            addToast({
              message: `Add ${parseFloat(inputValueForTokenA as string).toFixed(
                6
              )} ${currencyA.symbol} and ${parseFloat(
                inputValueForTokenB as string
              ).toFixed(6)} ${currencyB.symbol} to Smartswap V2`,
              URL: explorerLink,
            })
          );
        }
      } catch (err: any) {
        console.log(err);
        GFailedTransaction(
          "liquidity",
          "liquidity supplied failed",
          err.message,
          currencyA.symbol,
          currencyB.symbol
        );
        dispatch(
          setOpenModal({
            message: `Transaction Failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const handleAddLiquidity = () => {
    if (
      currencies[Field.INPUT]?.isNative ||
      currencies[Field.OUTPUT]?.isNative
    ) {
      addLiquidityETH(
        formattedAmounts[Field.INPUT],
        formattedAmounts[Field.OUTPUT],
        currencies[Field.INPUT] as Currency,
        currencies[Field.OUTPUT] as Currency
      );
    } else {
      addLiquidity(
        formattedAmounts[Field.INPUT],
        formattedAmounts[Field.OUTPUT],
        currencies[Field.INPUT] as Currency,
        currencies[Field.OUTPUT] as Currency
      );
    }
  };

  useEffect(() => {
    if (address === ZERO_ADDRESS) {
      setIsLoadingValue(false);
    } else if (
      formattedAmounts[Field.INPUT] &&
      !formattedAmounts[Field.OUTPUT]
    ) {
      setIsLoadingValue(true);
    } else {
      setIsLoadingValue(false);
    }
  }, [formattedAmounts[Field.OUTPUT], formattedAmounts[Field.INPUT]]);

  return (
    <Center m={8}>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        styles={{
          options: {
            arrowColor: bgColorRide,
            backgroundColor: bgColorRide,
            textColor: "#FFFFFF",
            primaryColor: bgColorRide,
          },
        }}
      />
      <Box
        maxW="496px"
        borderWidth="1px"
        borderRadius="md"
        borderColor={genBorder}
        overflow="hidden"
        alignItems="center"
        p={4}
        mb={["110px", "110px", "4"]}
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
            Add Liquidity
          </Heading>
          <Spacer />
          <TransactionSettings />
          <TimeIcon w={6} h={7} color={topIcons} />
        </Flex>
        <Box bg={infoBg} borderRadius="md" p={4} mt={4} mb={5}>
          <Text color="#319EF6" fontWeight="400" fontSize="14px">
            Tip: When you add liquidity, you will receive pool tokens
            representing your position. These tokens automatically earn fees
            proportional to your share of the pool, and can be redeemed at any
            time.
          </Text>
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          pt={2}
          pb={2}
          borderColor={genBorder}
          className="AddLiquidity"
        >
          <InputCurrency
            onUserInput={handleTypeInput}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.INPUT]}
            otherCurrency={currencies[Field.OUTPUT]}
            onMax={handleMaxInput}
            value={formattedAmounts[Field.INPUT]}
            setBalanceA={setBalanceA}
          />
        </Box>
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
        <Box
          borderRadius="md"
          border="1px solid #DEE6ED"
          pt={2}
          pb={2}
          borderColor={genBorder}
          className="AddLiquidity2"
        >
          <OutputCurrecy
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onUserOutput={handleTypeOutput}
            setBalanceB={setBalanceB}
          />
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          borderColor={genBorder}
          mt="5"
          mb="3"
        >
          <Text p="4" fontWeight="400">
            Prices & pool share
          </Text>
          <Divider orientation="horizontal" borderColor={genBorder} />
          <Flex p="4">
            <VStack>
              <Text color={textColorOne}>
                {priceBToA && pairAvailable
                  ? parseFloat(priceBToA).toFixed(6)
                  : !pairAvailable && priceBperA
                  ? priceBperA
                  : "-"}
              </Text>
              <Text color={topIcons}>
                {currencies[Field.INPUT]?.symbol} per{" "}
                {currencies[Field.OUTPUT]?.symbol}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>
                {priceAToB && pairAvailable
                  ? parseFloat(priceAToB).toFixed(6)
                  : priceAperB && !pairAvailable
                  ? priceAperB
                  : "-"}
              </Text>
              <Text color={topIcons}>
                {currencies[Field.OUTPUT]?.symbol} per{" "}
                {currencies[Field.INPUT]?.symbol}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>
                {!pairAvailable &&
                formattedAmounts[Field.INPUT] &&
                formattedAmounts[Field.OUTPUT]
                  ? "100%"
                  : poolShare &&
                    formattedAmounts[Field.INPUT] &&
                    formattedAmounts[Field.OUTPUT]
                  ? `${parseFloat(poolShare).toFixed(6)}% `
                  : "-"}
              </Text>
              <Text color={topIcons}>Share of Pool</Text>
            </VStack>
          </Flex>
        </Box>
        <Button
          size="lg"
          height="48px"
          width="200px"
          bgColor={approveButtonBgColor}
          color={approveButtonColor}
          w="100%"
          mb={3}
          _hover={{ bgColor: "none" }}
          _active={{ bgColor: "none" }}
          display={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            !hasTokenABeenApproved
              ? undefined
              : parseFloat(formattedAmounts[Field.INPUT]) >
                  parseFloat(balanceA) ||
                parseFloat(formattedAmounts[Field.OUTPUT]) >
                  parseFloat(balanceB)
              ? "none"
              : "none"
          }
          onClick={() =>
            approveTokens(
              currencies[Field.INPUT]?.address,
              currencies[Field.INPUT]?.symbol as string
            )
          }
        >
          {`Approve ${currencies[Field.INPUT]?.symbol}`}
        </Button>
        <Button
          size="lg"
          height="48px"
          width="200px"
          mb={3}
          bgColor={approveButtonBgColor}
          color={approveButtonColor}
          w="100%"
          _hover={{ bgColor: "none" }}
          _active={{ bgColor: "none" }}
          display={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            !hasTokenBBeenApproved
              ? undefined
              : parseFloat(formattedAmounts[Field.INPUT]) >
                  parseFloat(balanceA) ||
                parseFloat(formattedAmounts[Field.OUTPUT]) >
                  parseFloat(balanceB)
              ? "none"
              : "none"
          }
          onClick={() =>
            approveTokens(
              currencies[Field.OUTPUT]?.address,
              currencies[Field.OUTPUT]?.symbol as string
            )
          }
        >
          {`Approve ${currencies[Field.OUTPUT]?.symbol}`}
        </Button>
        {isLoadingValue ? (
          <Button
            size="lg"
            height="48px"
            width="200px"
            border="2px"
            borderColor={genBorder}
            color={btnTextColor}
            className="AddLiquidity3"
            w="100%"
            _hover={{ bgColor: "none" }}
            _active={{ bgColor: "none" }}
            disabled={true}
          >
            Loading...
          </Button>
        ) : (
          <Button
            size="lg"
            height="48px"
            width="200px"
            border="2px"
            className="AddLiquidity3"
            borderColor={genBorder}
            color={btnTextColor}
            w="100%"
            _hover={{ bgColor: "none" }}
            _active={{ bgColor: "none" }}
            display={
              formattedAmounts[Field.INPUT] && formattedAmounts[Field.OUTPUT]
                ? "none"
                : undefined
            }
          >
            Enter An Amount
          </Button>
        )}

        <Button
          size="lg"
          height="48px"
          width="200px"
          display={
            formattedAmounts[Field.INPUT] && formattedAmounts[Field.OUTPUT]
              ? undefined
              : "none"
          }
          disabled={
            !hasTokenBBeenApproved ||
            !hasTokenABeenApproved ||
            parseFloat(formattedAmounts[Field.INPUT]) > parseFloat(balanceA) ||
            parseFloat(formattedAmounts[Field.OUTPUT]) > parseFloat(balanceB)
          }
          border={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ""
              : "2px"
          }
          borderColor={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ""
              : genBorder
          }
          bgColor={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? approveButtonBgColor
              : ""
          }
          color={
            formattedAmounts[Field.OUTPUT] &&
            formattedAmounts[Field.INPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? approveButtonColor
              : btnTextColor
          }
          // color={btnTextColor}
          w="100%"
          _hover={{ bgColor: "none" }}
          _active={{ bgColor: "none" }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          {parseFloat(formattedAmounts[Field.INPUT]) > parseFloat(balanceA) ||
          parseFloat(formattedAmounts[Field.OUTPUT]) > parseFloat(balanceB)
            ? ` Insufficient ${
                parseFloat(formattedAmounts[Field.INPUT]) > parseFloat(balanceA)
                  ? currencies[Field.INPUT]?.symbol
                  : currencies[Field.OUTPUT]?.symbol
              } balance`
            : "Confirm Liquidity Add"}
        </Button>
        <ConfirmModal
          title={pairAvailable ? "Confirm" : "You are creating a new pool"}
          amount={minted}
          from={currencies[Field.INPUT]?.symbol as string}
          fromPrice={priceBToA as string}
          to={currencies[Field.OUTPUT]?.symbol as string}
          toPrice={priceAToB as string}
          fromDeposited={formattedAmounts[Field.INPUT]}
          toDeposited={formattedAmounts[Field.OUTPUT]}
          poolShare={poolShare}
          showModal={showModal}
          setShowModal={setShowModal}
          handleAddLiquidity={handleAddLiquidity}
          pairAvailable={pairAvailable}
          priceAperB={priceAperB}
          priceBperA={priceBperA}
        />
      </Box>
    </Center>
  );
}

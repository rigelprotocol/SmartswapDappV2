import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import SwapSettings from "./SwapSettings";
import { useHistory } from "react-router";
import From from "./From";
import To from "./To";
import { SwitchIcon } from "../../../../theme/components/Icons";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../../../state/swap/hooks";
import { useCurrency } from "../../../../hooks/Tokens";
import ConfirmModal from "../../modals/confirmModal";
import { Field } from "../../../../state/swap/actions";
import { maxAmountSpend } from "../../../../utils/maxAmountSpend";
import { useUserSlippageTolerance } from "../../../../state/user/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal, TrxState } from "../../../../state/application/reducer";
import {
  ApprovalRouter,
  ApproveCheck,
  SmartSwapRouter,
  WETH,
  smartFactory,
} from "../../../../utils/Contracts";
import { useActiveWeb3React } from "../../../../utils/hooks/useActiveWeb3React";
import { SMARTSWAPROUTER, WNATIVEADDRESSES } from "../../../../utils/addresses";
import {
  ExplorerDataType,
  getExplorerLink,
} from "../../../../utils/getExplorerLink";
import { addToast } from "../../../../components/Toast/toastSlice";
import { RootState } from "../../../../state";
import {
  getDeadline,
  getInPutDataFromEvent,
  getOutPutDataFromEvent,
  ZERO_ADDRESS,
} from "../../../../constants";
import { Currency, Token } from "@uniswap/sdk-core";
import { useAllTokens } from "../../../../hooks/Tokens";
import { ethers } from "ethers";
import { GetAddressTokenBalance } from "../../../../state/wallet/hooks";
import NewToken from "../../../../components/Tokens/newToken";
import { SupportedChainId } from "../../../../constants/chains";
import { SMARTSWAPFACTORYADDRESSES } from "../../../../utils/addresses";
import { useCalculatePriceImpact } from "../../../../hooks/usePriceImpact";
import { getERC20Token } from "../../../../utils/utilsFunctions";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Percent } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import { useUpdateUserGasPreference } from "../../../../state/gas/hooks";
import { useUserGasPricePercentage } from "../../../../state/gas/hooks";
import { Web3Provider } from "@ethersproject/providers";
import NetworkModal from "./../../../../components/Navbar/modals/networkModal";
import { clearSearchResult } from "../../../../state/farming/action";
import {
  GButtonClick,
  GFailedTransaction,
  GSuccessfullyTransaction,
} from "../../../../components/G-analytics/gIndex";

export const calculateGas = async (
  percentage: number,
  library: Web3Provider | undefined,
  chainId: number
): Promise<{
  format1: string;
  format2: string;
  format3: string;
}> => {
  const web3 = createAlchemyWeb3("https://polygon-rpc.com");
  const maxPriorityPerGas = await web3.eth.getMaxPriorityFeePerGas();
  const GasPrice = (await library?.getGasPrice()).toString();

  const baseFee = await web3.eth.getBlock("pending");
  const baseFeeFormatted = web3.utils.hexToNumberString(baseFee.baseFeePerGas);
  const maxPriorityPerGasFormatted =
    web3.utils.hexToNumberString(maxPriorityPerGas);

  const baseFeeThirtyPercent = new Percent(percentage.toString(), "100")
    .multiply(
      chainId === 137
        ? maxPriorityPerGasFormatted
        : chainId === 80001
        ? maxPriorityPerGasFormatted
        : GasPrice
    )
    .quotient.toString();
    console.log({baseFeeThirtyPercent,percentage},new Percent(percentage.toString(), "100"))

  const addPriorityFee = JSBI.add(
    JSBI.BigInt(maxPriorityPerGasFormatted),
    JSBI.BigInt(baseFeeThirtyPercent)
  );

  const addGasFee = JSBI.add(
    JSBI.BigInt(baseFeeThirtyPercent),
    JSBI.BigInt(GasPrice)
  );

  const maxFee = JSBI.add(
    JSBI.BigInt(baseFeeFormatted),
    JSBI.BigInt(addPriorityFee.toString())
  );

  const format1 = ethers.utils.formatUnits(addPriorityFee.toString(), 9);
  const format2 = ethers.utils.formatUnits(maxFee.toString(), 9);
  const format3 = ethers.utils.formatUnits(addGasFee.toString(), 9);
  console.log({format1, format2, format3})
  return { format1, format2, format3 };
};

const SendToken = () => {
  const history = useHistory();
  const loadedUrlParams = useDefaultsFromURLSearch();
  const dispatch = useDispatch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);

  useUpdateUserGasPreference();
  const [userGasPricePercentage, setUserGasPricePercentage] =
    useUserGasPricePercentage();

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );

  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    history.push("/swap");
  }, [history]);

  const borderColor = useColorModeValue("#DEE5ED", "#324D68");
  const color = useColorModeValue("#999999", "#7599BD");
  const lightmode = useColorModeValue(true, false);
  const switchBgcolor = useColorModeValue("#F2F5F8", "#213345");
  const buttonBgcolor = useColorModeValue("#319EF6", "#4CAFFF");

  const [showModal, setShowModal] = useState(false);
  const [currentToPrice, setCurrentToPrice] = useState("");
  const [showNewChangesText, setShowNewChangesText] = useState(false);

  const { onCurrencySelection, onUserInput, onSwitchTokens } =
    useSwapActionHandlers();
  const {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
    pathSymbol,
    pathArray,
    isExactIn,
    formatAmount,
  } = useDerivedSwapInfo();
  const { independentField, typedValue } = useSwapState();
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const [allowedSlippage] = useUserSlippageTolerance();

  const deadline = useSelector<RootState, number>(
    (state) => state.user.userDeadline
  );

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
    [independentField, parsedAmount, showWrap, bestTrade]
  );

  const { chainId, account, library } = useActiveWeb3React();
  // const [priceImpact, setPriceImpact] = useState(0);

  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
  }, [chainId]);

  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT], library);
    const maxAmountInput = maxAmountSpend(value, currencies[Field.INPUT]);
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput);
    }
  };
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField] ?? "" //?.toExact() ?? ''
      : parsedAmounts[dependentField] ?? "", //?.toSignificant(6) ?? '',
  };

  const minimumAmountToReceive = useCallback(
    () =>
      ((100 - Number(allowedSlippage / 100)) / 100) *
      Number(formattedAmounts[Field.OUTPUT]),
    [allowedSlippage, bestTrade]
  );

  const minimum = minimumAmountToReceive().toFixed(
    currencies[Field.OUTPUT]?.decimals
  );

  const LPFee = (0.003 * Number(formattedAmounts[Field.INPUT])).toFixed(4);

  const receivedAmount = Number(formattedAmounts[Field.OUTPUT]).toFixed(4);
  const fromAmount = Number(formattedAmounts[Field.INPUT]);

  // useUpdateBalance("");

  const parsedOutput = (decimal: number) => {
    return ethers.utils.parseUnits(minimum.toString(), decimal).toString();
  };
  const [hasBeenApproved, setHasBeenApproved] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [displayNetwork, setDisplayNetwork] = useState(false);

  const [balance] = GetAddressTokenBalance(
    currencies[Field.INPUT] ?? undefined
  );
  useMemo(() => {
    if (currentToPrice && receivedAmount) {
      if (receivedAmount !== currentToPrice) {
        setShowNewChangesText(true);
      }
    }
  }, [currentToPrice, receivedAmount]);
  useEffect(() => {
    let interval;
    if (showNewChangesText) {
      interval = setInterval(() => setShowNewChangesText(false), 3000);
      //  return clearInterval(interval)
    }
    if (!showModal) {
      setShowNewChangesText(false);
      setCurrentToPrice("");
    }
  }, [showNewChangesText, showModal]);
  useEffect(() => {
    if (balance < parseFloat(formattedAmounts[Field.INPUT])) {
      setInsufficientBalance(true);
    } else {
      setInsufficientBalance(false);
    }
  }, [balance, formattedAmounts[Field.INPUT]]);

  const checkApproval = async () => {
    if (currencies[Field.INPUT]?.isNative) {
      return setHasBeenApproved(true);
    }

    const status = await ApproveCheck(
      currencies[Field.INPUT].wrapped.address,
      library
    );
    const check = await status.allowance(
      account,
      SMARTSWAPROUTER[chainId as number],
      {
        from: account,
      }
    );
    const approveBalance = ethers.utils
      .formatUnits(check, currencies[Field.INPUT].decimals)
      .toString();
    if (parseFloat(approveBalance) > Number(formattedAmounts[Field.INPUT])) {
      return setHasBeenApproved(true);
    }
    return setHasBeenApproved(false);
  };
  // useTokenBalance()
  useEffect(() => {
    if (!inputError && account) {
      checkApproval();
    }
  }, [inputError, formattedAmounts[Field.INPUT], currencies[Field.INPUT]]);

  const { priceImpact } = useCalculatePriceImpact(
    pathArray,
    parseFloat(receivedAmount),
    fromAmount,
    currencies[Field.INPUT] as Currency,
    currencies[Field.OUTPUT] as Currency
  );

  // const { maxPriority, maxFee, maxPriority2, maxFee2 } = useGas();

  const approveSwap = async () => {
    if (currencies[Field.INPUT]?.isNative) {
      return setHasBeenApproved(true);
    }
    try {
      dispatch(
        setOpenModal({
          message: `Approve Tokens for Swap`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );

      const address = currencies[Field.INPUT].wrapped.address;
      const swapApproval = await ApprovalRouter(address, library);

      const token = await getERC20Token(address, library);
      const walletBal = await token.balanceOf(account);

      const approveTransaction = await swapApproval.approve(
        SMARTSWAPROUTER[chainId as number],
        walletBal,
        {
          from: account,
        }
      );
      const { confirmations } = await approveTransaction.wait(1);
      const { hash } = approveTransaction;
      if (confirmations >= 1) {
        setHasBeenApproved(true);
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        dispatch(
          setOpenModal({
            message: `Approval Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        GSuccessfullyTransaction(
          "straight_swap",
          "approval",
          currencies[Field.INPUT]?.symbol
        );
        dispatch(
          addToast({
            message: `Swap approval successful`,
            URL: explorerLink,
          })
        );
      }
    } catch (e:any) {
      GFailedTransaction(
        "straight_swap",
        "approval",
        e.message,
        currencies[Field.INPUT]?.symbol
      );
      console.log(e);
      dispatch(
        setOpenModal({
          message: `Swap Approval Confirmation`,
          trxState: TrxState.TransactionFailed,
        })
      );
    }
  };

  const [sendingTrx, setSendingTrx] = useState(false);
  const outputToken = useCallback((): any => {
    if (parsedAmounts[Field.OUTPUT]) {
      const data = isExactIn
        ? ethers.utils.parseUnits(
            parsedAmounts[Field.OUTPUT] as string,
            currencies[Field.OUTPUT]?.decimals
          )
        : parsedAmounts[Field.OUTPUT];
      return data;
    }
  }, [parsedAmounts]);

  const swapDifferentTokens = async () => {
    const route = await SmartSwapRouter(
      SMARTSWAPROUTER[chainId as number],
      library
    );
    const dl = getDeadline(deadline);
    const from = currencies[Field.INPUT]?.wrapped.address;
    const to = currencies[Field.OUTPUT]?.wrapped.address;

    try {
      setSendingTrx(true);
      dispatch(
        setOpenModal({
          message: `Swapping ${formattedAmounts[Field.INPUT]} ${
            currencies[Field.INPUT]?.symbol
          } for ${formattedAmounts[Field.OUTPUT]} ${
            currencies[Field.OUTPUT]?.symbol
          }`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );

      const { format1, format2, format3 } = await calculateGas(
        userGasPricePercentage,
        library,
        chainId as number
      );

      const isEIP1559 = await library?.getFeeData();

      const sendTransaction = await route.swapExactTokensForTokens(
        isExactIn ? parsedAmount : formatAmount,
        // parsedAmount,
        // outputToken(),
        parsedOutput(currencies[Field.OUTPUT]?.decimals as number),
        // [from, to],
        pathArray,
        account,
        dl,
        {
          from: account,
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
      console.log({sendTransaction})
      const { confirmations, events } = await sendTransaction.wait(3);

      const { hash } = sendTransaction;
      console.log({confirmations,events,hash})
      const outputAmount = await getOutPutDataFromEvent(
        to,
        events,
        currencies[Field.OUTPUT]?.decimals
      );
      const inputAmount = await getInPutDataFromEvent(
        from,
        events,
        outputToken(),
        currencies[Field.INPUT]?.decimals
      );
      if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3) {
        setSendingTrx(false);
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        dispatch(
          setOpenModal({
            message: `Swap Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        dispatch(
          addToast({
            message: `Swap ${inputAmount} ${
              currencies[Field.INPUT]?.symbol
            } for ${outputAmount} ${currencies[Field.OUTPUT]?.symbol}`,
            URL: explorerLink,
          })
        );
        onUserInput(Field.INPUT, "");
        setShowNewChangesText(false);
      }
    } catch (e) {
      setSendingTrx(false);
      dispatch(
        setOpenModal({
          message: `Swap Failed`,
          trxState: TrxState.TransactionFailed,
        })
      );
      onUserInput(Field.INPUT, "");
    }
  };

  const swapDefaultForOtherTokens = async () => {
    const route = await SmartSwapRouter(
      SMARTSWAPROUTER[chainId as number],
      library
    );
    const dl = getDeadline(deadline);
    const from = WNATIVEADDRESSES[chainId as number];
    const to = currencies[Field.OUTPUT]?.wrapped.address;

    try {
      setSendingTrx(true);
      dispatch(
        setOpenModal({
          message: `Swapping ${formattedAmounts[Field.INPUT]} ${
            currencies[Field.INPUT]?.symbol
          } for ${formattedAmounts[Field.OUTPUT]} ${
            currencies[Field.OUTPUT]?.symbol
          }`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );
      const { format1, format2, format3 } = await calculateGas(
        userGasPricePercentage,
        library,
        chainId as number
      );
      console.log({ format1, format2, format3 });
      console.log(ethers.utils.parseUnits(format1, 9).toString(),ethers.utils.parseUnits(format2, 9).toString(),ethers.utils.parseUnits(format3, 9).toString())

      const isEIP1559 = await library?.getFeeData();
      const sendTransaction = await route.swapETHForExactTokens(
        parsedOutput(currencies[Field.OUTPUT]?.decimals as number),
        // [from, to],
        pathArray,
        account,
        dl,
        {
          value: isExactIn ? parsedAmount : formatAmount,
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

      const { hash } = sendTransaction;
      const { confirmations, events } = await sendTransaction.wait(3);

      const outputAmountForDisplay = await getOutPutDataFromEvent(
        to,
        events,
        currencies[Field.OUTPUT]?.decimals
      );
      const inputAmountForDisplay = await getInPutDataFromEvent(
        from,
        events,
        parsedAmount,
        currencies[Field.INPUT]?.decimals
      );

      if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3) {
        setSendingTrx(false);
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        dispatch(
          setOpenModal({
            message: `Swap from BNB Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        dispatch(
          addToast({
            message: `Swap ${inputAmountForDisplay} ${
              currencies[Field.INPUT]?.symbol
            } for ${outputAmountForDisplay} ${
              currencies[Field.OUTPUT]?.symbol
            }`,
            URL: explorerLink,
          })
        );
        onUserInput(Field.INPUT, "");
      }
    } catch (e) {
      console.log(e);
      setSendingTrx(false);
      dispatch(
        setOpenModal({
          message: `Swap Failed`,
          trxState: TrxState.TransactionFailed,
        })
      );
      onUserInput(Field.INPUT, "");
    }
  };

  const swapOtherTokensForDefault = async () => {
    const route = await SmartSwapRouter(
      SMARTSWAPROUTER[chainId as number],
      library
    );
    const dl = getDeadline(deadline);
    const from = currencies[Field.INPUT]?.wrapped.address;
    const to = WNATIVEADDRESSES[chainId as number];

    try {
      setSendingTrx(true);
      dispatch(
        setOpenModal({
          message: `Swapping ${formattedAmounts[Field.INPUT]} ${
            currencies[Field.INPUT]?.symbol
          } for ${formattedAmounts[Field.OUTPUT]} ${
            currencies[Field.OUTPUT]?.symbol
          }`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );
      // const web3 = createAlchemyWeb3("https://polygon-rpc.com");
      // const maxPriorityPerGas = await web3.eth.getMaxPriorityFeePerGas();
      // const baseFee = await web3.eth.getBlock("pending");
      // const baseFeeFormatted = web3.utils.hexToNumberString(
      //   baseFee.baseFeePerGas
      // );
      // const maxPriorityPerGasFormatted =
      //   web3.utils.hexToNumberString(maxPriorityPerGas);

      // const baseFeeThirtyPercent = new Percent("40", "100")
      //   .multiply(maxPriorityPerGasFormatted)
      //   .quotient.toString();

      // const addPriorityFee = JSBI.add(
      //   JSBI.BigInt(maxPriorityPerGasFormatted),
      //   JSBI.BigInt(baseFeeThirtyPercent)
      // );

      // const maxFee = JSBI.add(
      //   JSBI.BigInt(baseFeeFormatted),
      //   JSBI.BigInt(addPriorityFee.toString())
      // );

      // const format1 = ethers.utils.formatUnits(addPriorityFee.toString(), 9);
      // const format2 = ethers.utils.formatUnits(maxFee.toString(), 9);
        console.log({pathArray})

      const { format1, format2, format3 } = await calculateGas(
        userGasPricePercentage,
        library,
        chainId as number
      );

      const isEIP1559 = await library?.getFeeData();
      const sendTransaction = await route.swapExactTokensForETH(
        isExactIn ? parsedAmount : formatAmount,
        parsedOutput(currencies[Field.OUTPUT]?.decimals as number),
        // [from, to],
        pathArray,
        account,
        dl,
        chainId === 137 || chainId === 80001
          ? {
              maxPriorityFeePerGas:
                chainId === 137
                  ? ethers.utils.parseUnits(format1, 9).toString()
                  : null,
              maxFeePerGas:
                chainId === 137
                  ? ethers.utils.parseUnits(format2, 9).toString()
                  : null,
            }
          : {
              gasPrice:
                chainId === 137
                  ? null
                  : chainId === 80001
                  ? null
                  : ethers.utils.parseUnits(format3, 9).toString(),
            }
      );
      const { confirmations, events } = await sendTransaction.wait(3);
      const { hash } = sendTransaction;
      const outputAmount = await getOutPutDataFromEvent(
        to,
        events,
        currencies[Field.OUTPUT]?.decimals
      );
      const inputAmount = await getInPutDataFromEvent(
        from,
        events,
        parsedAmount,
        currencies[Field.INPUT]?.decimals
      );

      if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3) {
        setSendingTrx(false);
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        dispatch(
          setOpenModal({
            message: `Swap tokens for ${
              currencies[Field.OUTPUT]?.symbol
            } Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        GSuccessfullyTransaction(
          "straight_swap",
          "swapping",
          currencies[Field.INPUT]?.symbol,
          currencies[Field.OUTPUT]?.symbol
        );
        dispatch(
          addToast({
            message: `Swap ${inputAmount} ${
              currencies[Field.INPUT]?.symbol
            } for ${outputAmount} ${currencies[Field.OUTPUT]?.symbol}`,
            URL: explorerLink,
          })
        );
        onUserInput(Field.INPUT, "");
      }
    } catch (e:any) {
      console.log(e?.message);
      GFailedTransaction(
        "straight_swap",
        "swapping",
        e?.message,
        currencies[Field.INPUT]?.symbol,
        currencies[Field.OUTPUT]?.symbol
      );

      setSendingTrx(false);
      dispatch(
        setOpenModal({
          message: `Swap Failed`,
          trxState: TrxState.TransactionFailed,
        })
      );
      onUserInput(Field.INPUT, "");
    }
  };

  const deposit = async () => {
    const weth = await WETH(WNATIVEADDRESSES[chainId as number], library);
    setSendingTrx(true);
    dispatch(
      setOpenModal({
        message: `Swapping ${typedValue} ${
          currencies[Field.INPUT]?.symbol
        } for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    try {
      const { format1, format2, format3 } = await calculateGas(
        userGasPricePercentage,
        library,
        chainId as number
      );

      const isEIP1559 = await library?.getFeeData();
      const sendTransaction = await weth.deposit({
        value: isExactIn ? parsedAmount : formatAmount,
        maxPriorityFeePerGas:
          chainId === 137
            ? ethers.utils.parseUnits(format1, 9).toString()
            : null,
        maxFeePerGas:
          chainId === 137
            ? ethers.utils.parseUnits(format2, 9).toString()
            : null,
        gasPrice:
          chainId === 137
            ? null
            : chainId === 80001
            ? null
            : ethers.utils.parseUnits(format3, 9).toString(),
      });

      const { confirmations } = await sendTransaction.wait(3);
      const { hash } = sendTransaction;
      if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3) {
        setSendingTrx(false);
        dispatch(
          setOpenModal({
            message: `Swap Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        GSuccessfullyTransaction(
          "straight_swap",
          "swapping",
          currencies[Field.INPUT]?.symbol,
          currencies[Field.OUTPUT]?.symbol
        );
        dispatch(
          addToast({
            message: `Swap ${typedValue} ${
              currencies[Field.INPUT]?.symbol
            } for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
            URL: explorerLink,
          })
        );
        onUserInput(Field.INPUT, "");
      }
    } catch (e) {
      GFailedTransaction(
        "straight_swap",
        "swapping",
        e.message,
        currencies[Field.INPUT]?.symbol,
        currencies[Field.OUTPUT]?.symbol
      );
      console.log(e);
      setSendingTrx(false);
      dispatch(
        setOpenModal({
          message: `Swap Failed`,
          trxState: TrxState.TransactionFailed,
        })
      );
      onUserInput(Field.INPUT, "");
    }
  };

  const withdraw = async () => {
    const weth = await WETH(WNATIVEADDRESSES[chainId as number], library);
    setSendingTrx(true);
    dispatch(
      setOpenModal({
        message: `Swapping ${typedValue} ${
          currencies[Field.INPUT]?.symbol
        } for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    try {
      const { format1, format2, format3 } = await calculateGas(
        userGasPricePercentage,
        library,
        chainId as number
      );

      const isEIP1559 = await library?.getFeeData();
      const sendTransaction = await weth.withdraw(
        isExactIn ? parsedAmount : formatAmount,
        chainId === 137 || chainId === 80001
          ? {
              maxPriorityFeePerGas:
                chainId === 137
                  ? ethers.utils.parseUnits(format1, 9).toString()
                  : null,
              maxFeePerGas:
                chainId === 137
                  ? ethers.utils.parseUnits(format2, 9).toString()
                  : null,
            }
          : {
              gasPrice:
                chainId === 137
                  ? null
                  : chainId === 80001
                  ? null
                  : ethers.utils.parseUnits(format3, 9).toString(),
            }
      );
      const { confirmations } = await sendTransaction.wait(3);
      const { hash } = sendTransaction;
      if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3) {
        setSendingTrx(false);
        dispatch(
          setOpenModal({
            message: `Approval Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );
        dispatch(
          addToast({
            message: `Swap ${typedValue} ${
              currencies[Field.INPUT]?.symbol
            } for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
            URL: explorerLink,
          })
        );
        GSuccessfullyTransaction(
          "straight_swap",
          "swapping",
          currencies[Field.INPUT]?.symbol,
          currencies[Field.OUTPUT]?.symbol
        );
        onUserInput(Field.INPUT, "");
      }
    } catch (e) {
      GFailedTransaction(
        "straight_swap",
        "swapping",
        e.message,
        currencies[Field.INPUT]?.symbol,
        currencies[Field.OUTPUT]?.symbol
      );
      console.log(e);
      setSendingTrx(false);
      dispatch(
        setOpenModal({
          message: `Swap Failed`,
          trxState: TrxState.TransactionFailed,
        })
      );
      onUserInput(Field.INPUT, "");
    }
  };

  const swapTokens = async () => {
    if (
      chainId === SupportedChainId.POLYGONTEST ||
      chainId === SupportedChainId.POLYGON
    ) {
      if (
        currencies[Field.INPUT]?.symbol === "MATIC" &&
        currencies[Field.OUTPUT]?.symbol === "WMATIC"
      ) {
        await deposit();
      } else if (
        currencies[Field.INPUT]?.symbol === "WMATIC" &&
        currencies[Field.OUTPUT]?.symbol === "MATIC"
      ) {
        await withdraw();
      } else if (currencies[Field.INPUT]?.isNative) {
        await swapDefaultForOtherTokens();
      } else if (currencies[Field.OUTPUT]?.isNative) {
        await swapOtherTokensForDefault();
      } else {
        await swapDifferentTokens();
      }
    } else if (
      chainId === SupportedChainId.BINANCETEST ||
      chainId === SupportedChainId.BINANCE
    ) {
      if (
        currencies[Field.INPUT]?.symbol === "BNB" &&
        currencies[Field.OUTPUT]?.symbol === "WBNB"
      ) {
        await deposit();
      } else if (
        currencies[Field.INPUT]?.symbol === "WBNB" &&
        currencies[Field.OUTPUT]?.symbol === "BNB"
      ) {
        await withdraw();
      } else if (currencies[Field.INPUT]?.symbol === "BNB") {
        await swapDefaultForOtherTokens();
      } else if (currencies[Field.OUTPUT]?.symbol === "BNB") {
        await swapOtherTokensForDefault();
      } else {
        await swapDifferentTokens();
      }
    } else if (
      chainId === SupportedChainId.OASISTEST ||
      chainId === SupportedChainId.OASISMAINNET
    ) {
      if (
        currencies[Field.INPUT]?.symbol === "ROSE" &&
        currencies[Field.OUTPUT]?.symbol === "WROSE"
      ) {
        await deposit();
      } else if (
        currencies[Field.INPUT]?.symbol === "WROSE" &&
        currencies[Field.OUTPUT]?.symbol === "ROSE"
      ) {
        await withdraw();
      } else if (currencies[Field.INPUT]?.symbol === "ROSE") {
        await swapDefaultForOtherTokens();
      } else if (currencies[Field.OUTPUT]?.symbol === "ROSE") {
        await swapOtherTokensForDefault();
      } else {
        await swapDifferentTokens();
      }
    }
  };

  const [routeAddress, setRouteAddress] = useState([]);
  const fromAddress = currencies[Field.INPUT]?.isNative
    ? WNATIVEADDRESSES[chainId as number]
    : currencies[Field.INPUT]?.wrapped.address;
  const toAddress = currencies[Field.OUTPUT]?.isNative
    ? WNATIVEADDRESSES[chainId as number]
    : currencies[Field.OUTPUT]?.wrapped.address;
  const path = [fromAddress, toAddress];

  const checkLiquidityPair = async () => {
    const factory = await smartFactory(
      SMARTSWAPFACTORYADDRESSES[chainId as number],
      library
    );
    const LPAddress = await factory.getPair(fromAddress, toAddress);
    if (LPAddress !== ZERO_ADDRESS) {
      setRouteAddress([fromAddress, toAddress]);
    }
  };

  const [isLoadingValue, setIsLoadingValue] = useState(false);
  useEffect(() => {
    if (formattedAmounts[Field.INPUT] && !formattedAmounts[Field.OUTPUT]) {
      setIsLoadingValue(true);
    } else {
      setIsLoadingValue(false);
    }
  }, [formattedAmounts[Field.OUTPUT]]);

  return (
    <div className="Swap">
      <NewToken
        open={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        setDisplayImportedToken={handleDismissTokenWarning}
      />
      <Box
        border="1px"
        borderColor={borderColor}
        borderRadius="6px"
        h="420px"
        pl={3}
        pr={3}
      >
        <SwapSettings />
        <From
          onUserInput={handleTypeInput}
          onCurrencySelection={onCurrencySelection}
          currency={currencies[Field.INPUT]}
          otherCurrency={currencies[Field.OUTPUT]}
          onMax={handleMaxInput}
          value={formattedAmounts[Field.INPUT]}
          placeholder="0.0"
        />
        <Flex justifyContent="center" onClick={onSwitchTokens}>
          <SwitchIcon />
        </Flex>
        <To
          onCurrencySelection={onCurrencySelection}
          currency={currencies[Field.OUTPUT]}
          otherCurrency={currencies[Field.INPUT]}
          value={formattedAmounts[Field.OUTPUT]}
          onUserOutput={handleTypeOutput}
          placeholder="0.0"
        />

        <Flex alignItems="center" className="SwapToken">
          {!account ? (
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h="48px"
              p="5px"
              mt={1}
              disabled={false}
              color={color}
              bgColor={switchBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor, color: "#FFFFFF" }}
              onClick={() => {
                setDisplayNetwork((state) => !state);
                localStorage.removeItem("walletconnect");
              }}
            >
              Connect Wallet
            </Button>
          ) : insufficientBalance || inputError ? (
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h="48px"
              p="5px"
              mt={1}
              disabled={inputError !== undefined || insufficientBalance}
              color={inputError ? color : "#FFFFFF"}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
            >
              {inputError
                ? inputError
                : `Insufficient ${currencies[Field.INPUT]?.symbol} Balance`}
            </Button>
          ) : !hasBeenApproved ? (
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h="48px"
              p="5px"
              mt={1}
              disabled={inputError !== undefined || insufficientBalance}
              color={inputError ? color : "#FFFFFF"}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
              onClick={() => {
                GButtonClick(
                  "straight_swap",
                  "approve tokens",
                  currencies[Field.INPUT]?.symbol
                );
                approveSwap();
              }}
            >
              Approve Transaction
            </Button>
          ) : inputError ? (
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h="48px"
              p="5px"
              mt={1}
              disabled={true}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
            >
              {inputError}
            </Button>
          ) : (
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h="48px"
              p="5px"
              mt={1}
              disabled={inputError !== undefined || insufficientBalance}
              color={inputError ? color : "#FFFFFF"}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
              onClick={() => {
                GButtonClick(
                  "straight_swap",
                  "swapping",
                  currencies[Field.INPUT]?.symbol,
                  currencies[Field.OUTPUT]?.symbol
                );

                setCurrentToPrice(receivedAmount);
                setShowModal(!showModal);
              }}
            >
              Swap Tokens
            </Button>
          )}

          <NetworkModal
            displayNetwork={displayNetwork}
            setDisplayNetwork={setDisplayNetwork}
          />
        </Flex>
        <ConfirmModal
          showModal={showModal}
          setShowModal={setShowModal}
          from={currencies[Field.INPUT]?.symbol}
          to={currencies[Field.OUTPUT]?.symbol}
          title={"Confirm Swap"}
          inputLogo={currencies[Field.INPUT]?.logoURI}
          outputLogo={currencies[Field.OUTPUT]?.logoURI}
          minRecieved={minimum}
          slippage={Number(allowedSlippage / 100)}
          fromDeposited={formattedAmounts[Field.INPUT]}
          toDeposited={receivedAmount}
          handleSwap={swapTokens}
          showNewChangesText={showNewChangesText}
          fee={LPFee}
          priceImpact={priceImpact}
          pathSymbol={pathSymbol}
        />
      </Box>
    </div>
  );
};

export default SendToken;

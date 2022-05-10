import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Flex,
  Box,
  useColorModeValue,
  Text,
  Input,
  Button,
  useMediaQuery,
  Img,
} from "@chakra-ui/react";
import { ArrowBackIcon, TimeIcon } from "@chakra-ui/icons";
import { SettingsIcon } from "../../theme/components/Icons";
import {
  useGetLiquidityById,
  useTokenValueToBeRemoved,
} from "../../utils/hooks/usePools";
import { useHistory, useParams } from "react-router";
import NullImage from "../../assets/Null-24.svg";
import { LiquidityPairInstance, SmartSwapRouter } from "../../utils/Contracts";
import { SMARTSWAPROUTER } from "../../utils/addresses";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { addToast } from "../../components/Toast/toastSlice";
import { getExplorerLink, ExplorerDataType } from "../../utils/getExplorerLink";
import { useDispatch } from "react-redux";
import {
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from "../../state/user/hooks";
import { calculateSlippageAmount } from "../../utils/calculateSlippageAmount";
import {
  getDeadline,
  isNative,
  formatAmountIn,
  getOutPutDataFromEvent,
  getDecimals,
} from "../../utils/utilsFunctions";
import { ethers } from "ethers";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import CurrencyLogo from "../../components/currencyLogo";
import { isAddress } from "../../utils";
import TransactionSettings from "../../components/TransactionSettings";
import { calculateGas } from "../Swap/components/sendToken";
import {
  useUpdateUserGasPreference,
  useUserGasPricePercentage,
} from "../../state/gas/hooks";
import { clearSearchResult } from "../../state/farming/action";
import { GFailedTransaction, GSuccessfullyTransaction } from "../../components/G-analytics/gIndex";

const Remove = () => {
  const [isTabDevice] = useMediaQuery("(min-width: 990px)");
  const [isTabDevice2] = useMediaQuery("(max-width: 1200px)");

  const borderColor = useColorModeValue("#DEE5ED", "#324D68");
  const topIcons = useColorModeValue("#666666", "#DCE6EF");
  const titleColor = useColorModeValue("#666666", "#DCE5EF");
  const positionBgColor = useColorModeValue("#F2F5F8", "#213345");
  const positiontextColor = useColorModeValue("#666666", "#DCE5EF");
  const pairTextColor = useColorModeValue("#333333", "#F1F5F8");
  const pairinformationBgColor = useColorModeValue("#FFFFFF", "#15202B");
  const pairinformationBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const approveButtonColor = useColorModeValue("#FFFFFF", "#FFFFFF");
  const WithdrawalButtonColor = useColorModeValue("#FFFFFF", "#FFFFFF");
  const approveButtonBgColor = useColorModeValue("#319EF6", "#4CAFFF");
  const withdrawaButtonBgColor = useColorModeValue("#FFFFFF", "#15202B");
  const hoverwithdrawaButtonBgColor = useColorModeValue("#15202B", "#7599BD");
  const inActiveApproveButtonBgColor = useColorModeValue("#999999", "#7599BD");
  const inActiveApproveButtonColor = useColorModeValue("#CCCCCC", "#4A739B");
  const approvedButtonColor = useColorModeValue("#3CB1D2", "#1B90B1");
  const approvedButtonBgColor = useColorModeValue("#FFFFFF", "#15202B");
  const approvedButtonBorderColor = useColorModeValue("#3CB1D2", "#1B90B1");
  const [inputValue, setInputValue] = useState("");
  const [pool, setPool] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [hasBeenApproved, setHasBeenApproved] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const { account, chainId, library } = useActiveWeb3React();
  const [userSlippageTolerance] = useUserSlippageTolerance();
  const [userDeadline] = useUserTransactionTTL();
  useUpdateUserGasPreference();
  const [userGasPricePercentage, setUserGasPricePercentage] =
    useUserGasPricePercentage();

  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const clearSearchedData = useCallback(() => {
    dispatch(clearSearchResult());
  }, []);

  useMemo(() => {
    clearSearchedData();
  }, [chainId]);

  const data = useGetLiquidityById(
    params.currencyIdA,
    params.currencyIdB,
    hasBeenApproved,
    loadData
  );

  const valuesToBeRemoved = useTokenValueToBeRemoved({ pool, inputValue });

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const details = await data;
      if (details && !cancel) {
        try {
          setHasBeenApproved(details.approved);
          setPool(details.LiquidityPairData);
          setLoading(details.loading);
        } catch (err) {
          console.log(err);
          setPool([]);
        }
      }
    };
    load();
    return () => {
      cancel = true;
    };
  }, [data, hasBeenApproved]);

  const RemoveLiquidity = () => {
    if (
      isNative(pool?.path[0].token, chainId as number) ||
      isNative(pool?.path[1].token, chainId as number)
    ) {
      if (valuesToBeRemoved) {
        const tokenAddress = isNative(pool?.path[0].token, chainId as number)
          ? pool?.path[1].toPath
          : pool?.path[0].fromPath;
        removeLiquidityForETH(
          valuesToBeRemoved[5] as string,
          tokenAddress,
          valuesToBeRemoved[3] as string,
          valuesToBeRemoved[4] as string,
          pool?.path[0].decimals,
          pool?.path[1].decimals
        );
      }
    } else {
      if (valuesToBeRemoved) {
        removeLiquidityForToken(
          valuesToBeRemoved[5] as string,
          pool?.path[0].fromPath,
          pool?.path[1].toPath,
          valuesToBeRemoved[3] as string,
          valuesToBeRemoved[4] as string,
          pool?.path[0].decimals,
          pool?.path[1].decimals
        );
      }
    }
  };

  const removeLiquidityForToken = async (
    liquidity: string,
    tokenA: string,
    tokenB: string,
    AmountAMin: string,
    AmountBMin: string,
    tokenADecimals: number,
    tokenBDecimals: number
  ) => {
    if (account && valuesToBeRemoved) {
      const smartswaprouter = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      // const Liquidity = formatAmountIn(valuesToBeRemoved[2], 18);
      // const amountAMin = formatAmountIn(valuesToBeRemoved[0], tokenADecimals);
      // const amountBMin = formatAmountIn(valuesToBeRemoved[1], tokenBDecimals);

      const decimalA = await getDecimals(params.currencyIdA, library);
      const decimalB = await getDecimals(params.currencyIdB, library);

      const formatAmountAMin = ethers.utils.formatUnits(AmountAMin, decimalA);
      const formatAmountBMin = ethers.utils.formatUnits(AmountBMin, decimalB);

      const deadLine = getDeadline(userDeadline);
      try {
        dispatch(
          setOpenModal({
            message: `Removing ${parseFloat(formatAmountAMin).toFixed(6)} ${
              pool?.path[0].token
            } and ${parseFloat(formatAmountBMin).toFixed(6)} ${
              pool?.path[1].token
            } `,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();
        const remove = await smartswaprouter.removeLiquidity(
          tokenA,
          tokenB,
          liquidity,
          calculateSlippageAmount(AmountAMin, userSlippageTolerance),
          calculateSlippageAmount(AmountBMin, userSlippageTolerance),
          account,
          deadLine,
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
        const { confirmations, events } = await remove.wait(1);
        const outPutValueForTokenA = await getOutPutDataFromEvent(
          pool.path[0].fromPath,
          events,
          pool.path[0].decimals
        );

        const outPutValueForTokenB = await getOutPutDataFromEvent(
          pool.path[1].toPath,
          events,
          pool.path[1].decimals
        );

        const { hash } = remove;
        if (confirmations >= 1) {
          setLoadData(true);
          setInputValue("");
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          GSuccessfullyTransaction("liquidity","remove liquidity", pool?.path[0].token, pool?.path[1].token)
          dispatch(
            setOpenModal({
              message: `${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            /
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } LP token Removal`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          dispatch(
            addToast({
              message: `Remove ${outPutValueForTokenA} ${pool?.path[0].token} 
                and ${outPutValueForTokenB} `,
              URL: explorerLink,
            })
          );
        }
      } catch (err:any) {
        console.log(err);
        GFailedTransaction("liquidity","remove liquidity",err?.message, pool?.path[0].token, pool?.path[1].token)
        dispatch(
          setOpenModal({
            message: `${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token Removal`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const removeLiquidityForETH = async (
    liquidity: string,
    tokenAddress: any,
    AmountAMin: string,
    AmountBMin: string,
    tokenADecimals: number,
    tokenBDecimals: number
  ) => {
    if (account && valuesToBeRemoved) {
      const smartswaprouter = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      // const liquidity = formatAmountIn(Liquidity, 18);
      const decimalA = await getDecimals(params.currencyIdA, library);
      const decimalB = await getDecimals(params.currencyIdB, library);

      const formatAmountAMin = ethers.utils.formatUnits(AmountAMin, decimalA);
      const formatAmountBMin = ethers.utils.formatUnits(AmountBMin, decimalB);

      // const AmountAMin = formatAmountIn(amountAMin, tokenADecimals);

      // const AmountBMin = formatAmountIn(amountBMin, tokenBDecimals);

      const deadLine = getDeadline(userDeadline);

      try {
        dispatch(
          setOpenModal({
            message: ` Removing ${parseFloat(formatAmountAMin).toFixed(6)} ${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
           and ${parseFloat(formatAmountBMin).toFixed(6)}
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } `,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();
        const remove = await smartswaprouter.removeLiquidityETH(
          tokenAddress,
          liquidity,
          isNative(pool?.path[0].token, chainId as number)
            ? calculateSlippageAmount(AmountBMin, userSlippageTolerance)
            : calculateSlippageAmount(AmountAMin, userSlippageTolerance),

          isNative(pool?.path[0].token, chainId as number)
            ? calculateSlippageAmount(AmountAMin, userSlippageTolerance)
            : calculateSlippageAmount(AmountBMin, userSlippageTolerance),

          account,
          deadLine,
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
        const { confirmations, events } = await remove.wait(1);
        const outPutValueForTokenA = await getOutPutDataFromEvent(
          pool.path[0].fromPath,
          events,
          pool.path[0].decimals
        );

        const outPutValueForTokenB = await getOutPutDataFromEvent(
          pool.path[1].toPath,
          events,
          pool.path[1].decimals
        );
        const { hash } = remove;
        if (confirmations >= 1) {
          setLoadData(true);
          setInputValue("");
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          dispatch(
            setOpenModal({
              message: `Transaction Successful`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          GSuccessfullyTransaction("liquidity","remove liquidity", pool?.path[0].token, pool?.path[1].token)
          dispatch(
            addToast({
              message: `Remove ${outPutValueForTokenA} ${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            and ${outPutValueForTokenB}
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } `,
              URL: explorerLink,
            })
          );
        }
      } catch (err:any) {
        console.log(err);
        GFailedTransaction("liquidity","remove liquidity",err?.message, pool?.path[0].token, pool?.path[1].token)
        dispatch(
          setOpenModal({
            message: `${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token Removal`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const approveLPTokens = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WMATIC"
                ? "MATIC"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WMATIC"
              ? "MATIC"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token Approval`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const smartSwapLP = await LiquidityPairInstance(
          pool.pairAddress,
          library
        );
        const walletBal = (await smartSwapLP.balanceOf(account)) + 4e18;
        const approveTransaction = await smartSwapLP.approve(
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
          GSuccessfullyTransaction("liquidity","approve liquidity removal", pool?.path[0].token, pool?.path[1].token)
          dispatch(
            setOpenModal({
              message: `${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WMATIC"
                  ? "MATIC"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            /
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WMATIC"
                ? "MATIC"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } LP token Approval`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          dispatch(
            addToast({
              message: `Approve ${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WMATIC"
                  ? "MATIC"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            /
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WMATIC"
                ? "MATIC"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } LP token`,
              URL: explorerLink,
            })
          );
        }
      } catch (e:any) {
        console.log(e);
        GFailedTransaction("liquidity","remove liquidity",e.message, pool?.path[0].token, pool?.path[1].token)
        dispatch(
          setOpenModal({
            message: `${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WMATIC"
                ? "MATIC"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WMATIC"
              ? "MATIC"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token Approval`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const removeApproval = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Removing approval for ${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WMATIC"
                ? "MATIC"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WMATIC"
              ? "MATIC"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const smartSwapLP = await LiquidityPairInstance(
          pool.pairAddress,
          library
        );
        const approveTransaction = await smartSwapLP.approve(
          SMARTSWAPROUTER[chainId as number],
          0,
          {
            from: account,
          }
        );
        const { confirmations } = await approveTransaction.wait(1);
        const { hash } = approveTransaction;
        if (confirmations >= 1) {
          setHasBeenApproved(false);
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          GSuccessfullyTransaction("liquidity","approve liquidity removal", pool?.path[0].token, pool?.path[1].token)
          dispatch(
            setOpenModal({
              message: `Removing approval for ${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WMATIC"
                  ? "MATIC"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            /
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WMATIC"
                ? "MATIC"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } LP token`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          dispatch(
            addToast({
              message: `UnApprove ${
                pool?.path[0].token === "WBNB"
                  ? "BNB"
                  : pool?.path[0].token === "WETH"
                  ? "ETH"
                  : pool?.path[0].token === "WMATIC"
                  ? "MATIC"
                  : pool?.path[0].token === "WROSE"
                  ? "ROSE"
                  : pool?.path[0].token === "wROSE"
                  ? "ROSE"
                  : pool?.path[0].token
              }
            /
            ${
              pool?.path[1].token === "WBNB"
                ? "BNB"
                : pool?.path[1].token === "WETH"
                ? "ETH"
                : pool?.path[1].token === "WMATIC"
                ? "MATIC"
                : pool?.path[1].token === "WROSE"
                ? "ROSE"
                : pool?.path[1].token === "wROSE"
                ? "ROSE"
                : pool?.path[1].token
            } LP token`,
              URL: explorerLink,
            })
          );
        }
      } catch (e:any) {
        console.log(e);
        GFailedTransaction("liquidity","approve liquidity",e.message, pool?.path[0].token, pool?.path[1].token)
        dispatch(
          setOpenModal({
            message: `Removing approval for ${
              pool?.path[0].token === "WBNB"
                ? "BNB"
                : pool?.path[0].token === "WETH"
                ? "ETH"
                : pool?.path[0].token === "WMATIC"
                ? "MATIC"
                : pool?.path[0].token === "WROSE"
                ? "ROSE"
                : pool?.path[0].token === "wROSE"
                ? "ROSE"
                : pool?.path[0].token
            }
          /
          ${
            pool?.path[1].token === "WBNB"
              ? "BNB"
              : pool?.path[1].token === "WETH"
              ? "ETH"
              : pool?.path[1].token === "WMATIC"
              ? "MATIC"
              : pool?.path[1].token === "WROSE"
              ? "ROSE"
              : pool?.path[1].token === "wROSE"
              ? "ROSE"
              : pool?.path[1].token
          } LP token`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  return (
    <Flex minH='100vh' mt={10} justifyContent='center'>
      <Box
        h={isTabDevice && isTabDevice2 ? "620px" : "630px"}
        mx={4}
        w={["100%", "100%", "45%", "29.5%"]}
        border='1px'
        borderColor={borderColor}
        borderRadius='6px'
        py={2}
        px={4}
      >
        <Flex flexDirection='column'>
          <Flex justifyContent='space-between' alignItems='center'>
            <Flex alignItems='center'>
              <ArrowBackIcon
                w={6}
                h={6}
                fontWeight='thin'
                color={topIcons}
                cursor='pointer'
                mr={3}
                onClick={() => history.goBack()}
              />
              <Text color={titleColor} fontSize='18px'>
                Back to Liquidity Positions
              </Text>
            </Flex>
            <Flex alignItems='center'>
              <Flex mt={3}>
                <TransactionSettings />
              </Flex>
              <TimeIcon ml={1} w='22px' h='22px' color={topIcons} />
            </Flex>
          </Flex>
          <Box
            bgColor={positionBgColor}
            mt='3'
            border='1px'
            borderRadius='6px'
            borderColor={borderColor}
            h={"220px"}
          >
            {loading ? (
              <Flex
                w='100%'
                h='100%'
                justifyContent='center'
                alignItems='center'
              >
                <Text color={positiontextColor} textAlign='center'>
                  Loading...
                </Text>
              </Flex>
            ) : pool.length === 0 ? (
              <Flex
                w='100%'
                h='100%'
                justifyContent='center'
                alignItems='center'
              >
                <Text color={positiontextColor} textAlign='center'>
                  Liquidity not found
                </Text>
              </Flex>
            ) : (
              <Flex p={3} flexDirection='column'>
                <Flex justifyContent='flex-start'>
                  <Text color={positiontextColor} fontWeight='bold'>
                    Your Position
                  </Text>
                </Flex>
                <Flex mt={2} justifyContent='space-between'>
                  <Flex alignItems='center'>
                    <Flex
                      mr={isTabDevice && isTabDevice2 ? "" : 2}
                      alignItems='center'
                    >
                      <CurrencyLogo
                        currency={{
                          ...pool.path[0],
                          chainId,
                          address: isAddress(pool.path[0].fromPath),
                          isToken: !!isAddress(pool.path[0]?.fromPath),
                          isNative: !isAddress(pool.path[0]?.fromPath),
                          symbol: pool.path[0]?.token,
                        }}
                        size={24}
                        squared={true}
                        marginRight={4}
                      />

                      <CurrencyLogo
                        currency={{
                          ...pool.path[1],
                          chainId,
                          address: isAddress(pool.path[1].toPath),
                          isToken: !!isAddress(pool.path[1]?.toPath),
                          isNative: !isAddress(pool.path[1]?.toPath),
                          symbol: pool.path[1]?.token,
                        }}
                        size={24}
                        squared={true}
                      />
                    </Flex>
                    <Text
                      fontWeight='bold'
                      mr={isTabDevice && isTabDevice2 ? 4 : ""}
                      ml={isTabDevice && isTabDevice2 ? 4 : ""}
                      color={pairTextColor}
                    >
                      {pool?.path[0].token === "WBNB"
                        ? "BNB"
                        : pool?.path[0].token === "WETH"
                        ? "ETH"
                        : pool?.path[0].token === "WMATIC"
                        ? "MATIC"
                        : pool?.path[0].token === "WROSE"
                        ? "ROSE"
                        : pool?.path[0].token === "wROSE"
                        ? "ROSE"
                        : pool?.path[0].token}{" "}
                      /{" "}
                      {pool?.path[1].token === "WBNB"
                        ? "BNB"
                        : pool?.path[1].token === "WETH"
                        ? "ETH"
                        : pool?.path[1].token === "WMATIC"
                        ? "MATIC"
                        : pool?.path[1].token === "WROSE"
                        ? "ROSE"
                        : pool?.path[1].token === "wROSE"
                        ? "ROSE"
                        : pool?.path[1].token}
                    </Text>
                  </Flex>
                  <Flex alignItems='center'>
                    <Text
                      mr={isTabDevice && isTabDevice2 ? 4 : 2}
                      fontWeight='bold'
                      color={pairTextColor}
                    >
                      {parseFloat(pool?.poolToken).toFixed(7)}
                    </Text>
                    <Text fontSize='12px' color={titleColor}>
                      Pool Tokens
                    </Text>
                  </Flex>
                </Flex>
                <Box
                  mt={4}
                  border='1px'
                  borderColor={pairinformationBorderColor}
                  bgColor={pairinformationBgColor}
                  borderRadius='6px'
                  p='3'
                  h='120px'
                >
                  <Flex
                    color={pairTextColor}
                    fontSize='14px'
                    flexDirection='column'
                  >
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      mb={3}
                    >
                      <Text>
                        Pooled{" "}
                        {pool?.path[0].token === "WBNB"
                          ? "BNB"
                          : pool?.path[0].token === "WETH"
                          ? "ETH"
                          : pool?.path[0].token === "WMATIC"
                          ? "MATIC"
                          : pool?.path[0].token === "WROSE"
                          ? "ROSE"
                          : pool?.path[0].token === "wROSE"
                          ? "ROSE"
                          : pool?.path[0].token}
                        :
                      </Text>
                      <Text>{pool?.pooledToken0}</Text>
                    </Flex>
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      mb={3}
                    >
                      <Text>
                        Pooled{" "}
                        {pool?.path[1].token === "WBNB"
                          ? "BNB"
                          : pool?.path[1].token === "WETH"
                          ? "ETH"
                          : pool?.path[1].token === "WMATIC"
                          ? "MATIC"
                          : pool?.path[1].token === "WROSE"
                          ? "ROSE"
                          : pool?.path[1].token === "wROSE"
                          ? "ROSE"
                          : pool?.path[1].token}
                        :
                      </Text>
                      <Text>{pool?.pooledToken1}</Text>
                    </Flex>
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      mb={3}
                    >
                      <Text>Your pool share:</Text>
                      <Text>{parseFloat(pool?.poolShare).toFixed(6)}%</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            )}
          </Box>
          <Box
            mt={3}
            bgColor={pairinformationBgColor}
            border='1px'
            borderColor={pairinformationBorderColor}
            borderRadius='6px'
            h='95px'
            p='3'
          >
            <Flex flexDirection='column'>
              <Flex mb={2} justifyContent='flex-start'>
                <Text color={positiontextColor} fontSize='14px'>
                  Amount to be removed
                </Text>
              </Flex>
              <Flex justifyContent='space-between' alignItems='center'>
                <Input
                  focusBorderColor='none'
                  fontSize='24px'
                  p='0'
                  border='none'
                  value={inputValue}
                  placeholder='0.00'
                  onChange={(e) => {
                    let input = e.target.value;
                    let regex = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/;
                    if (e.target.value === "" || regex.test(input)) {
                      setInputValue(input);
                    }
                  }}
                />
                <Text color={pairTextColor} fontWeight='bold' fontSize='24px'>
                  %
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Box
            mt={3}
            mb={3}
            bgColor={pairinformationBgColor}
            border='1px'
            borderColor={pairinformationBorderColor}
            borderRadius='6px'
            h='140px'
            p='3'
          >
            <Flex flexDirection='column'>
              <Flex mb={2} justifyContent='flex-start'>
                <Text color={positiontextColor} fontSize='14px'>
                  Amount to be received
                </Text>
              </Flex>
              <Flex justifyContent='space-between'>
                <Flex
                  w='46%'
                  border='1px'
                  borderColor={pairinformationBorderColor}
                  borderRadius='6px'
                  h='76px'
                  bgColor={positionBgColor}
                  p={3}
                  alignItems='center'
                >
                  {loading || pool.length === 0 ? (
                    <Img w='24px' h='24px' mr={2} mb={3} src={NullImage} />
                  ) : (
                    <CurrencyLogo
                      currency={{
                        ...pool.path[0],
                        chainId,
                        address: isAddress(pool.path[0].fromPath),
                        isToken: !!isAddress(pool.path[0]?.fromPath),
                        isNative: !isAddress(pool.path[0]?.fromPath),
                        symbol: pool.path[0]?.token,
                      }}
                      size={24}
                      squared={true}
                      marginBottom={12}
                      marginRight={8}
                    />
                  )}

                  <Flex flexDirection='column'>
                    <Text fontWeight='bold' color={pairTextColor}>
                      {valuesToBeRemoved
                        ? valuesToBeRemoved[0].toFixed(6)
                        : "-"}
                    </Text>
                    <Text color={titleColor} fontSize='12px'>
                      {loading || pool.length === 0
                        ? ""
                        : pool?.path[0].token === "WBNB"
                        ? "BNB"
                        : pool?.path[0].token === "WETH"
                        ? "ETH"
                        : pool?.path[0].token === "WMATIC"
                        ? "MATIC"
                        : pool?.path[0].token === "WROSE"
                        ? "ROSE"
                        : pool?.path[0].token === "wROSE"
                        ? "ROSE"
                        : pool?.path[0].token}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  w='46%'
                  border='1px'
                  borderColor={pairinformationBorderColor}
                  borderRadius='6px'
                  h='76px'
                  bgColor={positionBgColor}
                  p={3}
                  alignItems='center'
                >
                  {loading || pool.length === 0 ? (
                    <Img w='24px' h='24px' mr={2} mb={3} src={NullImage} />
                  ) : (
                    <CurrencyLogo
                      currency={{
                        ...pool.path[1],
                        chainId,
                        address: isAddress(pool.path[1].toPath),
                        isToken: !!isAddress(pool.path[1]?.toPath),
                        isNative: !isAddress(pool.path[1]?.toPath),
                        symbol: pool.path[1]?.token,
                      }}
                      size={24}
                      squared={true}
                      marginBottom={12}
                      marginRight={8}
                    />
                  )}

                  <Flex flexDirection='column'>
                    <Text fontWeight='bold' color={pairTextColor}>
                      {valuesToBeRemoved
                        ? valuesToBeRemoved[1].toFixed(6)
                        : "-"}
                    </Text>
                    <Text color={titleColor} fontSize='12px'>
                      {loading || pool.length === 0
                        ? ""
                        : pool?.path[1].token === "WBNB"
                        ? "BNB"
                        : pool?.path[1].token === "WETH"
                        ? "ETH"
                        : pool?.path[1].token === "WMATIC"
                        ? "MATIC"
                        : pool?.path[1].token === "WROSE"
                        ? "ROSE"
                        : pool?.path[1].token === "wROSE"
                        ? "ROSE"
                        : pool?.path[1].token}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Flex justifyContent='space-between'>
            <Button
              h='45px'
              color={
                hasBeenApproved && inputValue
                  ? approvedButtonColor
                  : inputValue
                  ? approveButtonColor
                  : inActiveApproveButtonColor
              }
              bgColor={
                hasBeenApproved && inputValue
                  ? "transparent"
                  : inputValue
                  ? approveButtonBgColor
                  : inActiveApproveButtonBgColor
              }
              _active={{
                bgColor:
                  hasBeenApproved && inputValue
                    ? approvedButtonBgColor
                    : inputValue
                    ? approveButtonBgColor
                    : inActiveApproveButtonBgColor,
              }}
              _hover={{
                bgColor: hasBeenApproved
                  ? approvedButtonBgColor
                  : inputValue
                  ? approveButtonBgColor
                  : inActiveApproveButtonBgColor,
              }}
              borderRadius='6px'
              w='46%'
              fontSize={isTabDevice && isTabDevice2 ? "12px" : ""}
              border={hasBeenApproved && inputValue ? "1px" : ""}
              borderColor={approvedButtonBorderColor}
              disabled={inputValue === ""}
              onClick={
                hasBeenApproved && inputValue
                  ? () => {
                      removeApproval();
                    }
                  : !hasBeenApproved && inputValue
                  ? () => {
                      approveLPTokens();
                    }
                  : undefined
              }
            >
              {hasBeenApproved && inputValue ? "Approved" : "Approve"}
            </Button>
            <Button
              h='45px'
              w='46%'
              borderRadius='6px'
              color={WithdrawalButtonColor}
              bgColor={
                hasBeenApproved
                  ? approveButtonBgColor
                  : inputValue && hasBeenApproved
                  ? approveButtonBgColor
                  : "transparent"
              }
              _active={{ bgColor: withdrawaButtonBgColor }}
              _hover={{ bgColor: hoverwithdrawaButtonBgColor }}
              px={14}
              fontSize={isTabDevice && isTabDevice2 ? "12px" : ""}
              onClick={() => RemoveLiquidity()}
              disabled={!hasBeenApproved || inputValue === ""}
            >
              <Text>
                {inputValue === "" ? "Enter an amount" : "Confirm Withdrawal"}
              </Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Remove;

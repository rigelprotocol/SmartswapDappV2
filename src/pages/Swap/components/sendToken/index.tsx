import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, Flex, useColorModeValue} from '@chakra-ui/react';
import SwapSettings from './SwapSettings';
import From from './From';
import To from './To';
import {SwitchIcon} from '../../../../theme/components/Icons';
import {
    useDefaultsFromURLSearch,
    useDerivedSwapInfo,
    useSwapActionHandlers,
    useSwapState
} from '../../../../state/swap/hooks';
import {useCurrency} from '../../../../hooks/Tokens';
import ConfirmModal from "../../modals/confirmModal";
import {Field} from "../../../../state/swap/actions";
import {maxAmountSpend} from "../../../../utils/maxAmountSpend";
import {useUserSlippageTolerance} from "../../../../state/user/hooks";
import {useDispatch, useSelector} from "react-redux";
import {setOpenModal, TrxState} from "../../../../state/application/reducer";
import {ApprovalRouter, ApproveCheck, SmartSwapRouter, WETH} from "../../../../utils/Contracts";
import {useActiveWeb3React} from "../../../../utils/hooks/useActiveWeb3React";
import {SMARTSWAPROUTER, WNATIVEADDRESSES} from "../../../../utils/addresses";
import {ExplorerDataType, getExplorerLink} from "../../../../utils/getExplorerLink";
import {addToast} from '../../../../components/Toast/toastSlice';
import {RootState} from "../../../../state";
import {getDeadline, getInPutDataFromEvent, getOutPutDataFromEvent} from "../../../../constants";
import {ethers} from "ethers";
import {GetAddressTokenBalance} from "../../../../state/wallet/hooks";
import {SupportedChainId} from "../../../../constants/chains"

const SendToken = () => {

  const loadedUrlParams = useDefaultsFromURLSearch();
    const dispatch = useDispatch();

 // token warning stuff
 const [loadedInputCurrency] = [
  useCurrency(loadedUrlParams?.inputCurrencyId),
  // useCurrency(loadedUrlParams?.outputCurrencyId),
];
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const color = useColorModeValue('#999999', '#7599BD');
  const lightmode = useColorModeValue(true, false);
  const switchBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgcolor = useColorModeValue('#319EF6', '#4CAFFF');

  const [showModal, setShowModal] = useState(false);

  const {onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const { currencies, getMaxValue, bestTrade, parsedAmount, inputError, showWrap } = useDerivedSwapInfo();
  const { independentField, typedValue } = useSwapState();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

    const [allowedSlippage] = useUserSlippageTolerance();

    const deadline = useSelector<RootState, number>((state) => state.user.userDeadline);

  const parsedAmounts = useMemo(
      () =>
          showWrap
              ? {
                [Field.INPUT]: typedValue,
                [Field.OUTPUT]: typedValue,
              }
              :
              {
                [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : bestTrade,
                [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : bestTrade,
              },
      [independentField, parsedAmount, showWrap, bestTrade]
  );

  const {chainId, account} = useActiveWeb3React();
  const [priceImpact, setPriceImpact] = useState(0);

  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT]);
    const maxAmountInput = maxAmountSpend(value,currencies[Field.INPUT]);
    if(maxAmountInput){
      onUserInput(Field.INPUT, maxAmountInput);

    }
  };
  const handleTypeInput = useCallback(
      (value: string) => {
        onUserInput(Field.INPUT, value)
      },
      [onUserInput],
  );

    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput],
    );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
        ? parsedAmounts[independentField] ?? ''//?.toExact() ?? ''
        : parsedAmounts[dependentField] ?? '' //?.toSignificant(6) ?? '',
  };

    const minimumAmountToReceive = useCallback(
        () => ((100 - Number(allowedSlippage / 100)) / 100) * Number(formattedAmounts[Field.OUTPUT]),
        [allowedSlippage, bestTrade],
    );

    const minimum = minimumAmountToReceive().toFixed(16);
    console.log(minimum);

    const LPFee = (0.003 * Number(formattedAmounts[Field.INPUT])).toFixed(4);

    const receivedAmount = Number(formattedAmounts[Field.OUTPUT]).toFixed(4);

    const parsedOutput = ethers.utils.parseEther(minimum.toString()).toString();
    console.log(parsedOutput);

    console.log(parsedAmount);

    const [hasBeenApproved, setHasBeenApproved] = useState(false);
    const [insufficientBalance, setInsufficientBalance] = useState(false);

    const [balance] = GetAddressTokenBalance(currencies[Field.INPUT] ?? undefined);

    useEffect(() => {
        if ((balance) < parseFloat(formattedAmounts[Field.INPUT])) {
            setInsufficientBalance(true)
        } else {
            setInsufficientBalance(false)
        }
    }, [balance, formattedAmounts[Field.INPUT]]);



    const checkApproval = async () => {
        if (currencies[Field.INPUT]?.isNative) {
            return setHasBeenApproved(true)
        }
        // @ts-ignore
        const status = await ApproveCheck(currencies[Field.INPUT].wrapped.address);
        const check = await status.allowance(account, SMARTSWAPROUTER[chainId as number], {
            from: account
        });
        const approveBalance = ethers.utils.formatEther(check).toString();
        console.log(approveBalance);
        if (parseFloat(approveBalance) > Number(formattedAmounts[Field.INPUT])) {
            return setHasBeenApproved(true)
        }
        return setHasBeenApproved(false)
    };

    useEffect(() => {
        if (!inputError) {
            checkApproval()
        }
    }, [inputError]);

  const approveSwap = async () => {
      if (currencies[Field.INPUT]?.isNative) {
          return setHasBeenApproved(true);
      }
      try {
          dispatch(setOpenModal({
              message: `Approve Tokens for Swap`,
              trxState: TrxState.WaitingForConfirmation
          }));
          // @ts-ignore
          const address = currencies[Field.INPUT].wrapped.address;
          const swapApproval = await ApprovalRouter(address);
          const approveTransaction = await swapApproval.approve(SMARTSWAPROUTER[chainId as number], parsedAmount, {
              from: account
          });
          const { confirmations } = await approveTransaction.wait(1);
          const { hash } = approveTransaction;
          if (confirmations >= 1) {
              setHasBeenApproved(true);
              const explorerLink = getExplorerLink(
                  chainId as number,
                  hash,
                  ExplorerDataType.TRANSACTION
              );
              dispatch(setOpenModal({
                  message : `Approval Successful.`,
                  trxState: TrxState.TransactionSuccessful
              }));
              dispatch(
                  addToast({
                  message: `Swap approval successful`,
                      URL: explorerLink
              }))
          }


      } catch (e) {
          console.log(e);
          dispatch(setOpenModal({
              message: `Swap Approval Confirmation`,
              trxState: TrxState.TransactionFailed
          }))
      }
  };

  const [sendingTrx, setSendingTrx] = useState(false);

  const swapDifferentTokens = async () => {
      const route = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
      const dl = getDeadline(deadline);
      const from = currencies[Field.INPUT]?.wrapped.address;
      const to = currencies[Field.OUTPUT]?.wrapped.address;
      try {
          setSendingTrx(true);
          dispatch(setOpenModal({
              message: `Swapping ${formattedAmounts[Field.INPUT]} ${currencies[Field.INPUT]?.symbol} for ${formattedAmounts[Field.OUTPUT]} ${currencies[Field.OUTPUT]?.symbol}`,
              trxState: TrxState.WaitingForConfirmation
          }));
          const sendTransaction = await route.swapExactTokensForTokens(
              parsedAmount,
              parsedOutput,
              [from, to],
              account,
              dl,
              {
                  from: account,
                  gasLimit: 290000,
                  gasPrice: ethers.utils.parseUnits('10', 'gwei')
              }
          );
          const {hash} = sendTransaction;
          const { confirmations, status } = await sendTransaction.wait(3);
          const receipt = await sendTransaction.wait();
          const outputAmount = await getOutPutDataFromEvent(to, receipt.events);
          const inputAmount = await getInPutDataFromEvent(from, receipt.events, parsedAmount);
          if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3 && status) {
              setSendingTrx(false);
              const explorerLink = getExplorerLink(
                  chainId as number,
                  hash,
                  ExplorerDataType.TRANSACTION
              );
              dispatch(setOpenModal({
                  message : `Swap Successful.`,
                  trxState: TrxState.TransactionSuccessful
              }));
              dispatch(
                  addToast({
                      message: `Swap ${inputAmount} ${currencies[Field.INPUT]?.symbol} for ${outputAmount} ${currencies[Field.OUTPUT]?.symbol}`,
                      URL: explorerLink
                  }));
              onUserInput(Field.INPUT, '')

          }
      } catch (e) {
          console.log(e);
          setSendingTrx(false);
          dispatch(setOpenModal({
              message: `Swap Failed`,
              trxState: TrxState.TransactionFailed
          }));
          onUserInput(Field.INPUT, '')
      }
  };

    const swapDefaultForOtherTokens = async () => {
        const route = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
        const dl = getDeadline(deadline);
        const from = WNATIVEADDRESSES[chainId as number];
        const to = currencies[Field.OUTPUT]?.wrapped.address;

        try {
            setSendingTrx(true);
            dispatch(setOpenModal({
                message: `Swapping ${formattedAmounts[Field.INPUT]} BNB for ${formattedAmounts[Field.OUTPUT]} ${currencies[Field.OUTPUT]?.symbol}`,
                trxState: TrxState.WaitingForConfirmation
            }));
            const sendTransaction = await route.swapETHForExactTokens(
                parsedOutput,
                [from, to],
                account,
                dl,
                {
                    value: parsedAmount
                }
            );
            const {hash} = sendTransaction;
            const { confirmations, status } = await sendTransaction.wait(3);
            const receipt = await sendTransaction.wait();
            const outputAmountForDisplay = await getOutPutDataFromEvent(to, receipt.events);
            const inputAmountForDisplay = await getInPutDataFromEvent(from, receipt.events, parsedAmount);

            if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3 && status) {
                setSendingTrx(false);
                const explorerLink = getExplorerLink(
                    chainId as number,
                    hash,
                    ExplorerDataType.TRANSACTION
                );
                dispatch(setOpenModal({
                    message : `Swap from BNB Successful.`,
                    trxState: TrxState.TransactionSuccessful
                }));
                dispatch(
                    addToast({
                        message: `Swap ${inputAmountForDisplay} ${currencies[Field.INPUT]?.symbol} for ${outputAmountForDisplay} ${currencies[Field.OUTPUT]?.symbol}`,
                        URL: explorerLink
                    }));
                onUserInput(Field.INPUT, '')
            }

        } catch (e) {
            console.log(e);
            setSendingTrx(false);
            dispatch(setOpenModal({
                message: `Swap Failed`,
                trxState: TrxState.TransactionFailed
            }));
            onUserInput(Field.INPUT, '')
        }
    };

    const swapOtherTokensForDefault = async () => {

        const route = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
        const dl = getDeadline(deadline);
        const from = currencies[Field.INPUT]?.wrapped.address;
        const to = WNATIVEADDRESSES[chainId as number];

        try {
            setSendingTrx(true);
            dispatch(setOpenModal({
                message: `Swapping ${formattedAmounts[Field.INPUT]} ${currencies[Field.INPUT]?.symbol} for ${formattedAmounts[Field.OUTPUT]} BNB`,
                trxState: TrxState.WaitingForConfirmation
            }));
            const sendTransaction = await route.swapExactTokensForETH(
                parsedAmount,
                parsedOutput,
                [from, to],
                account,
                dl,
            );
            const { confirmations, status } = await sendTransaction.wait(3);
            const { hash } = sendTransaction;
            const receipt = await sendTransaction.wait();
            const outputAmount = await getOutPutDataFromEvent(to, receipt.events);
            const inputAmount = await getInPutDataFromEvent(from, receipt.events, parsedAmount);

            if (typeof sendTransaction.hash !== "undefined" && confirmations >= 3 && status) {
                setSendingTrx(false);
                const explorerLink = getExplorerLink(
                    chainId as number,
                    hash,
                    ExplorerDataType.TRANSACTION
                );
                dispatch(setOpenModal({
                    message : `Swap tokens for ${currencies[Field.OUTPUT]?.symbol} Successful.`,
                    trxState: TrxState.TransactionSuccessful
                }));
                dispatch(
                    addToast({
                        message: `Swap ${inputAmount} ${currencies[Field.INPUT]?.symbol} for ${outputAmount} ${currencies[Field.OUTPUT]?.symbol}`,
                        URL: explorerLink
                    }));
                onUserInput(Field.INPUT, '')
            }
        } catch (e) {
            console.log(e);
            setSendingTrx(false);
            dispatch(setOpenModal({
                message: `Swap Failed`,
                trxState: TrxState.TransactionFailed
            }));
            onUserInput(Field.INPUT, '')
        }
    };

  const deposit = async () => {
      const weth = await WETH(WNATIVEADDRESSES[chainId as number]);
      setSendingTrx(true);
      dispatch(setOpenModal({
          message: `Swapping ${typedValue} BNB for ${typedValue} WBNB`,
          trxState: TrxState.WaitingForConfirmation
      }));
      try {
          const sendTransaction = await weth.deposit({
              value: parsedAmount
          });
          const { confirmations, status } = await sendTransaction.wait(3);
          const { hash } = sendTransaction;
          if (
              typeof sendTransaction.hash !== 'undefined' &&
              confirmations >= 3 &&
              status
          ) {
              setSendingTrx(false);
              dispatch(setOpenModal({
                  message : `Swap Successful.`,
                  trxState: TrxState.TransactionSuccessful
              }));
              const explorerLink = getExplorerLink(
                  chainId as number,
                  hash,
                  ExplorerDataType.TRANSACTION
              );
              dispatch(
                  addToast({
                      message: `Swap ${typedValue} ${currencies[Field.INPUT]?.symbol} for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
                      URL: explorerLink
                  }));
              onUserInput(Field.INPUT, '')
          }
      } catch (e) {
          console.log(e);
          setSendingTrx(false);
          dispatch(setOpenModal({
              message: `Swap Failed`,
              trxState: TrxState.TransactionFailed
          }));
          onUserInput(Field.INPUT, '')
      }
  };

  const withdraw = async () => {
      const weth = await WETH(WNATIVEADDRESSES[chainId as number]);
      setSendingTrx(true);
      dispatch(setOpenModal({
          message: `Swapping ${typedValue} WBNB for ${typedValue} BNB`,
          trxState: TrxState.WaitingForConfirmation
      }));
      try {
          const sendTransaction = await weth.withdraw(
              parsedAmount
          );
          const { confirmations, status } = await sendTransaction.wait(3);
          const { hash } = sendTransaction;
          if (
              typeof sendTransaction.hash !== 'undefined' &&
              confirmations >= 3 &&
              status
          ) {
              setSendingTrx(false);
              dispatch(setOpenModal({
                  message : `Approval Successful.`,
                  trxState: TrxState.TransactionSuccessful
              }));
              const explorerLink = getExplorerLink(
                  chainId as number,
                  hash,
                  ExplorerDataType.TRANSACTION
              );
              dispatch(
                  addToast({
                      message: `Swap ${typedValue} ${currencies[Field.INPUT]?.symbol} for ${typedValue} ${currencies[Field.OUTPUT]?.symbol}`,
                      URL: explorerLink
                  }));
              onUserInput(Field.INPUT, '')
          }

      } catch (e) {
          console.log(e);
          setSendingTrx(false);
          dispatch(setOpenModal({
              message: `Swap Failed`,
              trxState: TrxState.TransactionFailed
          }));
          onUserInput(Field.INPUT, '')
      }
  };


  const swapTokens = async () => {

       if (chainId === SupportedChainId.POLYGONTEST) {
           if (currencies[Field.INPUT]?.symbol === 'MATIC' && currencies[Field.OUTPUT]?.symbol === 'WMATIC') {
               await deposit();
           } else if (currencies[Field.INPUT]?.symbol === 'WMATIC' && currencies[Field.OUTPUT]?.symbol === 'MATIC') {
               await withdraw();
           } else if (currencies[Field.INPUT]?.isNative) {
               await swapDefaultForOtherTokens()
           } else if (currencies[Field.OUTPUT]?.isNative) {
               await swapOtherTokensForDefault()
           } else {
               await swapDifferentTokens()
           }
       }

       else if (chainId === SupportedChainId.BINANCETEST || chainId === SupportedChainId.BINANCE) {
           if (currencies[Field.INPUT]?.symbol === 'BNB' && currencies[Field.OUTPUT]?.symbol === 'WBNB') {
               await deposit();
           } else if (currencies[Field.INPUT]?.symbol === 'WBNB' && currencies[Field.OUTPUT]?.symbol === 'BNB') {
               await withdraw();
           } else if (currencies[Field.INPUT]?.symbol === 'BNB') {
               await swapDefaultForOtherTokens()
           } else if (currencies[Field.OUTPUT]?.symbol === 'BNB') {
               await swapOtherTokensForDefault()
           } else {
               await swapDifferentTokens()
           }
       }
  };


  const fromAmount = Number(formattedAmounts[Field.INPUT]);
  const [routeAddress, setRouteAddress] = useState([]);

  const calculatePriceImpact = async () => {
    const route = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
    const from = currencies[Field.INPUT]?.isNative ? (WNATIVEADDRESSES[chainId as number]) : (currencies[Field.INPUT]?.wrapped.address);
    const to = currencies[Field.OUTPUT]?.isNative ? (WNATIVEADDRESSES[chainId as number]) : (currencies[Field.OUPUT]?.wrapped.address);
    console.log(`check here- ${from} --- ${to}`)

    if (routeAddress.length === 2) {
      try {
        const price = await route.getAmountsOut(
          '1000000000000000000',
          routeAddress,
        );
        const marketPrice = ethers.utils.formatEther(price[1].toString());
        const swapPrice = receivedAmount / fromAmount;
        const priceDifference = swapPrice - marketPrice;
        const priceImpact = (priceDifference / marketPrice) * 100;
        setPriceImpact(parseFloat(priceImpact).toFixed(2));
      } catch (e) {
        setPriceImpact(0);
      }
    } else if (routeAddress.length === 3) {
      try {
        const price1 = await route.getAmountsOut('1000000000000000000', [
          routeAddress[0],
          routeAddress[1],
        ]);

        const price1String = price1.toString().split(',');

        const price2 = await route.getAmountsOut(price1String[1], [
          routeAddress[1],
          routeAddress[2],
        ]);

        const marketPrice = ethers.utils.formatEther(price2[1].toString());
        const swapPrice = receivedAmount / fromAmount;
        const priceDifference = swapPrice - marketPrice;
        const priceImpact = (priceDifference / marketPrice) * 100;
        setPriceImpact(parseFloat(priceImpact).toFixed(2));
      } catch (e) {
        setPriceImpact(0);
      }
    } else if (routeAddress.length === 4) {
      try {
        const price1 = await route.getAmountsOut('1000000000000000000', [
          routeAddress[0],
          routeAddress[1],
        ]);

        const price1String = price1.toString().split(',');

        const price2 = await route.getAmountsOut(price1String[1], [
          routeAddress[1],
          routeAddress[2],
        ]);

        const price2String = price2.toString().split(',');

        const price3 = await route.getAmountsOut(price2String[1], [
          routeAddress[2],
          routeAddress[3],
        ]);

        const marketPrice = ethers.utils.formatEther(price3[1].toString());
        const swapPrice = receivedAmount / fromAmount;
        const priceDifference = swapPrice - marketPrice;
        const priceImpact = (priceDifference / marketPrice) * 100;
        setPriceImpact(parseFloat(priceImpact).toFixed(2));
      } catch (e) {
        setPriceImpact(0);
      }
    } else {
      setPriceImpact(0);
    }
  };
  useEffect(async () => {
    calculatePriceImpact();
  }, [fromAmount, receivedAmount]);

  return (
    <div>
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
        />
        <Flex justifyContent="center">
          <SwitchIcon />
        </Flex>
        <To
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onUserOutput={handleTypeOutput}
        />

        <Flex alignItems="center">
            {insufficientBalance || inputError ? (
                    <Button
                        w="100%"
                        borderRadius="6px"
                        border={lightmode ? '2px' : 'none'}
                        borderColor={borderColor}
                        h="48px"
                        p="5px"
                        mt={1}
                        disabled={inputError !== undefined || insufficientBalance}
                        color={inputError ? color : '#FFFFFF'}
                        bgColor={inputError ? switchBgcolor : buttonBgcolor}
                        fontSize="18px"
                        boxShadow={lightmode ? 'base' : 'lg'}
                        _hover={{ bgColor: buttonBgcolor }}
                    >
                        {inputError ? inputError : `Insufficient ${currencies[Field.INPUT]?.symbol} Balance`}
                    </Button>
                ) : !hasBeenApproved ? (
                <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    mt={1}
                    disabled={inputError !== undefined || insufficientBalance}
                    color={inputError ? color : '#FFFFFF'}
                    bgColor={inputError ? switchBgcolor : buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                    onClick={
                        () => {
                            approveSwap()
                        }
                    }
                >
                    Approve Transaction
                </Button>
                ) : (
                <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    mt={1}
                    disabled={inputError !== undefined || insufficientBalance}
                    color={inputError ? color : '#FFFFFF'}
                    bgColor={inputError ? switchBgcolor : buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                    onClick={
                            () => setShowModal(!showModal)
                    }
                >
                    Swap Tokens
                </Button>
            )}
        </Flex>
        <ConfirmModal
            showModal={showModal}
            setShowModal={setShowModal}
            from={currencies[Field.INPUT]?.symbol}
            to={currencies[Field.OUTPUT]?.symbol}
            title={'Confirm Swap'}
            inputLogo={currencies[Field.INPUT]?.logoURI}
            outputLogo={currencies[Field.OUTPUT]?.logoURI}
            minRecieved={minimum}
            slippage={Number(allowedSlippage/100)}
            fromDeposited={formattedAmounts[Field.INPUT]}
            toDeposited={receivedAmount}
            handleSwap={swapTokens}
            fee={LPFee}
            priceImpact={priceImpact}
        />
      </Box>
    </div>
  );
};

export default SendToken;

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ShowDetails from './components/details/ShowDetails';
import History from './components/history/History';
import { VectorIcon, ExclamationIcon, SwitchIcon, RightIcon } from '../../theme/components/Icons';
import To from './components/sendToken/To';
import SetPriceModal from './modals/setPriceModal';
import From from './components/sendToken/From';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import Web3 from 'web3';
import SwapSettings from './components/sendToken/SwapSettings';
import {
  Box,
  Flex,
  Text,
  Center,
  Spacer,
  Button,
  useColorModeValue,
  useMediaQuery,
  Stack,
  InputGroup,
  InputAddonProps,
  InputRightAddon,
  HStack
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { getERC20Token } from '../../utils/utilsFunctions';
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import CInput from './components/sendToken/Input';
import { Field } from '../../state/swap/actions';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { autoSwapV2, rigelToken, SmartSwapRouter } from '../../utils/Contracts';
import { RGPADDRESSES, AUTOSWAPV2ADDRESSES, WNATIVEADDRESSES, SMARTSWAPROUTER } from '../../utils/addresses';
import { useDispatch } from "react-redux";
import { setOpenModal, TrxState } from "../../state/application/reducer";


const SetPrice = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const lightmode = useColorModeValue(true, false);
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const dispatch = useDispatch();
  const color = useColorModeValue('#999999', '#7599BD');

  const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers();
  const { account, chainId, library } = useActiveWeb3React()

  const {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
    pathSymbol,
    pathArray,
  } = useDerivedSwapInfo();
  useEffect(async () => {
    await checkForApproval()
  }, [currencies[Field.INPUT]])
  const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [disableInput, setDisableInput] = useState(true)
  const [initialFromPrice, setInitialFromPrice] = useState("")
  const [initialToPrice, setInitialToPrice] = useState("")
  const [differenceInPrice, setDifferenceInPrice] = useState(0)
  const [signatureFromDataBase, setSignatureFromDataBase] = useState(false)
  const [toPrice, setToPrice] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [checkedItem, setCheckedItem] = useState(false)
  const [signedTransaction, setSignedTransaction] = useState<{ r: string, s: string, _vs: string, mess: string, v: string, recoveryParam: string }>({
    r: "",
    s: "",
    _vs: "",
    mess: "",
    v: "",
    recoveryParam: ""
  }
  )

  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [priceOut, setPriceOut] = useState("")
  const [approval, setApproval] = useState<String[]>([])


  useEffect(() => {
    setURL("http://localhost:7000")
    async function checkIfSignatureExists() {
      let user = await fetch(`${URL}/auto/data/${account}`)
      let data = await user.json()
      console.log({ data })
      if (data) {
        setSignedTransaction(data.signature)
        setTransactionSigned(true)
        setSignatureFromDataBase(true)
      } else {
        setSignedTransaction({
          r: "",
          s: "",
          _vs: "",
          mess: "",
          v: "",
          recoveryParam: ""
        })
        setTransactionSigned(false)
        setSignatureFromDataBase(false)
      }
    }
    if (account) {
      checkIfSignatureExists()

    }
  }, [account])

  const { independentField, typedValue } = useSwapState();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  useEffect(() => {
    if (parseFloat(initialToPrice) > 0 && parseFloat(initialFromPrice) > 0) {
      setDisableInput(false)
      let difference = parseFloat(initialToPrice) / parseFloat(initialFromPrice)
      setDifferenceInPrice(difference)
      if (typedValue) {
        setToPrice(parseFloat(typedValue) * difference)
      }
    } else {
      setDisableInput(true)
    }
  }, [initialToPrice, initialFromPrice, typedValue])
  useMemo(async () => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number], library);
      const routeAddress = currencies[Field.INPUT]?.isNative ? [WNATIVEADDRESSES[chainId as number], currencies[Field.OUTPUT]?.wrapped.address] :
        currencies[Field.OUTPUT]?.isNative ? [currencies[Field.INPUT]?.wrapped.address, WNATIVEADDRESSES[chainId as number]] :
          [currencies[Field.INPUT]?.wrapped.address, currencies[Field.OUTPUT]?.wrapped.address]
      const priceOutput = await rout.getAmountsOut(
        '1000000000000000000',
        routeAddress
      );

      setPriceOut(ethers.utils.formatUnits(priceOutput[1].toString(), currencies[Field.OUTPUT]?.decimals))
    }
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue])
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

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField] ?? '' //?.toExact() ?? ''
      : parsedAmounts[dependentField] ?? '', //?.toSignificant(6) ?? '',
  };

  const sendTransactionToDatabase = async () => {
    const autoSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    dispatch(
      setOpenModal({
        message: `Signing initial transaction between ${currencies[Field.INPUT]?.symbol} and ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    let minutesToAdd = 20;
    let currentDate = new Date();
    let futureDate = currentDate.getTime() + minutesToAdd;
    console.log({ futureDate })
    let data, response
    if (currencies[Field.INPUT]?.isNative) {
      console.log(Web3.utils.toWei(typedValue, 'ether'), { typedValue })
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(

        currencies[Field.OUTPUT]?.wrapped.address,
        account,
        futureDate,
        signedTransaction?.mess,
        signedTransaction?.r,
        signedTransaction?.s,
        signedTransaction?.v,
        { value: Web3.utils.toWei(typedValue, 'ether') }
      )
      const fetchTransactionData = async (sendTransaction: any) => {
        const { confirmations, status, logs } = await sendTransaction.wait(1);

        return { confirmations, status, logs };
      };
      const { confirmations, status, logs } = await fetchTransactionData(data)
      if (confirmations >= 1 && status) {
        response = true
      }
    } else {
      response = true
    }


    let orderID = await autoSwapV2Contract.orderCount()

    if (response) {
      dispatch(
        setOpenModal({
          message: "Storing Transaction",
          trxState: TrxState.WaitingForConfirmation,
        })
      );

      const response = await fetch(`${URL}/auto/add`, {
        method: "POST",
        mode: "cors",
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          address: account,
          chainID: chainId,
          frequency: "price",
          frequencyNumber: 1,
          presentDate: 0,
          presentMonth: 0,
          fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
          toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
          signature: signedTransaction,
          percentageChange: toPrice,
          toNumberOfDecimals: currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: typedValue,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          type: "Set Price"
        })
      })
      const res = await response.json()
      console.log(res)
      dispatch(
        setOpenModal({
          message: "Successfully stored Transaction",
          trxState: TrxState.TransactionSuccessful,
        })
      );
      setSignedTransaction({
        r: "",
        s: "",
        _vs: "",
        mess: "",
        v: "",
        recoveryParam: ""
      })
      onUserInput(Field.INPUT, "");
      setApproval([])
    }

  }


  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT]);
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

  const signTransaction = async () => {
    if (account !== undefined) {
      try {
        let web3 = new Web3(Web3.givenProvider);
        const permitHash = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";

        const mess = web3.utils.soliditySha3(permitHash)

        let signature = await web3.eth.sign(mess, account);

        var sig = ethers.utils.splitSignature(signature)
        console.log({ ...sig, mess })
        setSignedTransaction({ ...sig, mess })
        setTransactionSigned(true)

        // await checkForApproval()
      } catch (e) {
        dispatch(
          setOpenModal({
            message: "Signing wallet failed",
            trxState: TrxState.TransactionFailed,
          })
        );
      }

    } else {
      dispatch(
        setOpenModal({
          message: "connect wallet",
          trxState: TrxState.TransactionFailed,
        })
      );
    }

  }

  const approveOneOrTwoTokens = async () => {
    if (currencies[Field.INPUT]?.isNative) {
      setHasBeenApproved(true);
      setApproval(approval.filter(t => t !== currencies[Field.INPUT]?.name))
    }
    console.log(approval)
    if (approval.length > 0) {
      try {
        dispatch(
          setOpenModal({
            message: `Approve Tokens for Swap`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        let arr = approval
        if (arr[0] === "RGP") {
          const address = RGPADDRESSES[chainId as number];
          const rgp = await rigelToken(RGP[chainId as number], library);
          const token = await getERC20Token(address, library);

          const walletBal = (await token.balanceOf(account)) + 4e18;
          const approveTransaction = await rgp.approve(
            AUTOSWAPV2ADDRESSES[chainId as number],
            walletBal,
            {
              from: account,
            }
          );

          arr.length > 1 ? setApproval([arr[1]]) : setApproval([])
        } else {
          // setRGPApproval(true)
        }
        if (approval[0] === currencies[Field.INPUT]?.name) {
          const address = currencies[Field.INPUT]?.wrapped.address;
          const token = await getERC20Token(address, library);
          const walletBal = (await token.balanceOf(account)) + 4e18;
          const approveTransaction = await token.approve(
            AUTOSWAPV2ADDRESSES[chainId as number],
            walletBal,
            {
              from: account,
            }
          );
          const { confirmations } = await approveTransaction.wait(1);
          if (confirmations >= 1) {
            dispatch(
              setOpenModal({
                message: `Approval Successful.`,
                trxState: TrxState.TransactionSuccessful,
              })
            );
          }
          setApproval([])
        } else {
          // setOtherTokenApproval(true)
        }
        dispatch(
          setOpenModal({
            message: `Approval Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
      } catch (e) {
        console.log(e)
      }
    } else return

  }
  const checkForApproval = async () => {
    // check approval for RGP and the other token
    const RGPBalance = await checkApprovalForRGP(RGPADDRESSES[chainId as number])
    const tokenBalance = currencies[Field.INPUT]?.isNative ? 1 : await checkApproval(currencies[Field.INPUT]?.wrapped.address)
    if (parseFloat(RGPBalance) > 0 && parseFloat(tokenBalance) > 0) {
      setHasBeenApproved(true)
    } else if (parseFloat(RGPBalance) <= 0 && parseFloat(tokenBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval(["RGP", currencies[Field.INPUT]?.wrapped.name])
    } else if (parseFloat(tokenBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval([currencies[Field.INPUT].wrapped.name])
    } else if (parseFloat(RGPBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval(["RGP"])
    }
  }

  const checkApproval = async (tokenAddress: string) => {
    if (currencies[Field.INPUT]?.isNative) {
      return setHasBeenApproved(true);
    }
    try {
      const status = await getERC20Token(tokenAddress, library);
      const check = await status.allowance(
        account,
        AUTOSWAPV2ADDRESSES[chainId as number],
        {
          from: account,
        }
      )

      const approveBalance = ethers.utils.formatEther(check).toString();
      return approveBalance
    } catch (e) {
      console.log(e)
    }

  }
  const checkApprovalForRGP = async (tokenAddress: string) => {

    try {
      const status = await rigelToken(tokenAddress, library);
      const check = await status.allowance(
        account,
        AUTOSWAPV2ADDRESSES[chainId as number],
        {
          from: account,
        }
      )

      const approveBalance = ethers.utils.formatEther(check).toString();
      return approveBalance
    } catch (e) {
      console.log(e)
    }

  }


  return (
    <Box fontSize="xl">
      <Flex
        minH="100vh"
        zIndex={1}
        mt={6}
        justifyContent="center"
        flexWrap="wrap"
      >
        <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <ShowDetails />
        </Box>

        <Box
          mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}
          borderColor={borderColor} borderWidth="1px"
          borderRadius="6px" pl={3} pr={3}
          h="550px"
        >
          <SwapSettings />
          <From
            onUserInput={handleTypeInput}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.INPUT]}
            otherCurrency={currencies[Field.OUTPUT]}
            onMax={handleMaxInput}
            value={formattedAmounts[Field.INPUT]}
            disable={disableInput}
          />
          <Flex justifyContent="center" onClick={onSwitchTokens}>
            <SwitchIcon />
          </Flex>
          <To
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={toPrice}
            disable={disableInput}
          />
          <Flex>
            <Text fontSize="14px" color={iconColor} mr={2}>
              Set Price
            </Text>
            <ExclamationIcon />
          </Flex>

          {/* <Input placeholder="0.00" size="lg" borderRadius={4} borderColor={borderColor} /> */}
          <HStack>
            <CInput
              currency={currencies[Field.INPUT]}
              initialFromPrice={initialFromPrice}
              setInitialPrice={setInitialFromPrice}
            />
            <Flex justifyContent="center">
              <RightIcon />
            </Flex>
            <CInput
              currency={currencies[Field.OUTPUT]}
              initialFromPrice={initialToPrice}
              setInitialPrice={setInitialToPrice}
            />
          </HStack>


          <Flex mt={5}>
            <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
              <VectorIcon />
            </Center>
            <Spacer />
            {currencies[Field.INPUT]?.symbol && currencies[Field.OUTPUT]?.symbol &&
              <Text fontSize="14px" mr={2} color={textColorOne}>
                1 {currencies[Field.INPUT]?.symbol} = {priceOut} {currencies[Field.OUTPUT]?.symbol}
              </Text>
            }

            <ExclamationIcon />
          </Flex>

          <Box mt={5}>
            {inputError ?
              <Button
                w="100%"
                borderRadius="6px"
                border={lightmode ? '2px' : 'none'}
                borderColor={borderColor}
                h="48px"
                p="5px"
                color={color}
                bgColor={buttonBgcolor}
                fontSize="18px"
                boxShadow={lightmode ? 'base' : 'lg'}
                _hover={{ bgColor: buttonBgcolor }}
              >
                {inputError}
              </Button> : !transactionSigned ? <Button
                w="100%"
                borderRadius="6px"
                border={lightmode ? '2px' : 'none'}
                borderColor={borderColor}
                // onClick={signTransaction}
                onClick={() => setShowModal(!showModal)}
                h="48px"
                p="5px"
                color={color}
                bgColor={buttonBgcolor}
                fontSize="18px"
                boxShadow={lightmode ? 'base' : 'lg'}
                _hover={{ bgColor: buttonBgcolor }}
              >
                Sign Wallet
              </Button> : approval.length > 0 ? <Button
                w="100%"
                borderRadius="6px"
                border={lightmode ? '2px' : 'none'}
                borderColor={borderColor}
                h="48px"
                p="5px"
                onClick={approveOneOrTwoTokens}
                color={color}
                bgColor={buttonBgcolor}
                fontSize="18px"
                boxShadow={lightmode ? 'base' : 'lg'}
                _hover={{ bgColor: buttonBgcolor }}
              >
                Approve {approval.length > 0 && approval[0]} {approval.length > 1 && `and ${currencies[Field.INPUT]?.tokenInfo.name}`}
              </Button> : <Button
                w="100%"
                borderRadius="6px"
                border={lightmode ? '2px' : 'none'}
                borderColor={borderColor}
                h="48px"
                p="5px"
                color={color}
                bgColor={buttonBgcolor}
                onClick={() => signatureFromDataBase ? setShowModal(!showModal) : sendTransactionToDatabase()}
                // onClick={sendTransactionToDatabase}
                fontSize="18px"
                boxShadow={lightmode ? 'base' : 'lg'}
                _hover={{ bgColor: buttonBgcolor }}
              >
                Send Transaction
              </Button>
            }

          </Box>

        </Box>

        <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <History />
        </Box>

      </Flex>
      <SetPriceModal
        showModal={showModal}
        setShowModal={setShowModal}
        from={currencies[Field.INPUT]?.symbol}
        to={currencies[Field.OUTPUT]?.symbol}
        title="Confirm set price"
        inputLogo={currencies[Field.INPUT]?.logoURI}
        outputLogo={currencies[Field.OUTPUT]?.logoURI}
        toPrice={toPrice}
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={formattedAmounts[Field.OUTPUT]}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        setCheckedItem={setCheckedItem}
        checkedItem={checkedItem}
        fromPrice={typedValue}
        pathSymbol={pathSymbol}
      />
    </Box>
  )
}

export default SetPrice

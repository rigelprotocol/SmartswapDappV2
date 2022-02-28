import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ShowDetails from './components/details/ShowDetails';
import History from './components/history/History';
import From from './components/sendToken/From';
import To from './components/sendToken/To';
import SwapSettings from './components/sendToken/SwapSettings';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import { VectorIcon, ExclamationIcon, SwitchIcon } from '../../theme/components/Icons';
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { getERC20Token } from '../../utils/utilsFunctions';
import { Field } from '../../state/swap/actions';
import Web3 from 'web3';
import { RGP } from '../../utils/addresses';
import { ethers } from 'ethers';
import {
  Box,
  Flex,
  Input,
  Text,
  Menu,
  Button,
  Image,
  Center,
  Spacer,
  VStack,
  InputGroup,
  InputRightAddon,
  MenuButton,
  useColorModeValue,
  useMediaQuery,
  Select
} from '@chakra-ui/react';
import {
  ChevronDownIcon
} from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { autoSwapV2, rigelToken, SmartSwapRouter, otherMarketPriceContract } from '../../utils/Contracts';
import { RGPADDRESSES, AUTOSWAPV2ADDRESSES, WNATIVEADDRESSES, SMARTSWAPROUTER, OTHERMARKETADDRESSES } from '../../utils/addresses';
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { changeFrequencyTodays } from '../../utils/utilsFunctions';


const SetPrice = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const dispatch = useDispatch();
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const bgColor = useColorModeValue('#ffffff', '#15202B');
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const color = useColorModeValue('#999999', '#7599BD');
  const lightmode = useColorModeValue(true, false);
  const borderTwo = useColorModeValue('#319EF6', '#4CAFFF');
  const { account, library, chainId } = useActiveWeb3React()

  const { independentField, typedValue } = useSwapState();
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
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("daily")
  const [toPriceOut, setToPriceOut] = useState("0")
  const [marketType, setMarketType] = useState("pancakeswap")
  const [percentageChange, setPercentageChange] = useState<string>("0")
  const [priceOut, setPriceOut] = useState<string>("")
  const [otherMarketprice, setOtherMarketprice] = useState<string>("0")
  const [approval, setApproval] = useState<String[]>([])
  const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")

  const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers();

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
  useEffect(async () => {
    setURL("http://localhost:7000")
    await checkForApproval()
  }, [currencies[Field.INPUT], account])
  useEffect(() => {
    // const checkSignature = checkIfSignatureExists(account)
    async function checkIfSignatureExists() {
      const autoswapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
      let user = await fetch(`${URL}/auto/data/${account}`)
      let data = await user.json()
      if (data) {
        setSignedTransaction(data.signature)
        if (account) {
          console.log(data.signature, Web3.utils.toHex(data.signature.v.toString()), data.signature.v)
          // let datum = await autoswapV2Contract.recover_With_rsv(
          //   account,
          //   data.signature.mess,
          //   data.signature.v,
          //   data.signature.r,
          //   data.signature.s
          // )
          // console.log({ datum }, "ueueuue")
        }

        setTransactionSigned(true)
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
      }
    }
    if (account) {
      // checkIfSignatureExists()

    }
  }, [account])

  // const checkIfSignatureExists = async () => {
  //   await if
  // }

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
      if (typedValue) {
        const toPriceOut = await rout.getAmountsOut(
          Web3.utils.toWei(typedValue, 'ether'),
          routeAddress
        );
        setToPriceOut(ethers.utils.formatUnits(toPriceOut[1].toString(), currencies[Field.OUTPUT]?.decimals))
      }

      setPriceOut(ethers.utils.formatUnits(priceOutput[1].toString(), currencies[Field.OUTPUT]?.decimals))
    }
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue])


  useMemo(async () => {
    if (chainId === 56 && currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const rout = await otherMarketPriceContract(OTHERMARKETADDRESSES[marketType], library);
      const routeAddress = currencies[Field.INPUT]?.isNative ? [WNATIVEADDRESSES[chainId as number], currencies[Field.OUTPUT]?.wrapped.address] :
        currencies[Field.OUTPUT]?.isNative ? [currencies[Field.INPUT]?.wrapped.address, WNATIVEADDRESSES[chainId as number]] :
          [currencies[Field.INPUT]?.wrapped.address, currencies[Field.OUTPUT]?.wrapped.address]
      if (typedValue) {
        const priceOutput = await rout.getAmountsOut(
          Web3.utils.toWei(typedValue, 'ether'),
          routeAddress
        );
        setOtherMarketprice(ethers.utils.formatUnits(priceOutput[1].toString(), currencies[Field.OUTPUT]?.decimals))
      }
    }
  }, [chainId, currencies[Field.INPUT], currencies[Field.OUTPUT], marketType, typedValue])


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

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField] ?? "" //?.toExact() ?? ''
      : parsedAmounts[dependentField] ?? "", //?.toSignificant(6) ?? '',
  };


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
    if (setApproval.length > 0) {
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
  const sendTransactionToDatabase = async () => {
    const smartSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    dispatch(
      setOpenModal({
        message: `Signing initial transaction between ${currencies[Field.INPUT]?.symbol} and ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    const time = Date.now();
    console.log("time", time.toLocaleString())
    // console.log(Web3.utils.toWei(time, 'ether') )
    let data, response
    // if (currencies[Field.INPUT]?.isNative) {
    //   data = await smartSwapV2Contract.setPeriodToSwapETHForTokens(
    //     { value: Web3.utils.toWei(typedValue, 'ether') },
    //     currencies[Field.OUTPUT]?.wrapped.address,
    //     account,
    //     time,
    //     signedTransaction?.mess,
    //     signedTransaction?.r,
    //     signedTransaction?.s,
    //     signedTransaction?.v
    //   )
    //   const fetchTransactionData = async (sendTransaction: any) => {
    //     const { confirmations, status, logs } = await sendTransaction.wait(1);

    //     return { confirmations, status, logs };
    //   };
    //   const { confirmations, status, logs } = await fetchTransactionData(data)
    //   if (confirmations >= 1 && status) {
    //     response = true
    //   }
    // } else {
    //   response = true
    // }
    // else if (currencies[Field.OUTPUT]?.isNative) {
    //   data = await smartSwapV2Contract.setPeriodToswapTokensForETH(
    //     currencies[Field.INPUT]?.wrapped.address,
    //     account,
    //     Web3.utils.toWei(typedValue, 'ether'),
    //     time,
    //     signedTransaction?.mess,
    //     signedTransaction?.r,
    //     signedTransaction?.s,
    //     signedTransaction?.v,
    //   )
    // } else {
    //   data = await smartSwapV2Contract.callPeriodToSwapExactTokens(
    //     currencies[Field.INPUT]?.wrapped.address,
    //     currencies[Field.OUTPUT]?.wrapped.address,
    //     account,
    //     Web3.utils.toWei(typedValue, 'ether'),
    //     time,
    //     signedTransaction?.mess,
    //     signedTransaction?.r,
    //     signedTransaction?.s,
    //     signedTransaction?.v,
    //   )
    // }


    let orderID = await smartSwapV2Contract.orderCount()

    if (response) {
      dispatch(
        setOpenModal({
          message: "Storing Transaction",
          trxState: TrxState.WaitingForConfirmation,
        })
      );
      const changeFrequencyToday = changeFrequencyTodays(selectedFrequency)
      console.log(currencies[Field.OUTPUT])
      console.log({
        address: account,
        chainID: chainId,
        frequency: selectedFrequency,
        frequencyNumber: changeFrequencyToday.days,
        presentDate: changeFrequencyToday.today,
        presentMonth: changeFrequencyToday.month,
        fromAddress: currencies[Field.INPUT]?.isNative ? WNATIVEADDRESSES[chainId as number] : currencies[Field.INPUT]?.wrapped.address,
        toAddress: currencies[Field.OUTPUT]?.isNative ? WNATIVEADDRESSES[chainId as number] : currencies[Field.OUTPUT]?.wrapped.address,
        signature: signedTransaction,
        percentageChange,
        toNumberOfDecimals: currencies[Field.OUTPUT]?.wrapped ? currencies[Field.OUTPUT]?.wrapped.decimals : currencies[Field.OUTPUT]?.decimals,
        fromPrice: typedValue,
        currentToPrice: toPriceOut,
        orderID: orderID.toString()

      })

      // const response = await fetch(`${URL}/auto/add`, {
      //   method: "POST",
      //   mode: "cors",
      //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: 'same-origin', // include, *same-origin, omit
      //   headers: {
      //     'Content-Type': 'application/json'
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: JSON.stringify({
      //     address: account,
      //     chainID: chainId,
      //     frequency: selectedFrequency,
      //     frequencyNumber: changeFrequencyToday.days,
      //     presentDate: changeFrequencyToday.today,
      //     presentMonth: changeFrequencyToday.month,
      //     fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
      //     toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
      //     signature: signedTransaction,
      //     percentageChange,
      //     toNumberOfDecimals: currencies[Field.OUTPUT]?.wrapped ? currencies[Field.OUTPUT]?.wrapped.decimals : currencies[Field.OUTPUT]?.decimals,
      //     fromPrice: typedValue,
      //     currentToPrice: toPriceOut,
      //     orderID: orderID.toString()

      //   })
      // })
      // const res = await response.json()
      // console.log(res)
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
        {isMobileDevice ? (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
            </Box>

            <Box mx={4} mb={4} w={['100%', '100%', '45%', '29.5%']}
              borderColor={borderColor}
              borderWidth="1px"
              borderRadius="6px"
              pl={3}
              pr={3}
              pb={4}
            >
              <SwapSettings />
              <From
                onUserInput={handleTypeInput}
                onCurrencySelection={onCurrencySelection}
                currency={currencies[Field.INPUT]}
                otherCurrency={currencies[Field.OUTPUT]}
                value={typedValue}
              />
              <Flex justifyContent="center" onClick={onSwitchTokens}>
                <SwitchIcon />
              </Flex>
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" p={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} width="100%">
                  <To
                    onUserOutput={handleTypeOutput}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    value=""

                    display={true}
                  />
                </Box>

                <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px">
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                      {/* {isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])} */}
                      {toPriceOut}
                    </Text>
                    <Text fontSize="14px" color={color} textAlign="right">
                      -2.56
                    </Text>
                  </VStack>
                </Box>
                <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2}>
                  <Flex>
                    <Select variant='unstyled' width="110px" cursor="pointer" onChange={(e) => setMarketType(e.target.value)}>
                      <option value='pancakeswap'>Pancakeswap</option>
                      <option value='sushiswap'>Sushiswap</option>
                    </Select>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                        {otherMarketprice}
                      </Text>
                      <Text fontSize="14px" color={color}>
                        -2.67
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Flex mt={5}>
                <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
                  <VectorIcon />
                </Center>
                <Spacer />
                {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                  <>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.INPUT]?.symbol} = {priceOut} {currencies[Field.OUTPUT]?.symbol}
                    </Text>
                    <ExclamationIcon />
                  </>

                }

              </Flex>
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap if price changes by
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="60px" value={percentageChange} />
                    <InputRightAddon children="%" fontSize="16px" />
                  </InputGroup>
                </VStack>
                <Spacer />
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap Every
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="md" bg={bgColor} fontSize="16px" color={textColorOne} borderColor={borderColor} borderWidth="1px">
                      Week
                    </MenuButton>
                  </Menu>
                </VStack>
              </Box>
              <Box mt={5}>
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
                  Enter Percentage
                </Button>
              </Box>
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        ) : (
          <>
            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <ShowDetails />
            </Box>

            <Box
              mx={4} mb={4} w={['100%', '100%', '45%', '29.5%']}
              borderColor={borderColor}
              borderWidth="1px"
              borderRadius="6px"
              pl={3}
              pr={3}
              pb={4}
            >
              <SwapSettings />
              <From
                onUserInput={handleTypeInput}
                onCurrencySelection={onCurrencySelection}
                currency={currencies[Field.INPUT]}
                otherCurrency={currencies[Field.OUTPUT]}
                value={typedValue}
              />
              <Flex justifyContent="center" onClick={onSwitchTokens}>
                <SwitchIcon />
              </Flex>
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" p={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
                  {/* <Text color={balanceColor} fontSize="14px">
                    Balance: 2.2332 USDT
                  </Text> */}
                  {/* <Menu>
                    <Button
                      border="0px"
                      h="40px"
                      w="120px"
                      rightIcon={<ChevronDownIcon />}
                      bgColor={tokenListTrgiggerBgColor}
                    >
                      <Image mr={3} h="24px" w="24px" src={USDTLOGO} />
                      <Text color={tokenListTriggerColor}>USDT</Text>
                    </Button>
                  </Menu> */}
                  <To
                    onUserOutput={handleTypeOutput}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    display={true}
                    value=""
                  />
                </Box>

                <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px" mt="2" >
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                      {/* {isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])} */}
                      {toPriceOut}
                    </Text>
                    <Text fontSize="14px" color={color} textAlign="right">
                      -2.56
                    </Text>
                  </VStack>
                </Box>
                <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2}>
                  <Flex>
                    <Select variant='unstyled' width="110px" cursor="pointer" onChange={(e) => setMarketType(e.target.value)} textAlign="right">
                      <option value='pancakeswap'>Pancakeswap</option>
                      <option value='sushiswap'>Sushiswap</option>
                    </Select>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} textAlign="right" isTruncated width="160px" >
                        {otherMarketprice}
                      </Text>
                      <Text fontSize="14px" color={color}>
                        -2.67
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Flex mt={5}>
                <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
                  <VectorIcon />
                </Center>
                <Spacer />
                {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                  <>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.INPUT]?.symbol} = {priceOut} {currencies[Field.OUTPUT]?.symbol}
                    </Text>
                    <ExclamationIcon />
                  </>

                }


              </Flex>
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap if price changes by
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="60px" value={percentageChange} type="number" onChange={e => {
                      if (parseFloat(e.target.value) > 100) {
                        setPercentageChange("100")
                      } else {
                        setPercentageChange(e.target.value)
                      }

                    }} />
                    <InputRightAddon children="%" fontSize="16px" />
                  </InputGroup>
                </VStack>
                <Spacer />
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap Every
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <Select onChange={(e) => setSelectedFrequency(e.target.value)}>
                    <option value='daily'>Daily</option>
                    <option value='weekly'>Weekly</option>
                    <option value='monthly'>Monthly</option>
                  </Select>
                </VStack>
              </Box>
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
                    onClick={signTransaction}
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
                    onClick={sendTransactionToDatabase}
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
          </>
        )}
      </Flex>
    </Box>
  )
}

export default SetPrice

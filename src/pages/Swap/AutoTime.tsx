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
  Select,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import AutoTimeModal from './modals/autoTimeModal';
import { useUserSlippageTolerance } from "../../state/user/hooks";
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from "../../state";
import { autoSwapV2, rigelToken, SmartSwapRouter, otherMarketPriceContract } from '../../utils/Contracts';
import { RGPADDRESSES, AUTOSWAPV2ADDRESSES, WNATIVEADDRESSES, SMARTSWAPROUTER, OTHERMARKETADDRESSES } from '../../utils/addresses';
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { changeFrequencyTodays } from '../../utils/utilsFunctions';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { refreshTransactionTab } from '../../state/transaction/actions';



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
  const [signatureFromDataBase, setSignatureFromDataBase] = useState(false)
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("5")
  const [marketType, setMarketType] = useState("smartswap")
  const [percentageChange, setPercentageChange] = useState<string>("0")
  const [priceOut, setPriceOut] = useState<string>("")
  const [otherMarketprice, setOtherMarketprice] = useState<string>("0")
  const [approval, setApproval] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [totalNumberOfTransaction,setTotalNumberOfTransaction] = useState(4)
  const [situation,setSituation] = useState("above")
  const [checkedItem, setCheckedItem] = useState(false)
  const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
  const [expectedPrice, setExpectedPrice] = useState(0)

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
  useEffect(() => {
    setURL("http://localhost:7000")
    async function runCheck() {
      if (account) {
        await checkForApproval()
      }
    }
    runCheck()
  }, [currencies[Field.INPUT],typedValue, account])
  useEffect(() => {
    async function checkIfSignatureExists() {
      let user = await fetch(`http://localhost:7000/auto/data/${account}`)
      let data = await user.json()
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
    setCheckedItem(false)
  }, [account])

  // const checkIfSignatureExists = async () => {
  //   await if
  // }
  
  const deadline = useSelector<RootState, number>(
    (state) => state.user.userDeadline
  );
  const [allowedSlippage] = useUserSlippageTolerance();

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


  useMemo(async () => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      let price = (parseFloat(percentageChange) /100)* Number(formattedAmounts[Field.OUTPUT]) + Number(formattedAmounts[Field.OUTPUT])
      console.log({price})
      setExpectedPrice(price)

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
  useEffect(() => {
    if(percentageChange>0){
      let price = (parseFloat(percentageChange) /100)* Number(formattedAmounts[Field.OUTPUT]) + Number(formattedAmounts[Field.OUTPUT])
      console.log({price})
      setExpectedPrice(price) 
    }else{
      setExpectedPrice(Number(formattedAmounts[Field.OUTPUT]))
    }
           
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue,percentageChange])

  const minimumAmountToReceive = useCallback(
    () =>{
      let data
      if(percentageChange && expectedPrice){
       data = ((100 - Number(allowedSlippage / 100)) / 100) * expectedPrice
      }else{
       data = ((100 - Number(allowedSlippage / 100)) / 100) *
      Number(formattedAmounts[Field.OUTPUT])
      
      }
      return data
    },      
    [allowedSlippage, bestTrade]
  );
  const minimum = minimumAmountToReceive().toFixed(
    currencies[Field.OUTPUT]?.decimals
  );
  
    useEffect(async () => {
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
  }, [chainId, currencies[Field.INPUT], currencies[Field.OUTPUT],  typedValue,marketType])
  const checkForApproval = async () => {
    const autoSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    // check approval for RGP and the other token
    const RGPBalance = await checkApprovalForRGP(RGPADDRESSES[chainId as number]) ?? "0"
    const tokenBalance = currencies[Field.INPUT]?.isNative ? 1 : await checkApproval(currencies[Field.INPUT]?.wrapped.address)
    const amountToApprove = await autoSwapV2Contract.fee()
    const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
    console.log(parseFloat(RGPBalance),parseFloat(tokenBalance),parseFloat(fee),Number(formattedAmounts[Field.INPUT]),parseFloat(RGPBalance) > parseFloat(fee),currencies[Field.INPUT]?.wrapped.symbol,parseFloat(tokenBalance) >= Number(formattedAmounts[Field.INPUT]))
    if (parseFloat(RGPBalance) >= parseFloat(fee)) {
      setHasBeenApproved(true)
      console.log(7777777777771)
    }else{
      setHasBeenApproved(false)
      setApproval(["RGP"])
    }
    if(parseFloat(tokenBalance) >= Number(formattedAmounts[Field.INPUT])){
      setHasBeenApproved(true)
      console.log(8888888) 
    } 
    if (parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]) && currencies[Field.INPUT]?.wrapped.symbol !== "RGP") {
      console.log(2,currencies[Field.INPUT].wrapped.symbol)
      setHasBeenApproved(false)
      setApproval([currencies[Field.INPUT].wrapped.symbol])
    }
    if (parseFloat(RGPBalance) < parseFloat(fee) || (currencies[Field.INPUT]?.wrapped.symbol === "RGP" && parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]))) {
      console.log(5)
      setHasBeenApproved(false)
      console.log([...approval,'RGP'])
      setApproval([...approval,'RGP'])
    }
    // else if (parseFloat(RGPBalance) < parseFloat(fee) && parseFloat(tokenBalance) <= Number(formattedAmounts[Field.INPUT]) && currencies[Field.INPUT]?.wrapped.symbol !== "RGP") {
    //   setHasBeenApproved(false)
    //   setApproval(["RGP", currencies[Field.INPUT]?.wrapped.symbol])
    // } 
    
  }

  const signTransaction = async () => {
    if (account !== undefined) {
      try {
        let web3 = new Web3(Web3.givenProvider);
        const permitHash = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";

        const mess = web3.utils.soliditySha3(permitHash)

        let signature = await web3.eth.sign(mess, account);

        var sig = ethers.utils.splitSignature(signature)
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
        if (arr[0] === "RGP" || arr[1]==="RGP") {
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

          arr && arr.length > 1 ? setApproval(arr && [arr[1]]) : setApproval([])
        } 
        if ((arr[0] === currencies[Field.INPUT]?.symbol || arr[1] === currencies[Field.INPUT]?.symbol) && (arr[0] !== "RGP" || arr[1]!=="RGP")) {
          const address = currencies[Field.INPUT]?.wrapped.address;
          console.log({address})
          const token = await getERC20Token(address, library);
          const walletBal = (await token.balanceOf(account)) + 4e18;
          const approveTransaction = await token.approve(
            AUTOSWAPV2ADDRESSES[chainId as number],
            walletBal,
            {
              from: account,
            }
          );
          console.log(approveTransaction)
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

    const autoSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    dispatch(
      setOpenModal({
        message: `Signing initial transaction between ${currencies[Field.INPUT]?.symbol} and ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    let currentDate = new Date();
    let futureDate = currentDate.getTime() + deadline;
    let data, response
    if (currencies[Field.INPUT]?.isNative) {
      
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(
        currencies[Field.OUTPUT]?.wrapped.address,
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
      const changeFrequencyToday = changeFrequencyTodays(selectedFrequency)
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
          frequency: selectedFrequency,
          frequencyNumber: changeFrequencyToday.days,
          presentDate: changeFrequencyToday.today,
          presentInterval: changeFrequencyToday.interval,
          fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
          toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
          signature: signedTransaction,
          percentageChange,
          toNumberOfDecimals: currencies[Field.OUTPUT]?.isNative ? 18 : currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: typedValue,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          type: "Auto Time",
          totalNumberOfTransaction,
          slippage:Number(allowedSlippage / 100),
          minimum,
          situation

        })
      })
      const res = await response.json()
      dispatch(
        setOpenModal({
          message: "Successfully stored Transaction",
          trxState: TrxState.TransactionSuccessful,
        })
      );
      dispatch(refreshTransactionTab({ refresh:Math.random() }))
      onUserInput(Field.INPUT, "");
      setApproval([])
      setSignatureFromDataBase(true)
      setCheckedItem(false)
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
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px"  px={3} py={3}  mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} width="100%">
                  <To
                    onUserOutput={handleTypeOutput}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    value=""

                    display={true}
                  />
                </Box>

                {/* <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px">
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                      {isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])}
                    </Text>
                    <Text fontSize="14px" color={color} textAlign="right" width="160px">
                      -2.56
                    </Text>
                  </VStack>
                </Box> */}
                <Box  borderColor={borderTwo} borderWidth="2px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2} bg={buttonBgcolor}>
                  <Flex>
                  <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{ color: "#319EF6" }}
        fontSize="13px"
        textTransform={'capitalize'}
        border ="1px solid white"
      >
       {marketType}
      </MenuButton>
      <MenuList>
        {["Smartswap","Pancakeswap","Sushiswap"].map((item:string,index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={(e) => setMarketType(item)} fontSize="13px">
         {item}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                        {marketType==="smartswap"?
                        isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])
                        : otherMarketprice}
                      </Text>
                      <Text fontSize="14px" color={color}  width="160px">
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
                  <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{ color: "#319EF6" }}
        fontSize="13px"
        textTransform={'capitalize'}
        border ="1px solid white"
      >
      5 minutes
      </MenuButton>
      <MenuList>
        {["5","30","daily","weekly","monthly"].map((item:string,index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={(e) => setSelectedFrequency(item)} fontSize="13px">
         {parseInt(item) ? `${item} minutes` : item}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>
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

              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" px={3} py={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>

                  <To
                    onUserOutput={handleTypeOutput}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    display={true}
                    value=""
                  />
                </Box>

                {/* <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px" mt="2" >
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                      {isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])}
                    </Text>
                    <Text fontSize="14px" color={color} textAlign="right"  width="160px">
                      -2.56
                    </Text>
                  </VStack>
                </Box> */}
                <Box  borderColor={borderTwo} borderWidth="2px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2} bg={buttonBgcolor}>
                  <Flex>
                  <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{ color: "#319EF6" }}
        fontSize="13px"
        textTransform={'capitalize'}
        border ="1px solid white"
      >
       {marketType}
      </MenuButton>
      <MenuList>
        {["Smartswap","Pancakeswap","Sushiswap"].map((item:string,index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={(e) => setMarketType(item)} fontSize="13px">
         {item}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} textAlign="right" isTruncated width="160px" >
                      {marketType==="smartswap"?
                        isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : parseFloat(formattedAmounts[Field.OUTPUT])
                        : otherMarketprice}
                      </Text>
                      <Text fontSize="14px" color={color}  width="160px" textAlign="right">
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
                  <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{ color: "#319EF6" }}
        fontSize="13px"
        textTransform={'capitalize'}
        border ="1px solid white"
      >
      5 minutes
      </MenuButton>
      <MenuList>
        {["5","30","daily","weekly","monthly"].map((item:string,index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={(e) => setSelectedFrequency(item)} fontSize="13px">
         {parseInt(item) ? `${item} minutes` : item}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>
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
                  </Button> : approval.length > 0 || hasBeenApproved===false ? <Button
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
          </>
        )}
      </Flex>
      <AutoTimeModal
        showModal={showModal}
        setShowModal={setShowModal}
        from={currencies[Field.INPUT]?.symbol}
        to={currencies[Field.OUTPUT]?.symbol}
        title="Confirm Auto time"
        inputLogo={currencies[Field.INPUT]?.logoURI}
        outputLogo={currencies[Field.OUTPUT]?.logoURI}
        frequency={selectedFrequency}
        percentageChange={percentageChange}
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={formattedAmounts[Field.OUTPUT]}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        setCheckedItem={setCheckedItem}
        checkedItem={checkedItem}
        minimumAmountToRecieve={minimum}
        expectedPrice={expectedPrice}
        slippage={Number(allowedSlippage / 100)}
        pathSymbol={pathSymbol}
        situation={situation}
      />
    </Box>
  )
}

export default SetPrice

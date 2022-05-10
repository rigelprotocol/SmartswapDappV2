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
  MenuItem,
  Tabs,
  TabList,
  Tab,
  Img,
  AlertDescription
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
import { useLocation } from 'react-router-dom';



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

  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [signatureFromDataBase, setSignatureFromDataBase] = useState(false)
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("5")
  const [marketType, setMarketType] = useState("Smartswap")
  const [percentageChange, setPercentageChange] = useState<string>("0")
  const [otherMarketprice, setOtherMarketprice] = useState<string>("0")
  const [approval, setApproval] = useState<string[]>([])
  const [approvalForFee, setApprovalForFee] = useState("")
  const [approvalForToken, setApprovalForToken] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [totalNumberOfTransaction,setTotalNumberOfTransaction] = useState("1")
  const [situation,setSituation] = useState("above")
  const [checkedItem, setCheckedItem] = useState(false)
  const [userOutputPrice, setUserOutputPrice] = useState<number>(0)
  const [currentToPrice,setCurrentToPrice] = useState("0")
  const [showNewChangesText,setShowNewChangesText] = useState(false)
  const [dataSignature,setDataSignature] = useState<{mess:string,signature:string}>({
    mess:"",
    signature:""
  })


  const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers();

  const {
    currencies,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
    pathSymbol,
    pathArray,
    oppositeAmount,
    unitAmount
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
    async function runCheck() {
      if (account) {
        await checkForApproval()
      }
    }
    runCheck()
  }, [currencies[Field.INPUT],typedValue, account])
 
  useEffect(() => {
    async function checkIfSignatureExists() {
      let user = await fetch(`https://rigelprotocol-autoswap.herokuapp.com/auto/data/${account}`)//http://localhost:7000
      let data = await user.json()
      if (data) {
        setDataSignature(data.dataSignature)
        setTransactionSigned(true)
        setSignatureFromDataBase(true)
      } else {
        setDataSignature({
          mess: "",
          signature:""
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
  const receivedAmount = Number(formattedAmounts[Field.OUTPUT]).toFixed(4);


  useMemo(() => {
    if(parseFloat(percentageChange) >0 && formattedAmounts[Field.OUTPUT]){
        const actualRecievedAmount = (parseFloat(percentageChange) / 100) * parseFloat(formattedAmounts[Field.OUTPUT]) + parseFloat(formattedAmounts[Field.OUTPUT])
        setUserOutputPrice(actualRecievedAmount)
    }else  if(parseFloat(percentageChange) <=0 && formattedAmounts[Field.OUTPUT]){
      setUserOutputPrice(parseFloat(formattedAmounts[Field.OUTPUT]))
    }else{
      setUserOutputPrice(0)
    }
    
    
  }, [percentageChange,formattedAmounts[Field.OUTPUT]]);
  const minimumAmountToReceive = useCallback(
    () =>{
      let data
      if(percentageChange && userOutputPrice){
       data = ((100 - Number(allowedSlippage / 100)) / 100) * userOutputPrice
      }else{
        data=0
      }
      return data
    },      
    [allowedSlippage, bestTrade,userOutputPrice]
  );
  const minimum = minimumAmountToReceive().toFixed(
    currencies[Field.OUTPUT]?.decimals
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

 
  
    useEffect(async () => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT] &&marketType!=="Smartswap") {
      console.log(OTHERMARKETADDRESSES[marketType][chainId as number],marketType,chainId)
      const rout = await otherMarketPriceContract(OTHERMARKETADDRESSES[marketType][chainId as number], library);
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
  
    let approvalArray:any=[]
    if (parseFloat(RGPBalance) >= parseFloat(fee)) {
      setHasBeenApproved(true)
      approvalArray=[]
      setApprovalForFee("")
      // setApprovalForToken("")
    }else{
      setApprovalForFee("RGP")
    }
    if(parseFloat(tokenBalance) >= parseFloat(formattedAmounts[Field.INPUT])){
      setHasBeenApproved(true)
      approvalArray=[]
      // setApprovalForFee("")
      setApprovalForToken("")
    } else{
      setApprovalForToken(currencies[Field.INPUT]?.wrapped?.symbol ?? "")
    }
    if (parseFloat(RGPBalance) < parseFloat(fee) || (parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]) && (!currencies[Field.INPUT]?.isNative && currencies[Field.INPUT]?.wrapped?.symbol === "RGP" ))) {
      setHasBeenApproved(false)
      approvalArray.push("RGP")
      setApprovalForFee("RGP")
      setApprovalForToken("RGP")
    }
    if (parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]) && (!currencies[Field.INPUT]?.isNative &&currencies[Field.INPUT]?.wrapped.symbol !== "RGP")) {
      setHasBeenApproved(false)
      approvalArray.push(currencies[Field.INPUT]?.wrapped?.symbol)
      setApprovalForToken(currencies[Field.INPUT]?.wrapped?.symbol ?? "")
    }
   
    setApproval(Array.from(new Set(approvalArray)))
    
  }

  const signTransaction = async () => {
    if (account !== undefined) {
      // try {
        let web3 = new Web3(Web3.givenProvider);
        const permitHash = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";

         const mess = web3.utils.soliditySha3(permitHash)
        
         if(account && mess){
          let signature = await web3.eth.personal.sign(mess, account,"12348844");
       var sig = ethers.utils.splitSignature(signature)
        const ecRec = await web3.eth.personal.ecRecover(mess,signature)
        setDataSignature({mess,signature})
        setTransactionSigned(true)
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

  const approveOneOrTwoTokens = async (tokenApprovingFor:string) => {
  console.log({approvalForFee,approvalForToken})
    if (currencies[Field.INPUT]?.isNative) {
      setHasBeenApproved(true);
      setApproval(approval.filter(t => t !== currencies[Field.INPUT]?.name))
    }
    console.log({tokenApprovingFor})
    // let setArr = Array.from(new Set(approval))
    // if (setArr.length > 0) {
      try {
        dispatch(
          setOpenModal({
            message: `Approve ${tokenApprovingFor} ${tokenApprovingFor ==="RGP" ? "for fee" : ""}`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        if (tokenApprovingFor === "RGP") {
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
          // setArr =setArr.filter(item=>item!=="RGP")
          const { confirmations } = await approveTransaction.wait(1);
          if (confirmations >= 1 ) {
            dispatch(
              setOpenModal({
                message: `Approval Successful.`,
                trxState: TrxState.TransactionSuccessful,
              })
            );
          }
            setApprovalForFee("")
          // setArr && setApproval(setArr)
        } else {
          const address = currencies[Field.INPUT]?.wrapped.address;
          const token = address && await getERC20Token(address, library);
          const walletBal = (await token?.balanceOf(account)) + 4e18;
          const approveTransaction = await token?.approve(
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
          // setArr && setApproval(setArr.filter(item=>item!==currencies[Field.INPUT]?.wrapped.symbol))
        }
        setApprovalForToken("")
      } catch (e) {
        console.log(e)
      }
    // } else {
    //   dispatch(
    //     setOpenModal({
    //       message: `Approval Failed.`,
    //       trxState: TrxState.TransactionFailed,
    //     })
    //   );
    // }

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
    console.log({pathArray,futureDate},Web3.utils.toWei(typedValue, 'ether'))
    if (currencies[Field.INPUT]?.isNative) {
      
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(
        pathArray,
        futureDate,
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
      const changeFrequencyToday = changeFrequencyTodays(selectedFrequency)//
      console.log({pathSymbol,pathArray})
      const response = await fetch(`https://rigelprotocol-autoswap.herokuapp.com/auto/add`, {
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
          dataSignature,
          percentageChange,
          toNumberOfDecimals: currencies[Field.OUTPUT]?.isNative ? 18 : currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: typedValue,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          type: "Auto Time",
          userExpectedPrice: userOutputPrice,
          totalNumberOfTransaction:parseInt(totalNumberOfTransaction),
          slippage:Number(allowedSlippage / 100),
          pathArray,
          minimum,
          situation,
          pathSymbol
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
      setShowNewChangesText(false);
    }

  }


  const checkApproval = async (tokenAddress: string):Promise<string | void> => {
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
          <Box mb="90px">
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
                    disable={true}
                    display={true}
                  />
                </Box>
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
        <Flex>
          <Img src={`./images/${marketType}.png`} width="25px" height="25px" mr="1" /> <Text mt="1">{marketType}</Text>
        </Flex>
       
      </MenuButton>
      <MenuList>
        {[{name:"Smartswap",image:"Smartswap.png"},{name:"Pancakeswap",image:"Pancakeswap.png"},{name:"Sushiswap",image:"Sushiswap.png"}].map((item:{name:string,image:string},index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={() => setMarketType(item.name)} fontSize="13px">
         <Img src={`./images/${item.image}`} width="30px" height="30px" mr={2} />{item.name}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                        {marketType==="Smartswap"?
                        isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : formattedAmounts[Field.OUTPUT]
                        : otherMarketprice}
                      </Text>
                      {/* <Text fontSize="14px" color={color}  width="160px">
                        -2.67
                      </Text> */}
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Box mt={5}>
                <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px" cursor="pointer">
                  <VectorIcon />
                </Center>
                <Spacer />
                {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                  <>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.INPUT]?.symbol} = {unitAmount} {currencies[Field.OUTPUT]?.symbol}
                    </Text>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.OUTPUT]?.symbol} = {oppositeAmount} {currencies[Field.INPUT]?.symbol}
                    </Text>
                    <ExclamationIcon />
                  </>

                }

              </Box>
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
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                  <Text fontSize="14px" mr={2} ml="-63px">
                      Range
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <Box>
                    <Tabs
            colorScheme="#2D276A"
            background="#F2F5F8"
            borderRadius="4px"
            // ml="-63px"
          >
            <TabList>
              <Tab
                // padding="8px 34px"
                padding="7px"
                background={situation==="above" ? "#319EF6" : ""}
                color={situation!=="above" ? "#319EF6" : ""}
                borderRadius="4px"
                border="none"
                onClick={() => setSituation('above')}
                                isDisabled ={parseFloat(percentageChange)<=0 || percentageChange ===""?true:false}
              >
                Above
              </Tab>
              <Tab
                padding="7px"
                background={situation==="below" ? "#319EF6" : ""}
                color={situation!=="below" ? "#319EF6" : ""}
                border="none"
                borderRadius="4px"
                onClick={() => setSituation('below')}
                                isDisabled ={parseFloat(percentageChange)<=0 || percentageChange ===""?true:false}
              >
                Below
              </Tab>
            </TabList>
          </Tabs>
                  </Box>
          
                </VStack>
                <Spacer />
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Frequency
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="80px" value={totalNumberOfTransaction} type="number" onChange={e => {
                      setTotalNumberOfTransaction(e.target.value)
                    }} />
                    <InputRightAddon children="times" fontSize="16px"padding="3px" />
                  </InputGroup>
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
                    onClick={() => {
                      setCurrentToPrice(receivedAmount)
                      setShowModal(!showModal)
                    }}
                    h="48px"
                    p="5px"
                    color={color}
                    bgColor={buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Sign Wallet
                  </Button> :  approvalForToken ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    onClick={()=>approveOneOrTwoTokens(approvalForToken)}
                    color={color}
                    bgColor={buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Approve {approvalForToken}
                  </Button> : approvalForFee ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    onClick={()=>approveOneOrTwoTokens(approvalForFee)}
                    color={color}
                    bgColor={buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Approve RGP for fee
                  </Button> : <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    color={color}
                    bgColor={buttonBgcolor}
                    onClick={()=>
                      {
                      setCurrentToPrice(receivedAmount)
                      signatureFromDataBase ? 
                      setShowModal(!showModal)
                     : sendTransactionToDatabase()
                    }}
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
          </Box>
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
        padding={1}
      >
        <Flex>
          <Img src={`./images/${marketType}.png`} width="25px" height="25px" mr="1" /> <Text mt="1">{marketType}</Text>
        </Flex>
       
      </MenuButton>
      <MenuList>
        {[{name:"Smartswap",image:"Smartswap.png"},{name:"Pancakeswap",image:"Pancakeswap.png"},{name:"Sushiswap",image:"Sushiswap.png"}].map((item:{name:string,image:string},index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={() => setMarketType(item.name)} fontSize="13px">
         <Img src={`./images/${item.image}`} width="30px" height="30px" mr={2} />{item.name}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} textAlign="right" isTruncated width="160px" >
                      {marketType==="Smartswap"?
                        isNaN(parseFloat(formattedAmounts[Field.OUTPUT])) ? "0" : formattedAmounts[Field.OUTPUT]
                        : otherMarketprice}
                      </Text>
                      {/* <Text fontSize="14px" color={color}  width="160px" textAlign="right">
                        -2.67
                      </Text> */}
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Box mt={5}>
                {/* <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px" cursor="pointer">
                  <VectorIcon />
                </Center>
                <Spacer /> */}
                {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                  <>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                    1 {currencies[Field.INPUT]?.symbol} = {unitAmount} {currencies[Field.OUTPUT]?.symbol}
                    </Text>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.OUTPUT]?.symbol} = {oppositeAmount} {currencies[Field.INPUT]?.symbol}
                    </Text>
                    <ExclamationIcon />
                  </>

                }


              </Box>
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
        padding={1}
      >
      5 minutes
      </MenuButton>
      <MenuList>
        {["5","30","60","daily","weekly","monthly"].map((item:string,index)=>(
          <MenuItem key={index} _focus={{ color: "#319EF6" }} onClick={(e) => setSelectedFrequency(item)} fontSize="13px">
         {parseInt(item) ? `${item} minutes` : item}
        </MenuItem>
        ))

        }
        
      </MenuList>
    </Menu>
                </VStack>
              </Box>
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2} ml="-63px">
                      Range
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <Box>
                    <Tabs
            colorScheme="#2D276A"
            background="#F2F5F8"
            borderRadius="4px"
            // ml="-63px"
          >
            <TabList>
              <Tab
                // padding="8px 34px"
                padding="7px"
                background={situation==="above" ? "#319EF6" : ""}
                color={situation!=="above" ? "#319EF6" : ""}
                borderRadius="4px"
                border="none"
                onClick={() => setSituation('above')}
                                isDisabled ={parseFloat(percentageChange)<=0 || percentageChange ===""?true:false}
              >
                Above
              </Tab>
              <Tab
                padding="7px"
                background={situation==="below" ? "#319EF6" : ""}
                color={situation!=="below" ? "#319EF6" : ""}
                border="none"
                borderRadius="4px"
                onClick={() => setSituation('below')}
                isDisabled ={parseFloat(percentageChange)<=0 || percentageChange ===""?true:false}
              >
                Below
              </Tab>
            </TabList>
          </Tabs>
                  </Box>
                </VStack>
                <Spacer />
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Frequency
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="80px" value={totalNumberOfTransaction} type="number" onChange={e => {
                      parseInt(e.target.value)<=0 ? setTotalNumberOfTransaction("1") :
                      setTotalNumberOfTransaction(e.target.value)
                    }} />
                    <InputRightAddon children="times" fontSize="16px"padding="3px" />
                  </InputGroup>
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
                  </Button> :  approvalForToken ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    onClick={()=>approveOneOrTwoTokens(approvalForToken)}
                    color={color}
                    bgColor={buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Approve {approvalForToken}
                  </Button> : approvalForFee ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    onClick={()=>approveOneOrTwoTokens(approvalForFee)}
                    color={color}
                    bgColor={buttonBgcolor}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Approve RGP for fee
                  </Button> :<Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    h="48px"
                    p="5px"
                    color={color}
                    bgColor={buttonBgcolor}
                    onClick={()=>
                      {
                      setCurrentToPrice(receivedAmount)
                      signatureFromDataBase ? 
                      setShowModal(!showModal)
                     : sendTransactionToDatabase()
                    }}
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
        numberOfTransaction={totalNumberOfTransaction}
        percentageChange={percentageChange}
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={userOutputPrice.toString()}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        setCheckedItem={setCheckedItem}
        checkedItem={checkedItem}
        minimumAmountToRecieve={minimum}
        slippage={Number(allowedSlippage / 100)}
        showNewChangesText={showNewChangesText}
        pathSymbol={pathSymbol}
        situation={situation}
      />
    </Box>
  )
}

export default SetPrice

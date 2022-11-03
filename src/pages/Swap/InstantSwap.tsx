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
import { binanceTestFreeMarketArray,binanceFreeMarketArray,polygonFreeMarketArray } from "../../state/swap/hooks"
import { getERC20Token } from '../../utils/utilsFunctions';
import { Field } from '../../state/swap/actions';
import Web3 from 'web3';
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
  AlertDescription,
  Spinner
} from '@chakra-ui/react';
import AutoTimeModal from './modals/autoTimeModal';
import { io } from "socket.io-client";
import { useUserSlippageTolerance } from "../../state/user/hooks";
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from "../../state";
import { autoSwapV2, rigelToken } from '../../utils/Contracts';
import { RGPADDRESSES, OTHERMARKETADDRESSES,MARKETFREESWAPADDRESSES, OTHERMARKETFACTORYADDRESSES, RGP } from '../../utils/addresses';
import { setOpenModal, setRefresh, TrxState } from "../../state/application/reducer";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { refreshTransactionTab } from '../../state/transaction/actions';
import { GButtonClick, GFailedTransaction, GSuccessfullyTransaction } from '../../components/G-analytics/gIndex';
import { useHistory, useLocation } from 'react-router-dom';
import { GetAddressTokenBalance } from '../../state/wallet/hooks';
import { addToast } from '../../components/Toast/toastSlice';
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import MarketFreeDropDown from '../../components/MarketFreeDropdown';
import BridgeCard from './components/bridgeCard';



const InstantSwap = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = useLocation().pathname
  console.log({location},location.search.includes("bsc_test"))
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const routerBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgcolor = useColorModeValue("#319EF6", "#4CAFFF");
  const color = useColorModeValue('#999999', '#7599BD');
  const switchBgcolor = useColorModeValue("#F2F5F8", "#213345");
  const lightmode = useColorModeValue(true, false);
  const borderTwo = useColorModeValue('#319EF6', '#4CAFFF');
  const { account, library, chainId } = useActiveWeb3React()

  const { independentField, typedValue } = useSwapState();

  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [signatureFromDataBase, setSignatureFromDataBase] = useState(false)
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [socket,setSocket] = useState <any>(null)
  const [marketType, setMarketType] = useState(location.search.includes("bsc_test") || location.search.includes("pn_mumbai") ? "Smartswap" : location.search.includes("bsc") ? "Pancakeswap" : location.search.includes("avalanche") ?"Tradejoe" : "Quickswap")
  const [percentageChange, setPercentageChange] = useState<string>("0")
  const [approvalForFee, setApprovalForFee] = useState("")
  const [fee, setFee] = useState("")
  const [approvalForToken, setApprovalForToken] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [totalNumberOfTransaction,setTotalNumberOfTransaction] = useState("1")
  const [situation,setSituation] = useState("above")
  const [userOutputPrice, setUserOutputPrice] = useState<number>(0)
  const [currentToPrice,setCurrentToPrice] = useState("0")
  const [quantity,setQuantity] = useState< string>("0")
  const [showNewChangesText,setShowNewChangesText] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [dataSignature,setDataSignature] = useState<{mess:string,signature:string}>({
    mess:"",
    signature:""
  })

  const routerHistory = useHistory()
  const { onCurrencySelection, onUserInput, onSwitchTokens, onMarketSelection, } = useSwapActionHandlers();

  const {
    currencies,
    bestTrade,
    parsedAmount,
    getMaxValue,
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
 useEffect(()=>{
  setMarketType(location.search.includes("bsc_test") || location.search.includes("pn_mumbai") ? "Smartswap" : location.search.includes("bsc") ? "Pancakeswap" : location.search.includes("avalanche") ?"Tradejoe" : "Quickswap")
   let market = pathname.split("/").length===3? pathname.split("/")[2]:""
   checkIfMarketExists(market,chainId)

 },[pathname,chainId])

  const switchMarket = (market:string)=>{
    routerHistory.push(`/freeswap/${market}`)
  }
  useEffect(() => {
    async function checkIfSignatureExists() {
      
        setTransactionSigned(false)
        setSignatureFromDataBase(false)
    }
    if (account) {
      checkIfSignatureExists()
      getFee()
    }
  }, [account,chainId,marketType])
  useEffect(
    () => {
  setSocket(io("https://autoswap-server.herokuapp.com"));//https://autoswap-server.herokuapp.com
  
    },
    []
  )

  useEffect(() => {
    socket?.on("instant",(res:any)=>{
        setShowNewChangesText(false);
        setHasBeenApproved(true);
        const explorerLink = getExplorerLink(
          chainId as number,
          res.transactionHash,
          ExplorerDataType.TRANSACTION
        );
        console.log({formattedAmounts,currencies,Field})
       
        // setDataSignature({mess:"",signature:""})
        // setTransactionSigned(false)
        // setSignatureFromDataBase(false)
      
        // dispatch(
        //   addToast({
        //     message: `Swap ${formattedAmounts[Field.INPUT]} ${
        //       currencies[Field.INPUT]?.symbol
        //     } for ${formattedAmounts[Field.OUTPUT]} ${currencies[Field.OUTPUT]?.symbol}`,
        //     URL: explorerLink,
        //   })
        // );
            // onUserInput(Field.INPUT, "");
        dispatch(
          setOpenModal({
            message: `Swap Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        )
    })
    
}, [socket]);

  const [allowedSlippage] = useUserSlippageTolerance();
  const getFee =async () => {
    const autoSwapV2Contract = await autoSwapV2(MARKETFREESWAPADDRESSES[marketType][chainId as number], library);
    try{
      const amountToApprove = await autoSwapV2Contract.fee()
      console.log({amountToApprove},MARKETFREESWAPADDRESSES[marketType][chainId as number])
    const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
    // const fee= "10"
    setFee(fee)
    return fee 
    }catch(e){
      console.log("ERROR",e)
    }
   
  }
  const checkIfMarketExists = (market:string,chainId:number| undefined) => {
    let marketArray:any
    if(chainId === 56) marketArray = binanceFreeMarketArray
    else if(chainId === 97) marketArray = binanceTestFreeMarketArray
    else if(chainId === 137) marketArray = polygonFreeMarketArray
    if(marketArray && marketArray.find((item:any)=> item.name.toLowerCase() ===market.toLowerCase())){
      let item = marketArray.find((item:any)=> item.name.toLowerCase() ===market.toLowerCase())
      setMarketType(item.name.charAt(0).toUpperCase() + item.name.slice(1))
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
  const receivedAmount = Number(formattedAmounts[Field.OUTPUT]).toFixed(4);
  const [balance] = GetAddressTokenBalance(
    currencies[Field.INPUT] ?? undefined
  );
  useEffect(() => {
    const checkBalance = async ()=>{
     if(currencies[Field.INPUT]?.symbol==="RGP"){
      let fee =await getFee()
      let amount = fee ? parseFloat(formattedAmounts[Field.INPUT]) + parseFloat(fee) : parseFloat(formattedAmounts[Field.INPUT])
      if(amount > parseFloat(balance) ){
        setInsufficientBalance(true);
      }else{
        setInsufficientBalance(false);
      }
    }else{
     if (balance < parseFloat(formattedAmounts[Field.INPUT])) {
      setInsufficientBalance(true);
    } else {
      setInsufficientBalance(false);
    } 
    } 
    }
    
   checkBalance()
  }, [balance, formattedAmounts[Field.INPUT],totalNumberOfTransaction]);
  useEffect(() => {
    async function runCheck() {
      if (!inputError) {
        await checkForApproval()
      }
    }
    runCheck()
  }, [inputError, formattedAmounts[Field.INPUT],totalNumberOfTransaction,transactionSigned])

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
      if(userOutputPrice){
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

 
  
    useEffect(() => {      
      console.log({marketType})
      console.log(OTHERMARKETFACTORYADDRESSES[marketType][chainId as number],OTHERMARKETADDRESSES[marketType][chainId as number])
      onMarketSelection(OTHERMARKETFACTORYADDRESSES[marketType][chainId as number],OTHERMARKETADDRESSES[marketType][chainId as number])
    // }
  }, [chainId,marketType])
  
  const checkForApproval = async () => { 
    const autoSwapV2Contract = await autoSwapV2(MARKETFREESWAPADDRESSES[marketType][chainId as number], library);
    
    // check approval for RGP and the other token
    // const RGPBalance = await checkApprovalForRGP(RGPADDRESSES[chainId as number]) ?? "0"
    const RGPBalance = "10" ?? "0"
    const tokenBalance = currencies[Field.INPUT]?.isNative ? 1 : await checkApproval(currencies[Field.INPUT]?.wrapped.address)
    const amountToApprove = await autoSwapV2Contract.fee()
    const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
    
    // const fee ="10"
    const frequency = parseInt(totalNumberOfTransaction) > 1 ? parseInt(totalNumberOfTransaction) : 1
    if (parseFloat(RGPBalance) >= parseFloat(fee)) {
      setHasBeenApproved(true)
      setApprovalForFee("")
      // setApprovalForToken("")
    }else{
      setApprovalForFee("RGP")
    }
    if((parseFloat(tokenBalance) >= (parseFloat(formattedAmounts[Field.INPUT]) * frequency)+parseFloat(fee)) && currencies[Field.INPUT]?.wrapped?.symbol === "RGP"){
      setHasBeenApproved(true)
      // setApprovalForFee("")
      setApprovalForToken("")
    }
    if(parseFloat(tokenBalance) >= (parseFloat(formattedAmounts[Field.INPUT]) * frequency) || currencies[Field.INPUT]?.isNative ){
      setHasBeenApproved(true)
      // setApprovalForFee("")
      setApprovalForToken("")
    } else{
      setApprovalForToken(currencies[Field.INPUT]?.wrapped?.symbol ?? "")
    }
    if (parseFloat(RGPBalance) < parseFloat(fee) || (parseFloat(tokenBalance) < parseFloat(formattedAmounts[Field.INPUT]) * frequency && (!currencies[Field.INPUT]?.isNative && currencies[Field.INPUT]?.wrapped?.symbol === "RGP" ))) {
      setHasBeenApproved(false)
      setApprovalForFee("RGP")
      setApprovalForToken("RGP")
    }
    if (parseFloat(tokenBalance) < parseFloat(formattedAmounts[Field.INPUT]) * frequency && (!currencies[Field.INPUT]?.isNative &&currencies[Field.INPUT]?.wrapped.symbol !== "RGP")) {
      setHasBeenApproved(false)
     
      setApprovalForToken(currencies[Field.INPUT]?.wrapped?.symbol ?? "")
    }
  }

  const runTransaction = () =>{
    setShowModal(!showModal);
   setQuantityValue()
   
  }

  const signTransaction = async () => {
    if (account !== undefined) {
      // try {
        let web3 = new Web3(Web3.givenProvider);
        const permitHash = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
        // const permitHash = process.env.REACT_APP_PERMIT_HASH;
         const mess = permitHash &&  web3.utils.soliditySha3(permitHash)
        
         if(account && mess){
          let signature = await web3.eth.personal.sign(mess, account,"12348844");
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
    if (currencies[Field.INPUT]?.isNative) {
      setHasBeenApproved(true);
      setApprovalForToken("")
    }
    
    GButtonClick("auto_period",`Approve ${tokenApprovingFor} ${tokenApprovingFor ==="RGP" ? "for fee" : ""}`,currencies[Field.INPUT]?.symbol)

        dispatch(
          setOpenModal({
            message: `Approve ${tokenApprovingFor} ${tokenApprovingFor ==="RGP" ? "for fee" : ""}`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        try{

        if (tokenApprovingFor === "RGP") {
          const address = RGPADDRESSES[chainId as number];
          const rgp = await rigelToken(RGP[chainId as number], library);
          const token = await getERC20Token(address, library);

        const frequency = parseInt(totalNumberOfTransaction) > 1 ? parseInt(totalNumberOfTransaction) : 1
          const walletBal = (await token.balanceOf(account));
         let walletBalString = parseFloat(ethers.utils.formatUnits(walletBal.toString(), currencies[Field.INPUT]?.decimals)) 

                   const amountToApprove = walletBalString > parseFloat(formattedAmounts[Field.INPUT]) * frequency ? walletBalString : parseFloat(formattedAmounts[Field.INPUT]) * frequency
          console.log({amountToApprove,walletBal,walletBalString})
          
          const approveTransaction = await rgp.approve(
            MARKETFREESWAPADDRESSES[marketType][chainId as number],
            ethers.utils.parseUnits(amountToApprove.toString(),currencies[Field.INPUT]?.decimals).toString(),
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
          GSuccessfullyTransaction("auto_period",`Approval ${tokenApprovingFor} ${tokenApprovingFor ==="RGP" ? "for fee" : ""}`,currencies[Field.INPUT]?.symbol)
            setApprovalForFee("")
          // setArr && setApproval(setArr)
        } else {
        const frequency = parseInt(totalNumberOfTransaction) > 1 ? parseInt(totalNumberOfTransaction) : 1
          const address = currencies[Field.INPUT]?.wrapped.address;
          const token = address && await getERC20Token(address, library);
          const walletBal = token && (await token?.balanceOf(account));
          let walletBalString = parseFloat(ethers.utils.formatUnits(walletBal.toString(), currencies[Field.INPUT]?.decimals)) 
          const amountToApprove = walletBalString > parseFloat(formattedAmounts[Field.INPUT]) * frequency ? walletBalString : parseFloat(formattedAmounts[Field.INPUT]) * frequency
          console.log({amountToApprove,walletBal})
          const approveTransaction = token && await token?.approve(
            MARKETFREESWAPADDRESSES[marketType][chainId as number],
            ethers.utils.parseUnits(amountToApprove.toString(),currencies[Field.INPUT]?.decimals).toString(),
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
          
          GSuccessfullyTransaction("freeswap","Approval",currencies[Field.INPUT]?.symbol)
        }
      }catch(e:any){
        GFailedTransaction("freeswap","approval",e.message,currencies[Field.INPUT]?.symbol)
      }
        setApprovalForToken("")
      

  }


const setQuantityValue =() =>{
  let value
 const quantity = typedValue && parseFloat(typedValue) * parseInt(totalNumberOfTransaction)
 if(currencies[Field.INPUT]?.isNative){
     setQuantity(`${quantity}`)
     value=quantity
}else{
  setQuantity(typedValue)
  value = typedValue
}
 return value
}

const handleMaxInput = async () => {
  const value = await getMaxValue(currencies[Field.INPUT], library);
  const maxAmountInput = maxAmountSpend(value, currencies[Field.INPUT]);
  if (maxAmountInput) {
    onUserInput(Field.INPUT, maxAmountInput);
  }
};

  const sendTransactionToDatabase = async () => {
    GButtonClick("auto_period","sending transaction to database",currencies[Field.INPUT]?.symbol,currencies[Field.OUTPUT]?.symbol)
    try{
      
     
    const autoSwapV2Contract = await autoSwapV2(MARKETFREESWAPADDRESSES[marketType][chainId as number], library);
    let value = setQuantityValue()
    dispatch(
      setOpenModal({
        message: `Swapping ${formattedAmounts[Field.INPUT]} ${
          currencies[Field.INPUT]?.symbol
        } for ${formattedAmounts[Field.OUTPUT]} ${
          currencies[Field.OUTPUT]?.symbol
        }`,
        trxState: TrxState.WaitingForConfirmation,
        text:"Processing"
      })
    );
    let currentDate = new Date();
    let futureDate = currentDate.getTime() + 20;
    let data, response
    try{ 
       
       if (currencies[Field.INPUT]?.isNative) {
   console.log(currencies[Field.INPUT],currencies)
      console.log({value},Web3.utils.toWei(value.toString(), 'ether'),"uuuu",futureDate,pathArray)
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(
        pathArray,
        futureDate,
        { value: Web3.utils.toWei(value.toString(), 'ether') }
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
      // quantity = typedValue
    }
    }catch(e){
      console.log({e})
    
    }
    // setQuantity(quantity)
    let orderID = await autoSwapV2Contract.orderCount()
   
    if (response && value) {
     
      const response = await fetch(`https://autoswap-server.herokuapp.com/auto/instant`, {
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
          fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
          toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
          dataSignature,
          fromNumberOfDecimals: currencies[Field.INPUT]?.isNative ? 18 : currencies[Field.INPUT]?.wrapped.decimals,
          type:"free",
          toNumberOfDecimals: currencies[Field.OUTPUT]?.isNative ? 18 : currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: `${value}`,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          slippage:Number(allowedSlippage / 100),
          pathArray,
          minimum,
          pathSymbol,
          market:marketType
        })
      })
      let resi =await response.json()
      console.log({resi}) 
        //  dispatch(refreshTransactionTab({ refresh:Math.random() }))
        // dispatch(setRefresh()) 
        // dispatch(
        //   setOpenModal({
        //     message: `Swap Successful.`,
        //     trxState: TrxState.TransactionSuccessful,
        //   })
        // );
         
  

        
      // else{
      //   dispatch(
      //     setOpenModal({
      //       message: `Swap Failed.`,
      //       trxState: TrxState.TransactionFailed,
      //     })
      //   ); 
      // }
      // GFailedTransaction("instant_swap","swapping transaction in the database","error",currencies[Field.INPUT]?.symbol,currencies[Field.OUTPUT]?.symbol)
  
     
      // setShowNewChangesText(false);
    }
  }
  catch(e){
    console.log({e},"koo4ok4koo4")
    GFailedTransaction("auto_period","storing transaction to database","error",currencies[Field.INPUT]?.symbol,currencies[Field.OUTPUT]?.symbol)
    // dispatch(
    //   setOpenModal({
    //     message: "Swapping Transaction failed",
    //     trxState: TrxState.TransactionFailed,
    //   })
    // );
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
        MARKETFREESWAPADDRESSES[marketType][chainId as number],
        {
          from: account,
        }
      )
      let frequency = parseInt(totalNumberOfTransaction) > 1 ? parseInt(totalNumberOfTransaction) : 1

      const approveBalance = ethers.utils.formatUnits(check.toString(), currencies[Field.INPUT]?.decimals) 
      return parseFloat(approveBalance)
    } catch (e) {
      console.log(e)
    }

  }
  const checkApprovalForRGP = async (tokenAddress: string) => {

    try {
      const status = await rigelToken(tokenAddress, library);
      const check = await status.allowance(
        account,
        MARKETFREESWAPADDRESSES[marketType][chainId as number],
        {
          from: account,
        }
      )
      const approveBalance = ethers.utils.formatEther(check).toString()
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
          onMax={handleMaxInput}
          value={formattedAmounts[Field.INPUT]}
          placeholder="0.0"
        />
              <Flex justifyContent="center" onClick={onSwitchTokens}>
                <SwitchIcon />
              </Flex>
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px"  px={3} py={3}  mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} width="100%">
                <To
          onCurrencySelection={onCurrencySelection}
          currency={currencies[Field.OUTPUT]}
          otherCurrency={currencies[Field.INPUT]}
          value={formattedAmounts[Field.OUTPUT]}
          onUserOutput={handleTypeOutput}
          placeholder="0.0"
        />
                </Box>
                <Box  borderColor={borderTwo} borderWidth="2px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2} bg={routerBgcolor}>
                  <Flex>
                  <MarketFreeDropDown marketType={marketType} setMarketType={setMarketType} chainID={chainId} switchMarket={switchMarket}/>

                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne} isTruncated width="160px" textAlign="right">
                        {formattedAmounts[Field.OUTPUT]}
                      </Text>
                      {/* <Text fontSize="14px" color={color}  width="160px">
                        -2.67
                      </Text> */}
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Flex mt={10} justifyContent="space-between">
                  <Text fontSize="16px">Fee:</Text> <Text fontSize="16px" opacity="0.7" ml={1}>{currencies[Field.INPUT]?.isNative ? "Not Free" : "Free"}</Text>
                </Flex>
            
              <Box mt={5}>
              {insufficientBalance || inputError ?( 
            <Button
              w='100%'
              borderRadius='6px'
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h='48px'
              p='5px'
              mt={1}
              disabled={inputError !== undefined || insufficientBalance}
              color={inputError ? color : "#FFFFFF"}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize='18px'
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
            >
              {inputError
                ? inputError
                : `Insufficient ${currencies[Field.INPUT]?.symbol} Balance ${currencies[Field.INPUT]?.symbol==="RGP" ? "for fee":""}`}
            </Button>) : !transactionSigned ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    
                    onClick={() => {
                      setCurrentToPrice(receivedAmount)
                      setShowModal(!showModal)
                      GButtonClick("auto_period","sign wallet",currencies[Field.INPUT]?.symbol,currencies[Field.OUTPUT]?.symbol)
                    }}
                    h="48px"
                    p="5px"
                    color={inputError ? color : "#FFFFFF"}
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
                    color={inputError ? color : "#FFFFFF"}
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
                    color={inputError ? color : "#FFFFFF"}
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
                    color={inputError ? color : "#FFFFFF"}
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
              <BridgeCard/> 
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
          onMax={handleMaxInput}
          value={formattedAmounts[Field.INPUT]}
          placeholder="0.0"
        />
              <Flex justifyContent="center" onClick={onSwitchTokens}>
                <SwitchIcon />
              </Flex>

              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" px={3} py={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>

                <To
          onCurrencySelection={onCurrencySelection}
          currency={currencies[Field.OUTPUT]}
          otherCurrency={currencies[Field.INPUT]}
          value={formattedAmounts[Field.OUTPUT]}
          onUserOutput={handleTypeOutput}
          placeholder="0.0"
        />

                </Box>

              
                <Box  borderColor={borderTwo} borderWidth="2px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2} bg={routerBgcolor}>
                  <Flex>
                  <MarketFreeDropDown marketType={marketType} setMarketType={setMarketType} chainID={chainId} switchMarket={switchMarket}/>

                    <Spacer />
                    <VStack>
                      {/* <Text fontSize="24px" color={textColorOne} textAlign="right" isTruncated width="160px" >
                      {formattedAmounts[Field.OUTPUT]}
                      </Text> */}
                    </VStack>
                  </Flex>
                </Box>
              </Box>

             
               <Flex mt={10} justifyContent="space-between">
               <Text fontSize="16px">Fee:</Text> <Text fontSize="16px" opacity="0.7" ml={1}>{currencies[Field.INPUT]?.isNative ? "Not Free" : "Free"}</Text>
                </Flex>
              <Box mt={5}>
                {insufficientBalance || inputError ?( 
            <Button
              w='100%'
              borderRadius='6px'
              border={lightmode ? "2px" : "none"}
              borderColor={borderColor}
              h='48px'
              p='5px'
              mt={1}
              disabled={inputError !== undefined || insufficientBalance}
              color={inputError ? color : "#FFFFFF"}
              bgColor={inputError ? switchBgcolor : buttonBgcolor}
              fontSize='18px'
              boxShadow={lightmode ? "base" : "lg"}
              _hover={{ bgColor: buttonBgcolor }}
            >
              {inputError
                ? inputError
                : `Insufficient ${currencies[Field.INPUT]?.symbol} Balance ${currencies[Field.INPUT]?.symbol==="RGP" && "for fee"}`}
            </Button>) : !transactionSigned ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    
                    onClick={() => {
                      setCurrentToPrice(receivedAmount)
                      setShowModal(!showModal)
                      GButtonClick("auto_period","sign wallet",currencies[Field.INPUT]?.symbol,currencies[Field.OUTPUT]?.symbol)
                    }}
                    h="48px"
                    p="5px"
                    color={inputError ? color : "#FFFFFF"}
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
                   color={inputError ? color : "#FFFFFF"}
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
                   color={inputError ? color : "#FFFFFF"}
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
                    color={inputError ? color : "#FFFFFF"}
                    bgColor={buttonBgcolor}
                    onClick={()=>
                      {
                      setCurrentToPrice(receivedAmount)
                      signatureFromDataBase ? runTransaction() : sendTransactionToDatabase()
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
              <BridgeCard /> 
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
        title="Confirm Freeswap"
        inputLogo={currencies[Field.INPUT]?.logoURI}
        instant={true}
        outputLogo={currencies[Field.OUTPUT]?.logoURI}
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={userOutputPrice.toString()}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        minimumAmountToRecieve={minimum}
        slippage={Number(allowedSlippage / 100)}
        showNewChangesText={showNewChangesText}
        pathSymbol={pathSymbol}
        quantity={currencies[Field.INPUT]?.isNative ? quantity : ""}
        market={marketType}
      />
    </Box>
  )
}

export default InstantSwap

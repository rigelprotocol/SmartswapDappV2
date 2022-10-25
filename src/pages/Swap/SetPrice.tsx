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
  HStack,
  VStack,
  Input,
  Square,
  Slider,
  Spinner
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
import { autoSwapV2, rigelToken } from '../../utils/Contracts';
import { RGPADDRESSES, MARKETAUTOSWAPADDRESSES, OTHERMARKETFACTORYADDRESSES, OTHERMARKETADDRESSES } from '../../utils/addresses';
import { RGP } from '../../utils/addresses';
import { useDispatch,useSelector } from "react-redux";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { RootState } from "../../state";
import { refreshTransactionTab } from '../../state/transaction/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { binanceTestMarketArray,polygonMarketArray,binanceMarketArray } from "../../state/swap/hooks"
import MarketDropDown from '../../components/MarketDropDown';
import { useHistory } from 'react-router-dom';
import SliderComponent from '../../components/Slider';
import { useLocation } from 'react-router-dom';
import { GetAddressTokenBalance } from '../../state/wallet/hooks';


const SetPrice = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const lightmode = useColorModeValue(true, false);
  const routerBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgcolor = useColorModeValue("#319EF6", "#4CAFFF");
  const switchBgcolor = useColorModeValue("#F2F5F8", "#213345");
  const dispatch = useDispatch();
  const color = useColorModeValue('#999999', '#7599BD');
  const location = useLocation().pathname;

  const { onCurrencySelection, onUserInput, onSwitchTokens,onMarketSelection } = useSwapActionHandlers();
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
    unitAmount,
    oppositeAmount
  } = useDerivedSwapInfo();

  const [URL, setURL] = useState("https://autoswap-server.herokuapp.com")//https://autoswap-server.herokuapp.com
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [disableInput, setDisableInput] = useState(true)
  const [initialFromPrice, setInitialFromPrice] = useState("")
  const [initialToPrice, setInitialToPrice] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [differenceInPrice, setDifferenceInPrice] = useState(0)
  const [signatureFromDataBase, setSignatureFromDataBase] = useState(false)
  
  const [positiveSliderValue, setPositiveSliderValue] = useState(0)
  const [negativeSliderValue, setNegativeSliderValue] = useState(-1)
  const [showTooltip, setShowTooltip] = useState(false)
  const [toPrice, setToPrice] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [approvalForFee, setApprovalForFee] = useState("")
  const [marketType, setMarketType] = useState("Smartswap")
  const [approvalForToken, setApprovalForToken] = useState("")
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [totalNumberOfTransaction, setTotalNumberOfTransaction] = useState("1")
  const [approval, setApproval] = useState<String[]>([])
  const [fee, setFee] = useState("")
  const [name, setName] = useState("+")
  const [shakeInput, setShakeInput] = useState<boolean>(false)
  const [dataSignature,setDataSignature] = useState<{mess:string,signature:string}>({
    mess:"",
    signature:""
  })
  
  const routerHistory = useHistory()
  useEffect(() => {      
    onMarketSelection(OTHERMARKETFACTORYADDRESSES[marketType][chainId as number],OTHERMARKETADDRESSES[marketType][chainId as number])
  // }
}, [chainId,marketType])
useEffect(() => {
  async function checkIfSignatureExists() {
    
      setTransactionSigned(false)
      setSignatureFromDataBase(false)
  }
  if (account) {
    checkIfSignatureExists()
    getFee()
  }
}, [account])

  const [balance] = GetAddressTokenBalance(
    currencies[Field.INPUT] ?? undefined
  );

  const deadline = useSelector<RootState, number>(
    (state) => state.user.userDeadline
  );
  useEffect(()=>{
    let market = location.split("/").length===3? location.split("/")[2]:""
    checkIfMarketExists(market,chainId)
 
  },[location,chainId])
  useEffect(()=>{
 if(parseFloat(initialToPrice) >0){
      const percent = (name==="+" ? positiveSliderValue/100 : negativeSliderValue/100) * parseFloat(basePrice)
      const value = parseFloat(basePrice) + percent

      value > 0 ? setInitialToPrice(value.toString()) : setInitialToPrice("0")
      
    } 
  },[positiveSliderValue,negativeSliderValue])
  
  const checkIfMarketExists = (market:string,chainId:number| undefined) => {
    let marketArray:any
    if(chainId === 56) marketArray = binanceMarketArray
    else if(chainId === 97) marketArray = binanceTestMarketArray
    else if(chainId === 137) marketArray = polygonMarketArray
    if(marketArray && marketArray.find((item:any)=> item.name.toLowerCase() ===market.toLowerCase())){
      let item = marketArray.find((item:any)=> item.name.toLowerCase() ===market.toLowerCase())
      setMarketType(item.name.charAt(0).toUpperCase() + item.name.slice(1))
    }
  }

  const { independentField, typedValue } = useSwapState();

  useEffect(() => {
    async function runCheck() {
      if (account  && currencies[Field.INPUT]) {

        await checkForApproval()
      }
    }
    runCheck()
  }, [currencies[Field.INPUT],typedValue, account])

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const [allowedSlippage] = useUserSlippageTolerance();

  useEffect(() => {
    if(parseFloat(initialFromPrice) >0 && negativeSliderValue===-1  && positiveSliderValue===0 && unitAmount && oppositeAmount){
      setInitialToPrice(unitAmount)
      setBasePrice(unitAmount)
    }
    if (parseFloat(initialToPrice) > 0 && parseFloat(initialFromPrice) > 0) {
      setDisableInput(false)
      // setShakeInput
      let difference = parseFloat(initialToPrice) / parseFloat(initialFromPrice)
      setDifferenceInPrice(difference)
      if (typedValue) {
        setToPrice(parseFloat(typedValue) * difference)
      }
    } else {
      setDisableInput(true)
    }
  }, [initialToPrice, initialFromPrice, typedValue])
 
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
  useEffect(() => {
    const checkBalance = async ()=>{
     if(currencies[Field.INPUT]?.symbol==="RGP"){
      let fee =await getFee()
      let amount = parseFloat(formattedAmounts[Field.INPUT]) + parseFloat(fee)
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
  }, [balance, formattedAmounts[Field.INPUT]]);
  const minimumAmountToReceive = useCallback(
    () =>{
      let data
      if(toPrice){
       data = ((100 - Number(allowedSlippage / 100)) / 100) * toPrice
      }else{
        data=0
      }
      return data
    },      
    [allowedSlippage, bestTrade,toPrice]
  );
  const getFee =async () => {
    const autoSwapV2Contract = await autoSwapV2(MARKETAUTOSWAPADDRESSES[marketType][chainId as number], library);
    const amountToApprove = await autoSwapV2Contract.fee()
    const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
    setFee(fee)
    return fee
  }
  const minimum = minimumAmountToReceive().toFixed(
    currencies[Field.OUTPUT]?.decimals
  );
  const switchMarket = (market:string)=>{
    routerHistory.push(`/set-price/${market}`)
  }
  const sendTransactionToDatabase = async () => {
    const autoSwapV2Contract = await autoSwapV2(MARKETAUTOSWAPADDRESSES[marketType][chainId as number], library);
    dispatch(
      setOpenModal({
        message: `Signing initial transaction between ${currencies[Field.INPUT]?.symbol} and ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    let minutesToAdd = 20;
    let currentDate = new Date();
    let futureDate = currentDate.getTime() + minutesToAdd;
    let data, response,quantity
    if (currencies[Field.INPUT]?.isNative) {
      quantity = typedValue && parseFloat(typedValue) * parseInt(totalNumberOfTransaction)
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(

        currencies[Field.OUTPUT]?.wrapped.address,
        futureDate,
        // signedTransaction?.mess,
        // signedTransaction?.r,
        // signedTransaction?.s,
        // signedTransaction?.v,
        { value: Web3.utils.toWei(quantity.toString(), 'ether') }
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
      quantity= typedValue
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
          presentInterval: 0,
          fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
          toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
          userExpectedPrice: toPrice,
          percentageChange:"100",
          fromNumberOfDecimals: currencies[Field.INPUT]?.isNative ? 18 : currencies[Field.INPUT]?.wrapped.decimals,
          toNumberOfDecimals: currencies[Field.OUTPUT]?.isNative ? 18 : currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: quantity,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          type: "Set Price",
          initialToPrice,
          initialFromPrice,
          dataSignature,
          totalNumberOfTransaction:parseInt(totalNumberOfTransaction),
          slippage:Number(allowedSlippage / 100),
          minimum,
          pathArray,
          pathSymbol,
          market:marketType
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


  const signTransaction = async () => {
    if (account !== undefined) {
      // try {
        let web3 = new Web3(Web3.givenProvider);
        const permitHash = process.env.REACT_APP_PERMIT_HASH;

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
        setApproval(approval.filter(t => t !== currencies[Field.INPUT]?.name))
      }
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
              MARKETAUTOSWAPADDRESSES[marketType][chainId as number],
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
              MARKETAUTOSWAPADDRESSES[marketType][chainId as number],
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
    const checkForApproval = async () => {
      const autoSwapV2Contract = await autoSwapV2(MARKETAUTOSWAPADDRESSES[marketType][chainId as number], library);
      
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
  const checkApproval = async (tokenAddress: string) => {
    if (currencies[Field.INPUT]?.isNative) {
      return setHasBeenApproved(true);
    }
    try {
      const status = await getERC20Token(tokenAddress, library);
      const check = await status.allowance(
        account,
        MARKETAUTOSWAPADDRESSES[marketType][chainId as number],
        {
          from: account,
        }
      )
        const balance =await status.balanceOf(account)
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
        MARKETAUTOSWAPADDRESSES[marketType][chainId as number],
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
          borderRadius="6px" pl={3} pr={3} pb={5}
          // h="550px"
        >
          <SwapSettings />
          <Flex justifyContent="space-between">
             <Box>
                  <Flex>
                    <Text fontSize="14px" mr={2} my={2}>
                      Frequency <ExclamationIcon />
                    </Text>
                    
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="80px" value={totalNumberOfTransaction} type="number" onChange={e => {
                      parseInt(e.target.value)<=0 ? setTotalNumberOfTransaction("1") :
                      setTotalNumberOfTransaction(e.target.value)
                    }} />
                    <InputRightAddon children="times" fontSize="16px"padding="3px" />
                  </InputGroup>
                </Box>
                
                <Box>
                <Text fontSize="14px" mr={2} my={2}>
                      Router <ExclamationIcon />
                    </Text>
                    <MarketDropDown marketType={marketType} setMarketType={setMarketType} chainID={chainId} switchMarket={switchMarket}/>
                </Box>
          </Flex>
         
          <From
            onUserInput={handleTypeInput}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.INPUT]}
            otherCurrency={currencies[Field.OUTPUT]}
            onMax={handleMaxInput}
            value={formattedAmounts[Field.INPUT]}
            disable={disableInput}
            placeholder="3"
            onHover={()=>disableInput && setShakeInput(!shakeInput)}
          />
          <Flex justifyContent="center" onClick={onSwitchTokens}>
            <SwitchIcon />
          </Flex>
          <To
          onUserOutput={()=>{}}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={toPrice===0 ?"": `${toPrice}`}
            disable={disableInput}
            placeholder="6"
            onHover={()=>disableInput && setShakeInput(!shakeInput)}
          />
          
          

          <Box my={5}>
            {/* <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
              <VectorIcon />
            </Center> */}
            {/* <Flex>
            <Text fontSize="14px" color={iconColor} mr={2}>
              Set Price
            </Text>
            <ExclamationIcon />
          </Flex>
            <Spacer /> */}
             {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                  <>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.INPUT]?.symbol} = {unitAmount && parseFloat(unitAmount) >0 ? unitAmount :  <Spinner speed='0.65s' color='#999999' size="xs" />} {currencies[Field.OUTPUT]?.symbol}
                    </Text>
                    <Text fontSize="14px" mr={2} color={textColorOne}>
                      1 {currencies[Field.OUTPUT]?.symbol} = {oppositeAmount && parseFloat(oppositeAmount)>0 ? oppositeAmount :  <Spinner speed='0.65s' color='#999999' size="xs" />} {currencies[Field.INPUT]?.symbol}
                    </Text>
                    <ExclamationIcon />
                  </>

                }

          </Box>
          {/* <Input placeholder="0.00" size="lg" borderRadius={4} borderColor={borderColor} /> */}

          <Flex justifyContent="space-between">
          <Flex mt={10} justifyContent="space-between">
                  <Text fontSize="16px">Fee:</Text> <Text fontSize="16px" opacity="0.7" ml={1}>{fee} RGP</Text>
                </Flex>
            <SliderComponent 
          setSliderValue={setPositiveSliderValue}
          sliderValue={positiveSliderValue}
          setShowTooltip={setShowTooltip}
          showTooltip={showTooltip}
          start={1}
          stop={100}
          width="45%"
          name="+"
          setName={setName}
            />
          </Flex>
          <HStack>
          
            <CInput
              currency={currencies[Field.INPUT]}
              initialFromPrice={initialFromPrice}
              setInitialPrice={setInitialFromPrice}
              placeholder="1"
              shakeInput={shakeInput}
              showButton={false}
            />
            <Flex justifyContent="center">
              <RightIcon />
            </Flex>
            <CInput
              currency={currencies[Field.OUTPUT]}
              initialFromPrice={initialToPrice}
              setInitialPrice={setInitialToPrice}
              placeholder="2"
              showButton={true}
              shakeInput={shakeInput}
            />
          </HStack>
          <Flex justifyContent="flex-end">
          <SliderComponent 
            setSliderValue={setNegativeSliderValue}
            sliderValue={negativeSliderValue}
            setShowTooltip={setShowTooltip}
            showTooltip={showTooltip}
            start={-100}
          stop={0}
          width="45%"
          name="-"
          setName={setName}
            />
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
                // onClick={signTransaction}
                onClick={() => setShowModal(!showModal)}
                h="48px"
                p="5px"
                color={inputError ? color : "#FFFFFF"}
                bgColor={buttonBgcolor}
                fontSize="18px"
                boxShadow={lightmode ? 'base' : 'lg'}
                _hover={{ bgColor: buttonBgcolor }}
              >
                Sign Wallet
              </Button>  :  approvalForToken ? <Button
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
                  </Button>  : <Button
                w="100%"
                borderRadius="6px"
                border={lightmode ? '2px' : 'none'}
                borderColor={borderColor}
                h="48px"
                p="5px"
                color={inputError ? color : "#FFFFFF"}
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
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={toPrice}
        frequency={totalNumberOfTransaction}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        fromPrice={typedValue}
        pathSymbol={pathSymbol}
        minimumAmountToRecieve={minimum}
        slippage={Number(allowedSlippage / 100)}
      />
    </Box>
  )
}

export default SetPrice

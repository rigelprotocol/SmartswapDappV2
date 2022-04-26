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
  Input
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
import { RGP } from '../../utils/addresses';
import { useDispatch,useSelector } from "react-redux";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { RootState } from "../../state";
import { refreshTransactionTab, transactionTab } from '../../state/transaction/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';


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
    amounted,
    amounted2
  } = useDerivedSwapInfo();

  useEffect(() => {
    async function runCheck() {
      if (account) {

        await checkForApproval()
      }
    }
    runCheck()
  }, [currencies[Field.INPUT], account])
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
  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [totalNumberOfTransaction, setTotalNumberOfTransaction] = useState("1")
  const [approval, setApproval] = useState<String[]>([])
  const [shakeInput, setShakeInput] = useState<boolean>(false)
  const [dataSignature,setDataSignature] = useState<{mess:string,signature:string}>({
    mess:"",
    signature:""
  })


  useEffect(() => {
    async function checkIfSignatureExists() {

      let user = await fetch(`${URL}/auto/data/${account}`)
      let data = await user.json()
      if (data) {
        setDataSignature(data.dataSignature)
        setTransactionSigned(true)
        setSignatureFromDataBase(true)
      } else {
        setDataSignature({
          mess:"",
          signature:""
        })
        setTransactionSigned(false)
        setSignatureFromDataBase(false)
      }
    }
    if (account) {
      checkIfSignatureExists()

    }
  }, [account])
  const deadline = useSelector<RootState, number>(
    (state) => state.user.userDeadline
  );
  const { independentField, typedValue } = useSwapState();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const [allowedSlippage] = useUserSlippageTolerance();
  useEffect(() => {
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
  const minimum = minimumAmountToReceive().toFixed(
    currencies[Field.OUTPUT]?.decimals
  );
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
    let data, response
    if (currencies[Field.INPUT]?.isNative) {
      data = await autoSwapV2Contract.setPeriodToSwapETHForTokens(

        currencies[Field.OUTPUT]?.wrapped.address,
        futureDate,
        // signedTransaction?.mess,
        // signedTransaction?.r,
        // signedTransaction?.s,
        // signedTransaction?.v,
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
          presentInterval: 0,
          fromAddress: currencies[Field.INPUT]?.isNative ? "native" : currencies[Field.INPUT]?.wrapped.address,
          toAddress: currencies[Field.OUTPUT]?.isNative ? "native" : currencies[Field.OUTPUT]?.wrapped.address,
          userExpectedPrice: toPrice,
          percentageChange:"",
          toNumberOfDecimals: currencies[Field.OUTPUT]?.isNative ? 18 : currencies[Field.OUTPUT]?.wrapped.decimals,
          fromPrice: typedValue,
          currentToPrice: formattedAmounts[Field.OUTPUT],
          orderID: currencies[Field.INPUT]?.isNative ? parseInt(orderID.toString()) : parseInt(orderID.toString()) + 1,
          type: "Set Price",
          initialToPrice,
          initialFromPrice,
          dataSignature,
          totalNumberOfTransaction:parseInt(totalNumberOfTransaction),
          slippage:Number(allowedSlippage / 100),
          minimum,
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

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

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
        console.log({signature,sig,mess,ecRec})
        
        setDataSignature({mess,signature})
        setTransactionSigned(true)
         }


        // 
        // const provider =new ethers.providers.Web3Provider(window.ethereum) 
        // const signer = provider.getSigner()
        // const signature= await signer.signMessage(permitHash)
        // console.log({signature})
        
       

        // await checkForApproval()
      // } catch (e) {
      //   dispatch(
      //     setOpenModal({
      //       message: "Signing wallet failed",
      //       trxState: TrxState.TransactionFailed,
      //     })
      //   );
      // }

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
    let setArr = Array.from(new Set(approval))
    console.log({setArr})
    if (setArr.length > 0) {
      try {
        dispatch(
          setOpenModal({
            message: `Approve Token for Swap`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        if (setArr[0] === "RGP" || setArr[1]==="RGP") {
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
          const { confirmations } = await approveTransaction.wait(1);
          if (confirmations >= 1) {
            dispatch(
              setOpenModal({
                message: `Approval Successful.`,
                trxState: TrxState.TransactionSuccessful,
              })
            );
          }
            setArr =setArr.filter(item=>item!=="RGP")
          setArr && setApproval(setArr)
        } 
        console.log({setArr})
        if ((setArr[0] === currencies[Field.INPUT]?.symbol || setArr[1] === currencies[Field.INPUT]?.symbol) && (setArr[0] !== "RGP" || setArr[1]!=="RGP")) {
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
          const { confirmations } = await approveTransaction.wait(1);
          if (confirmations >= 1) {
            dispatch(
              setOpenModal({
                message: `Approval Successful.`,
                trxState: TrxState.TransactionSuccessful,
              })
            );
          }
          setArr && setApproval(setArr.filter(item=>item!==currencies[Field.INPUT]?.wrapped.symbol))
        }
        
      } catch (e) {
        console.log(e)
      }
    } else {
      dispatch(
        setOpenModal({
          message: `Approval Failed.`,
          trxState: TrxState.TransactionFailed,
        })
      );
    }

  }
  const checkForApproval = async () => {
    const autoSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    // check approval for RGP and the other token
    const RGPBalance = await checkApprovalForRGP(RGPADDRESSES[chainId as number]) ?? "0"
    const tokenBalance = currencies[Field.INPUT]?.isNative ? 1 : await checkApproval(currencies[Field.INPUT]?.wrapped.address)
    const amountToApprove = await autoSwapV2Contract.fee()
    const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
  
    let approvalArray=[]
    if (parseFloat(RGPBalance) >= parseFloat(fee)) {
      setHasBeenApproved(true)
      approvalArray=[]
    }
    if(parseFloat(tokenBalance) >= Number(formattedAmounts[Field.INPUT])){
      setHasBeenApproved(true)
      approvalArray=[]
    } 
    if (parseFloat(RGPBalance) < parseFloat(fee) || (parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]) && currencies[Field.INPUT]?.wrapped.symbol === "RGP")) {
      setHasBeenApproved(false)
      approvalArray.push("RGP")
    }
    if (parseFloat(tokenBalance) < Number(formattedAmounts[Field.INPUT]) && currencies[Field.INPUT]?.wrapped.symbol !== "RGP") {
      setHasBeenApproved(false)
      approvalArray.push(currencies[Field.INPUT]?.wrapped?.symbol)
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
          borderRadius="6px" pl={3} pr={3} pb={5}
          // h="550px"
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
            {currencies[Field.INPUT]?.symbol && currencies[Field.OUTPUT]?.symbol &&
            <>
             <Text fontSize="14px" mr={2} color={textColorOne}>
                1 {currencies[Field.INPUT]?.symbol} = {amounted} {currencies[Field.OUTPUT]?.symbol}
              </Text>
                <Text fontSize="14px" mr={2} color={textColorOne}>
                1 {currencies[Field.OUTPUT]?.symbol} = {amounted2} {currencies[Field.INPUT]?.symbol}
              </Text>
            </>
             
            }

            <ExclamationIcon />
          </Box>
          {/* <Input placeholder="0.00" size="lg" borderRadius={4} borderColor={borderColor} /> */}
          <HStack>
            <CInput
              currency={currencies[Field.INPUT]}
              initialFromPrice={initialFromPrice}
              setInitialPrice={setInitialFromPrice}
              placeholder="1"
              shakeInput={shakeInput}
            />
            <Flex justifyContent="center">
              <RightIcon />
            </Flex>
            <CInput
              currency={currencies[Field.OUTPUT]}
              initialFromPrice={initialToPrice}
              setInitialPrice={setInitialToPrice}
              placeholder="2"
              shakeInput={shakeInput}
            />
          </HStack>
          <Box display="flex" mt={5}>
                {/* <VStack>
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
              >
                Below
              </Tab>
            </TabList>
          </Tabs>
                  </Box>
                </VStack>
                <Spacer /> */}
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Frequency
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="50px" value={totalNumberOfTransaction} type="number" onChange={e => {
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
        buttonText={signatureFromDataBase ? "Send Transaction" : "Sign Wallet"}
        fromDeposited={formattedAmounts[Field.INPUT]}
        toDeposited={toPrice}
        signSignature={signatureFromDataBase ? sendTransactionToDatabase : signTransaction}
        setCheckedItem={setCheckedItem}
        checkedItem={checkedItem}
        fromPrice={typedValue}
        pathSymbol={pathSymbol}
        minimumAmountToRecieve={minimum}
        slippage={Number(allowedSlippage / 100)}
      />
    </Box>
  )
}

export default SetPrice

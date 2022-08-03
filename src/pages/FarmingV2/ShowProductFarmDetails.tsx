import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  useDisclosure,
  useColorModeValue,
  Box,
  Flex,
  Button,
  Text,
  Circle,
  Divider,
  Tooltip,
  Spinner,
  useMediaQuery,
  Skeleton,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { SupportedChainId } from "../../constants/chains";
import Switch from "react-switch";
import { DARK_THEME } from "./index";
import { addToast } from "../../components/Toast/toastSlice";
import { useDispatch } from "react-redux";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { getExplorerLink, ExplorerDataType } from "../../utils/getExplorerLink";
import {
  rigelToken,
 productStakingContract
} from "../../utils/Contracts";

import { calculateGas } from "../Swap/components/sendToken";
import {
  MASTERCHEFV2ADDRESSES,
  RGP,
  PRODUCTSTAKINGADDRESSES,
  RGPADDRESSES
} from "../../utils/addresses";
import { clearInputInfo, convertFromWei, convertToNumber } from "../../utils";
import { useRGPBalance } from "../../utils/hooks/useBalances";
import { updateFarmProductAllowances } from "../../state/farm/actions";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { Contract } from "@ethersproject/contracts";
import { formatAmount, getERC20Token } from "../../utils/utilsFunctions";
import { useUserGasPricePercentage } from "../../state/gas/hooks";

import {
  useUpdateFarm,
  useProductFarmDetails,
} from "../../state/newfarm/hooks";
import { GButtonClicked, GButtonIntialized, GFarmingFailedTransaction, GFarmingSpecialPoolReferral, GFarmingSuccessTransaction } from "../../components/G-analytics/gFarming";
import { ZERO_ADDRESS } from "../../constants";
import ProductModal from "./ProductFarmModal";


type FarmDetails = {
  content: {
    feature:string,
    percentageProfitShare:string,
    profitTimeLine:string,
    totalLiquidity:string,
    estimatedTotalProfit:string,
    pid:number,
    deposit:string,
    poolAllowance: "",
    type:string,
    RGPStaked:string
  };
  URLReferrerAddress?:string;
  wallet:any;
  refreshSpecialData:() =>void
}
const ShowProductFarmDetails = ({
  content,
  URLReferrerAddress,
  refreshSpecialData,
  wallet}:FarmDetails)=>{

  const { account, chainId, library } = useActiveWeb3React();
  const [depositTokenValue, setDepositTokenValue] = useState("");
  
  const [inputHasError, setInputHasError] = useState(false);
  const [errorButtonText, setErrorButtonText] = useState("");
  // const [referrerAddress, setReferrerAddress] = useState(URLReferrerAddress);
  const [referrerAddress, setReferrerAddress] = useState(ZERO_ADDRESS);
  const [unstakeButtonValue, setUnstakeButtonValue] = useState("Confirm");
  const [depositInputHasError, setDepositInputHasError] = useState(false);
  const [approveValueForRGP, setApproveValueForRGP] = useState(false);
  const [refAddressHasError, setRefAddressHasError] = useState(false);
  const filterBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const [minimumStakeAmount, setMinimumStakeAmount] = useState<string | number>(0);
  const [unstakeToken, setUnstakeToken] = useState("");
  const [depositErrorButtonText, setDepositErrorButtonText] = useState("");
  const [reload, setReload] = useState(false);
  
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approveValueForOtherToken, setApproveValueForOtherToken] =
    useState(false);
  const [isMobileDevice] = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();
  const mode = useColorModeValue("light", DARK_THEME);
  const modal1Disclosure = useDisclosure();
  const modal2Disclosure = useDisclosure();
  const [RGPBalance] = useRGPBalance();
  const [showReferrerField, setShowReferrerField] = useState(false);
  const [isReferrerCheck, setIsReferrerCheck] = useState(false);
  const [depositValue, setDepositValue] = useState("Confirm");
  const [feeAmount, setFeeAmount] = useState("0");
  const [allowUnstake, setAllowUnstake] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadingState } = useUpdateFarm({ reload, setReload, content });
  const [userGasPricePercentage] = useUserGasPricePercentage();
  useProductFarmDetails({
    content,
    setLoading,
    loading,
  });


  useEffect(async () => {
    setDepositInputHasError(false);
    setDepositErrorButtonText("");
    if (!account) {
      setDepositValue("Connect wallet");
    }
    if (depositTokenValue !== "") {
      if (
        isNaN(parseFloat(depositTokenValue)) ||
        !Math.sign(parseFloat(depositTokenValue)) ||
        Math.sign(parseFloat(depositTokenValue)) == -1
      ) {
        setDepositInputHasError(true);
        setDepositErrorButtonText("Invalid Input");
        return;
      } else if (
        parseFloat(content.RGPStaked) <= 0 &&
        Number(depositTokenValue) < Number(minimumStakeAmount)
      ) {
        setDepositInputHasError(true);
        setDepositErrorButtonText(
          `Minimum stake amount is ${minimumStakeAmount}`
        );
      }else if (parseFloat(depositTokenValue) > parseFloat(RGPBalance)) {
        setDepositInputHasError(true);
        setDepositErrorButtonText("Insufficient Balance");
      }else{
        let priceBalance = await getAllowances()
        if(priceBalance < depositTokenValue){
         setApproveValueForRGP(false)
        }
      }
    }
  }, [depositTokenValue]);
  useEffect(() => {
    setInputHasError(false);
    setErrorButtonText("");

    if (!account) {
      setUnstakeButtonValue("Connect wallet");
    }
    if (unstakeToken !== "") {
      if (
        isNaN(parseFloat(unstakeToken)) ||
        !Math.sign(parseFloat(unstakeToken)) ||
        Math.sign(parseFloat(unstakeToken)) == -1
      ) {
        setInputHasError(true);
        setErrorButtonText("Invalid Input");
        return;
      }
      if (
        parseFloat(unstakeToken) >
        parseFloat(content.RGPStaked)
      ) {
        setInputHasError(true);
        setErrorButtonText("Insufficient Balance");
      }
    }
  }, [unstakeToken, account]);
  
  useEffect(() => {
    const getMinimumStakeAmount = async () => {
      if (account) {
        try {
          const specialPool = await productStakingContract(
            PRODUCTSTAKINGADDRESSES[chainId as number],
            library
          );
          const minimumAmount = await specialPool.getMinimumStakeAmount();
          const unstaking = await specialPool.userUnstake();
          const fee = await specialPool.devPercentage();
          const minStakeAmount = Web3.utils.fromWei(minimumAmount.toString());
          const feeAmount = Web3.utils.fromWei(fee.toString());
          setMinimumStakeAmount(minStakeAmount);
          setFeeAmount(feeAmount)
          setAllowUnstake(unstaking)
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMinimumStakeAmount();
  }, [account]);

  useEffect(() => {
    

    if (!account) {
      // setFarmingFeeLoading(false);
    }

    const prodductFarmAllowance = async (contract: Contract) => {
      if (account) {
        const rgpApproval = await contract.allowance(
          account,
          PRODUCTSTAKINGADDRESSES[chainId as number]
        );
        return !(rgpApproval.toString() <= 0);
      }
    };


    const checkForApproval = async () => {
      const rgp = await rigelToken(RGP[chainId as number], library);
      // if (content.deposit === "RGP" && content.feature === "AT") {
        const specialPoolV1Approval = await prodductFarmAllowance(rgp);
        changeApprovalButton(true, specialPoolV1Approval);
      // } 
    };

    function changeApprovalButton(otherTokenApproval:Boolean, rgpApproval?:Boolean ) {
      if (otherTokenApproval && rgpApproval) {
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (otherTokenApproval) {
        setApproveValueForOtherToken(true);
      } else if (rgpApproval) {
        setApproveValueForRGP(true);
      } else {
        setApproveValueForRGP(false);
        setApproveValueForOtherToken(false);
      }
    }

    setApproveValueForRGP(false);
    setApproveValueForOtherToken(false);

    if (account) {
      checkForApproval();
    }
  }, [wallet, content, account]);

  const unstakeProductFarm = async (val:string) => {
    if (account) {
      try {
        const specialPool = await productStakingContract(
          PRODUCTSTAKINGADDRESSES[chainId as number],
          library
        );
        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();
        const data = await specialPool.unStake(
          ethers.utils.parseEther(unstakeToken.toString()), // user input from onclick shoild be here...
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
        const { confirmations, status } = await fetchTransactionData(data);
        GFarmingSuccessTransaction("special pool", "unstake", "RGP","v2")
        refreshSpecialData()
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully unstaked ${unstakeToken} RGP `,
          })
        );
        // dispatch the getTokenStaked action from here when data changes
        //  callRefreshFarm(confirmations, status);
      } catch (error:any) {
        GFarmingFailedTransaction("special pool", "unstake", error.message, "RGP","v2")
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
            message: `Transaction was not successful`,
          })
        );
      }
    }
  };

  async function confirmUnstakeDeposit(val: string) {
    try {
      GButtonIntialized("unstake product farm",content.deposit,"v2")
      dispatch(
        setOpenModal({
          message: `Unstaking ${unstakeToken} ${val}`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );

      if (account) {
      //   if (val === "RGP" && Number(content.id) === 1) {
      //     await RGPUnstake(val);
      //   } else if (val === "RGP" && Number(content.id) === 13) {
          await unstakeProductFarm(val);
        // } else {
          // tokensWithdrawal(content.id,val);
        // }
      }
    } catch (err) {
      console.log(err);
      dispatch(
        setOpenModal({
          message: `Failed transaction`,
          trxState: TrxState.TransactionFailed,
        })
      );
    }

    setTimeout(() => closeModal(), 400);
    clearInputInfo(setUnstakeToken, setUnstakeButtonValue, "Confirm");
  }
  const showMaxValue = async (deposit: any, input: any) => {
    try {
      if (input === "deposit") {
        GButtonClicked(`max_button for ${input}`,content.deposit,"v2")
        setDepositTokenValue(RGPBalance);
      } else if (input === "unstake") {
        setUnstakeToken(content.RGPStaked);
      }
    } catch (e) {
      console.log(
        "sorry there is a few error, you are most likely not logged in. Please login to your metamask extensition and try again."
      );
    }
  };


  const openDepositeModal = () => {
    //if (approveValueForOtherToken && approveValueForRGP) {
    modal1Disclosure.onOpen();
    // }
  };

  const closeModal = () => {
    GButtonIntialized("close unstaked",content.deposit,"v2")
    modal2Disclosure.onClose();
  };
  const FarmProductApproval = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Approving RGP`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        
        const rgp = await rigelToken(RGP[chainId as number], library);
        const walletBal = (await rgp.balanceOf(account));
        const data = await rgp.approve(
          PRODUCTSTAKINGADDRESSES[chainId as number],
          walletBal,
          {
            from: account,
            // gasLimit: 150000,
            // gasPrice: ethers.utils.parseUnits("20", "gwei"),
          }
        );
        setApprovalLoading(true);
        const { confirmations, status } = await fetchTransactionData(data);
        if (confirmations >= 3) {
          setApproveValueForRGP(true);
          GFarmingSuccessTransaction("product farm | auto period", "approval", "RGP","v1")
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful RGP Approval`,
            })
          );
        }
        getAllowances();
      } catch (error:any) {
        console.error(error);
        GFarmingFailedTransaction("product farm | auto period", "approval", error.message, "RGP","v1")
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
      setApprovalLoading(false);
    }
  };

  const setApprove = (val: string) => {
    if (approveValueForOtherToken && approveValueForRGP) {
      GButtonClicked("unstake",content.deposit,"v2")
      modal2Disclosure.onOpen();
    } else {
      GButtonClicked("approval",content.deposit,"v2")
      checkUser(val);
    }
  };

  const checkUser = async (val :string) => {
    if (content.deposit === "RGP" && content.feature) {
      await FarmProductApproval();
      setApproveValueForOtherToken(true);
      setApproveValueForRGP(true);
    }
  };


  const closeDepositeModal = () => {
    modal1Disclosure.onClose();
  };

 

  const allowance = (contract: Contract) =>
  contract.allowance(account, PRODUCTSTAKINGADDRESSES[chainId as number]);
 useEffect(() => {
    getAllowances();
  }, [account, depositTokenValue,unstakeToken]);
  const getAllowances = async () => {
    if (account) {
      try {
        const [
          RGPAllowances
        ] = await Promise.all([
          rigelToken(
            RGPADDRESSES[chainId as number],
            library
          ),
        ]);
        const [
          productStakingAllowance,
          ,
        ] = await Promise.all([
          allowance(RGPAllowances),
        ]);
        let rigelAllowance;
          rigelAllowance = productStakingAllowance;
          console.log({rigelAllowance,productStakingAllowance})
          dispatch(
            updateFarmProductAllowances([
              rigelAllowance,
            ])
          );
          return rigelAllowance
        
      } catch (error) {
        console.error(error, "something went wrong");
      }
    }
  };
 
  const enoughApproval = (allowance: any, balance: any) => {
    if (allowance && balance) {
      return content.type === "AT"
        ? parseFloat(allowance.toString()) >= parseFloat(balance)
        : parseFloat(allowance) > parseFloat(balance);
      // return content.type === "AT"
      //   ? allowance.gte(ethers.utils.parseEther(balance))
      //   : parseFloat(allowance) > parseFloat(balance);
    }
    return false;
  };

  const RGPProductStake = async () => {
    if (account) {
      try {
        const specialPool = await productStakingContract(
          PRODUCTSTAKINGADDRESSES[chainId as number],
          library
        );
       GFarmingSpecialPoolReferral(referrerAddress===ZERO_ADDRESS ? false:true)
        const data = await specialPool.stake(
          ethers.utils.parseEther(depositTokenValue.toString()),
          referrerAddress,
          {
            from: account,
            gasLimit: 200000,
            gasPrice: ethers.utils.parseUnits("20", "gwei"),
          }
        );
        await fetchTransactionData(data);
        GFarmingSuccessTransaction("Product farm | auto period", "stake", "RGP","v1")
        refreshSpecialData()
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully staked ${depositTokenValue} RGP `,
          })
        );
        // callRefreshFarm(confirmations, status);
      } catch (error:any) {
        console.log(error);
        GFarmingFailedTransaction("Product farm | auto period", "stake", error.message, "RGP","v1")
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
            
          })
        );
      }
    }
  };
  const approveLPToken = async (LPToken: any) => {
        checkUser(LPToken);

  };

  const confirmDeposit = async (val: any) => {
    setDepositValue("Pending Confirmation");
    GButtonIntialized("deposit",content.deposit,"v2")
    dispatch(
      setOpenModal({
        message: `Staking ${depositTokenValue} ${val}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    try {
      if (account) {
        // if (val === "RGP" && Number(content.id) === 1) {
        //   await RGPuseStake();
        // } else if (val === "RGP" && Number(content.id) === 13) {
          await RGPProductStake();
        // } else {
        //   LPDeposit(content.id,val);
      
        // }
      }
    } catch (error:any) {
      console.log(error);
      GFarmingFailedTransaction("Product farm | auto period", "stake", error.message, val,"v1")
      dispatch(
        setOpenModal({
          message: `Failed to deposit LP tokens.`,
          trxState: TrxState.TransactionFailed,
        })
      );
    }
    setTimeout(() => closeDepositeModal(), 400);
    //setDeposit(true);

    clearInputInfo(setDepositTokenValue, setDepositValue, "Confirm");
  };

  const fetchTransactionData = async (sendTransaction: any) => {
    const { confirmations, status, logs } = await sendTransaction.wait(1);

    return { confirmations, status, logs };
  };
  const approvalButton = (LPToken: any) => (
    <Button
      my='2'
      mx='auto'
      color='rgba(190, 190, 190, 1)'
      width='100%'
      background='rgba(64, 186, 213, 0.15)'
      cursor='pointer'
      border='none'
      borderRadius='0px'
      padding='10px'
      height='50px'
      fontSize='16px'
      _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
      onClick={() => {
        GButtonIntialized("approval",content.deposit,"v2")
        approveLPToken(LPToken)}}
    >
      {approvalLoading ? "Approving..." : "Approve"} {LPToken}
    </Button>
  );

  const handleSetReferralField = () => {
    if (showReferrerField === true && URLReferrerAddress === "") {
      setShowReferrerField(false);
      setReferrerAddress("0x0000000000000000000000000000000000000000");
      setIsReferrerCheck(true);
    } else if (showReferrerField === true && URLReferrerAddress !== "") {
      setShowReferrerField(false);
      setReferrerAddress(URLReferrerAddress);
      setIsReferrerCheck(true);
    } else if (showReferrerField === false && referrerAddress !== "") {
      setShowReferrerField(true);
      setReferrerAddress(referrerAddress);
      setIsReferrerCheck(false);
    }
  };

return (
  <>
  {loading ? (
     <Box p='6' border='1px' borderColor={filterBorderColor}>
     <Flex
       flexDirection={isMobileDevice ? "column" : "row"}
       justifyContent={isMobileDevice ? "center" : "space-between"}
       alignItems={isMobileDevice ? "center" : undefined}
     >
       <Flex flexDirection='column'>
         <Skeleton mt='4' mb={2} height='20px' w='208px' />

         <Flex>
           <Skeleton mr={2} height='20px' w='100px' />
           <Skeleton height='20px' w='100px' />
         </Flex>
       </Flex>

       <Flex ml={2} flexDirection='column'>
         <Skeleton mt='4' mb={2} height='20px' w='208px' />
         <Skeleton height='20px' w='208px' />
       </Flex>

       <Flex ml={2} flexDirection='column'>
         <Skeleton mt='4' mb={2} height='20px' w='208px' />
         <Skeleton height='20px' w='208px' />
       </Flex>

       <Flex ml={2} flexDirection='column'>
         <Skeleton mt='4' mb={2} height='20px' w='208px' />
         <Skeleton height='20px' w='208px' />
       </Flex>
     </Flex>
   </Box>
  ): (
    <Skeleton isLoaded={!loadingState ? true : false}>
      <Flex
  flexDirection={["column", "column", "row"]}
  color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
  background={mode === DARK_THEME ? "#213345" : "#F2F5F8"}
  padding='0 20px'
  paddingBottom={["20px","20px","0"]}
  border={
    mode === DARK_THEME ? "2px solid #324D68" : "2px solid #DEE6ED"
  }
  width='100%'
>
  <Box
    flexBasis='35%'
    width='100%'
    textAlign='right'
    display='flex'
    justifyContent='space-around'
  >
    <Box>
      <Flex
        my={2}
        mt={6}
        justify={{ base: "center", md: "none", lg: "none" }}
      >
        <Text
          color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
          fontSize='20px'
          marginRight='10px'
          fontWeight='bold'
        >
          {/* <Tooltip
            hasArrow
            label={content.tokensStaked[1]}
            bg='gray.300'
            color='black'
          >
            {parseFloat(content.tokensStaked[1]).toFixed(4)}
          </Tooltip> */}
          {content.RGPStaked}
        </Text>
        <Text
          fontSize='16px'
          color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}
        >
          RGP Tokens Staked
        </Text>
      </Flex>

      <Flex marginLeft={{ base: "20px", md: "none", lg: "none" }}>
      <Tooltip label={approveValueForRGP && !allowUnstake &&'available soon'}>
        <Button
          w='45%'
          h='40px'
          borderRadius='6px'
          bg={mode === DARK_THEME ? "#4CAFFF" : "#319EF6"}
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='6'
          disabled={(approveValueForRGP  && parseFloat(content.RGPStaked) <= 0) ||  (approveValueForRGP && !allowUnstake)}
          padding='10px 40px'
          cursor='pointer'
          onClick={() => {
            setApprove(content.deposit)}}
          // className={
          //   approveValueForRGP && approveValueForOtherToken
          //     ? "unstake"
          //     : "approve"
          // }
        >
          {approveValueForRGP
            ? "Unstake"
            : "Approve"}
          
        </Button>
        </Tooltip>
        <Button
          w='45%'
          h='40px'
          borderRadius='6px'
          bg={mode === DARK_THEME ? "#4CAFFF" : "#319EF6"}
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='6'
          padding='10px 40px'
          cursor='pointer'
          disabled={!approveValueForRGP}
          onClick={openDepositeModal}
          className={"deposit"}
        >
         Stake
        </Button>
      </Flex>
    </Box>
    <Box
      mx={1}
      my={3}
      display={{ base: "none", md: "block", lg: "block" }}
    >
      <Divider orientation='vertical' height='84px' />
    </Box>
  </Box>
  {/* margin={['0', '0', '0 20px']} */}
  <Box
    flexBasis='35%'
    width='100%'
    display='flex'
    justifyContent='space-around'
  >
    {isMobileDevice ? (
      <Box width='100%' margin='0 auto'>
        <Flex my={2} justifyContent="space-between" px={5}>
          <Text
            fontSize='20px'
            color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
            marginRight='10px'
            textAlign='center'
            fontWeight='bold'
          >
           To be earned
          </Text>{" "}
          <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"} textAlign="right" mt="5px">
            25% Profit Shares
          </Text>
        </Flex>
        
      </Box>
    ) : (
      <Box margin='0 auto'>
        <Box my={6}>
          <Text
            fontSize='20px'
            color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
            marginRight='10px'
            textAlign='center'
            fontWeight='bold'
          >
            To be earned
          </Text>{" "}
          <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"} fontSize='16px'  mt={2}>
          {content.percentageProfitShare} Profit Shares
          </Text>
        </Box>
      </Box>
    )}
    <Box
      my={3}
      display={{ base: "none", md: "block", lg: "block" }}
      mx={1}
    >
      <Divider orientation='vertical' height='84px' />
    </Box>
  </Box>
  <Box
                flexBasis='40%'
                width='100%'
                display='flex'
                justifyContent='space-around'
                
              >
                <Box mt={6}>
                  {
                    <Flex flexDirection={["row", "row", "column"]}>
                      <Text fontSize='20px'  fontWeight='bold'>
                       
                        Estimated Total Profit
                      </Text>
                      <Flex alignItems="center" mt={["4","4","0"]} justifyContent="center">
                        <Text
                          fontSize='16px'
                          color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}
                          marginLeft='30px'
                          textAlign="center"
                          mt={["-30px","-15px","2"]}

                        >
                          $ {formatAmount(content.estimatedTotalProfit) }
                        </Text>{" "}
                      </Flex>
                    </Flex>
                  }
                </Box>

                <Box
                  my={3}
                  mx={1}
                  display={{ base: "none", md: "block", lg: "block" }}
                >
                  <Divider orientation='vertical' height='84px' />
                </Box>
              </Box>
  <Box
    flexBasis='30%'
    width='100%'
    margin={["0", "0", "10px 20px"]}
    justifySelf='end'
  >
    <Flex flexDirection='column' alignItems={{ base: "center" }}>
      <Flex mb='5px'>
        <Text marginTop='15px'>Auto-Harvest</Text>
        <Circle
          size='20px'
          bg='#fff'
          display='inline-flex'
          marginLeft='10px'
          marginTop='17px'
          marginRight='10px'
        >
          <Tooltip
            label='Coming soon'
            fontSize='md'
            marginTop='15px'
          >
            <QuestionOutlineIcon color='#120136' cursor='pointer' />
          </Tooltip>
        </Circle>
      </Flex>
      <Flex>
        <Switch
          disabled
          // onChange={handleChecked}
          // checked={!checked}
          className='react-switch'
        />
      </Flex>
    </Flex>
  </Box>
 <ProductModal 
 modal1Disclosure={modal1Disclosure}
 closeDepositeModal={closeDepositeModal}
 setDepositTokenValue={setDepositTokenValue}
 depositTokenValue = {depositTokenValue}
 showMaxValue = {showMaxValue}
 deposit={content.deposit}
 minimumStakeAmount={minimumStakeAmount}
 RGPBalance={RGPBalance}
 showReferrerField={showReferrerField}
 URLReferrerAddress={URLReferrerAddress}
 setReferrerAddress={setReferrerAddress}
 referrerAddress={referrerAddress}
 handleSetReferralField={handleSetReferralField}
 isReferrerCheck={isReferrerCheck}
 depositInputHasError={depositInputHasError}
 refAddressHasError = {refAddressHasError}
 depositValue={depositValue}
 depositErrorButtonText={depositErrorButtonText}
 confirmDeposit={confirmDeposit}
 enoughApproval={enoughApproval}
 account={account}
 feeAmount={feeAmount}
 allowance={content.poolAllowance}
 approvalButton={approvalButton}
 approveValueForRGP ={approveValueForRGP}
 />

<ProductModal 
 modal1Disclosure={modal2Disclosure}
 closeDepositeModal={closeModal}
 depositTokenValue = {unstakeToken}
 showMaxValue = {showMaxValue}
 deposit={content.deposit}
 minimumStakeAmount={minimumStakeAmount}
 depositInputHasError={inputHasError}
 refAddressHasError = {refAddressHasError}
 depositValue={depositValue}
 setDepositTokenValue={setUnstakeToken}
 depositErrorButtonText={errorButtonText}
 confirmDeposit={confirmUnstakeDeposit}
 enoughApproval={enoughApproval}
 account={account}
 allowance={content.poolAllowance}
 approvalButton={approvalButton}
 approveValueForRGP ={true}
 RGPStaked = {content.RGPStaked}
 />

</Flex>
    </Skeleton>
  )}
  </>
  
)
}
export default ShowProductFarmDetails
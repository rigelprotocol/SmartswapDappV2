import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  InputRightElement,
  InputGroup,
  Input,
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
  Checkbox,
  Skeleton,
  SkeletonText,
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
  MasterChefV2Contract,
  RGPSpecialPool,
  RGPSpecialPool2,
  smartSwapLPTokenPoolOne,
  smartSwapLPTokenPoolTwo,
  smartSwapLPTokenPoolThree,
  smartSwapLPTokenV2PoolFour,
  smartSwapLPTokenV2PoolFive,
  rigelToken,
 productStakingContract
} from "../../utils/Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  RGP,
  PRODUCTSTAKINGADDRESSES
} from "../../utils/addresses";
import { clearInputInfo, convertFromWei, convertToNumber } from "../../utils";
import { useRGPBalance } from "../../utils/hooks/useBalances";
import { updateFarmProductAllowances } from "../../state/farm/actions";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import Joyride from "react-joyride";
import { steps } from "../../components/Onboarding/YieldSteps";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { getERC20Token } from "../../utils/utilsFunctions";
import { calculateGas } from "../Swap/components/sendToken";
import { useUserGasPricePercentage } from "../../state/gas/hooks";

import {
  useUpdateFarm,
  useFetchYieldFarmDetails,
  useProductFarmDetails,
} from "../../state/newfarm/hooks";
import { GButtonClicked, GButtonIntialized, GFarmingFailedTransaction, GFarmingSpecialPoolReferral, GFarmingSuccessTransaction } from "../../components/G-analytics/gFarming";
import { ZERO_ADDRESS } from "../../constants";


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
}
const ShowProductFarmDetails = ({
  content,
  URLReferrerAddress,
  wallet}:FarmDetails)=>{

  const bgColor = useColorModeValue("#FFF", "#15202B");
  const modalTextColor = useColorModeValue("#333333", "#F1F5F8");
  const modalTextColor2 = useColorModeValue("#666666", "#DCE6EF");
  const { account, chainId, library } = useActiveWeb3React();
  const [depositTokenValue, setDepositTokenValue] = useState("");
  const [referrerAddress, setReferrerAddress] = useState(URLReferrerAddress);
  const [depositInputHasError, setDepositInputHasError] = useState(false);
  const [approveValueForRGP, setApproveValueForRGP] = useState(false);
  const [refAddressHasError, setRefAddressHasError] = useState(false);
  const filterBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const [minimumStakeAmount, setMinimumStakeAmount] = useState<string | number>(
    0
  );
  console.log({URLReferrerAddress})
  const [depositErrorButtonText, setDepositErrorButtonText] = useState("");
  const [reload, setReload] = useState(false);
  
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approveValueForOtherToken, setApproveValueForOtherToken] =
    useState(false);
  const [isMobileDevice] = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();
  const mode = useColorModeValue("light", DARK_THEME);
  const modal1Disclosure = useDisclosure();
  const [RGPBalance] = useRGPBalance();
  const [showReferrerField, setShowReferrerField] = useState(true);
  const [isReferrerCheck, setIsReferrerCheck] = useState(false);
  const [depositValue, setDepositValue] = useState("Confirm");
  const [loading, setLoading] = useState(false);
  const { loadingState } = useUpdateFarm({ reload, setReload, content });
  useProductFarmDetails({
    content,
    setLoading,
    loading,
  });

  useEffect(() => {
    const getMinimumStakeAmount = async () => {
      if (account) {
        try {
          const specialPool = await productStakingContract(
            PRODUCTSTAKINGADDRESSES[chainId as number],
            library
          );
          const minimumAmount = await specialPool.getMinimumStakeAmount();
          const minStakeAmount = Web3.utils.fromWei(minimumAmount.toString());
          setMinimumStakeAmount(minStakeAmount);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMinimumStakeAmount();
    console.log({content})
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

  const openDepositeModal = () => {
    //if (approveValueForOtherToken && approveValueForRGP) {
    modal1Disclosure.onOpen();
    // }
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
        const walletBal = (await rgp.balanceOf(account)) + 400e18;
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
          // GFarmingSuccessTransaction("special pool", "approval", "RGP","v2")
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
        // GFarmingFailedTransaction("special pool", "approval", error.message, "RGP","v2")
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
      // modal2Disclosure.onOpen();
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

  const approveLPToken = async (LPToken: any) => {
    // switch (content?.type) {
    //   case "LP":
    //     const poolOne = await smartSwapLPTokenPoolOne(content.address, library);
    //     LPApproval(poolOne,content.deposit);
    //     break;

    //   default:
        RGPApproval();
        // break;
    // }
  };

  const allowance = (contract: Contract) =>
  contract.allowance(account, MASTERCHEFV2ADDRESSES[chainId as number]);

  const getAllowances = async () => {
    if (account) {
      try {
        const [
          productStaking
        ] = await Promise.all([
        
          productStakingContract(
            PRODUCTSTAKINGADDRESSES[chainId as number],
            library
          ),
        ]);

        const [
          productStakingAllowance,
          ,
        ] = await Promise.all([
          allowance(productStaking),
        ]);
        let rigelAllowance;
          rigelAllowance = productStakingAllowance;
        if (Number(chainId) === Number(SupportedChainId.BINANCE)) {
          dispatch(
            updateFarmProductAllowances([
              rigelAllowance,
            ])
          );
        } 
        // else {
        //   dispatch(
        //     updateFarmAllowances([
        //       rigelAllowance,
        //       pool2Allowance,
        //       pool1Allowance,
        //       pool3Allowance,
        //       pool4Allowance,
        //       pool5Allowance,
        //       pool6Allowance,
        //       pool7Allowance,
        //       pool8Allowance,
        //       pool9Allowance,
        //       pool12Allowance,
        //       pool13Allowance,
        //     ])
        //   );
        // }
      } catch (error) {
        console.error(error, "something went wrong");
      }
    }
  };
  const enoughApproval = (allowance: any, balance: any) => {
    if (allowance && balance) {
      //console.log(allowance.gt(ethers.utils.parseEther(balance)),ethers.utils.parseEther(balance),allowance.toString());

      return content.type === "RGP"
        ? allowance.gt(ethers.utils.parseEther(balance))
        : parseFloat(allowance) > parseFloat(balance);
    }
    return true;
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
        GFarmingSuccessTransaction("special pool", "stake", "RGP","v2")
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully staked ${depositTokenValue} RGP `,
          })
        );
        // callRefreshFarm(confirmations, status);
      } catch (error:any) {
        console.log(error);
        GFarmingFailedTransaction("special pool", "stake", error.message, "RGP","v2")
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
            
          })
        );
      }
    }
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
      GFarmingFailedTransaction("farming", "stake", error.message, val,"v2")
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
  const RGPApproval = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Approving RGP`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const rgp = await rigelToken(RGP[chainId as number], library);
        const walletBal = (await rgp.balanceOf(account)) + 400e18;
        const data = await rgp.approve(
          MASTERCHEFV2ADDRESSES[chainId as number],
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
          GFarmingSuccessTransaction("farming", "approval", "RGP","v2")
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful RGP Approval`,
            })
          );
        }
        getAllowances();
        setReload(true);
      } catch (error:any) {
        console.error(error);
        GFarmingFailedTransaction("farming", "approval", error.message ,"RGP","v2")
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
  paddingBottom='4px'
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
        <Button
          w='45%'
          h='40px'
          borderRadius='6px'
          bg={mode === DARK_THEME ? "#4CAFFF" : "#319EF6"}
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='6'
          disabled={
            approveValueForRGP 
            // &&
            // parseFloat(content.tokensStaked[1]) <= 0
          }
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
        <Button
          w='45%'
          h='40px'
          borderRadius='6px'
          // bg={
          //   mode === DARK_THEME && !approveValueForRGP
          //     ? "#319EF6"
          //     : "#4A739B"
          // }
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='6'
          padding='10px 40px'
          cursor='pointer'
          // disabled={
          //   !approveValueForRGP || !approveValueForOtherToken
          // }
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
      <Box width='60%' margin='0 auto'>
        <Flex my={2}>
          <Text
            fontSize='20px'
            color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
            marginRight='10px'
            textAlign='center'
            fontWeight='bold'
          >
           To be earned
          </Text>{" "}
          <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
            30% Profit Shares
          </Text>
        </Flex>
        {/* <Button
          w='95%'
          h='40px'
          margin='0 auto'
          borderRadius='6px'
          bg={mode === DARK_THEME ? "#4A739B" : "#999999"}
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='2'
          cursor='pointer'
          _hover={{ color: "white" }}
          // disabled={parseFloat(content.RGPEarned) <= 0}
          // onClick={() => {
          //   harvestTokens(
          //     content.deposit === "RGP" ? content.pId : content.id
          //   );
          // }}
          className={"harvest"}
        >
          Harvest
        </Button> */}
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
          <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
            25% Profit Shares
          </Text>
        </Box>
        {/* <Button
          w='95%'
          h='40px'
          margin='0 auto'
          borderRadius='6px'
          bg={mode === DARK_THEME ? "#4A739B" : "#999999"}
          color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
          border='0'
          mb='4'
          mr='2'
          cursor='pointer'
          _hover={{ color: "white" }}
          disabled={parseFloat(content.RGPEarned) <= 0}
          onClick={() => {
            harvestTokens(
              content.deposit === "RGP" ? content.pId : content.id
            );
          }}
          className={"harvest"}
        >
          Harvest
        </Button> */}
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
                <Box>
                  {
                    <Flex marginTop='10px' flexDirection={["row", "row", "column"]}>
                      <Text fontSize='24px' marginTop='15px' fontWeight='bold'>
                        {/* {FarmingFeeLoading ? (
                          <Spinner speed='0.65s' color='#999999' />
                        ) : (
                          farmingFee
                        )} */}
                        Estimated Total Profit
                      </Text>
                      <Flex alignItems="center" mt={["4","4","0"]} justifyContent="center">
                        <Text
                          fontSize='16px'
                          color={mode === DARK_THEME ? "#999999" : "#999999"}
                          marginLeft='30px'
                          textAlign="center"

                        >
                          {content.estimatedTotalProfit}
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
    margin={["0", "0", "0 20px"]}
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
  <Modal
              isOpen={modal1Disclosure.isOpen}
              onClose={closeDepositeModal}
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                width='95vw'
                borderRadius='6px'
                paddingBottom='20px'
                bgColor={bgColor}
                minHeight='40vh'
              >
                <ModalHeader
                  fontSize='20px'
                  fontWeight='regular'
                  color={modalTextColor}
                >
                 Stake
                </ModalHeader>

                <ModalCloseButton
                  bg='none'
                  size={"sm"}
                  mt={3}
                  mr={3}
                  cursor='pointer'
                  _focus={{ outline: "none" }}
                  p={"7px"}
                  border={"1px solid"}
                />
                <ModalBody py={2}>
                  <Text
                    color={modalTextColor}
                    mb={3}
                    fontSize='14px'
                    fontWeight='regular'
                  >
                    Enter Amount
                  </Text>
                  <InputGroup size='md'>
                    <Input
                      placeholder='Enter RGP amount to stake'
                      opacity='0.5'
                      h='50px'
                      borderRadius='6px'
                      name='availableToken'
                      value={depositTokenValue}
                      onChange={(e) => setDepositTokenValue(e.target.value)}
                      border='2px'
                    />
                    <InputRightElement marginRight='15px'>
                      <Button
                        color='rgba(64, 186, 213, 1)'
                        border='none'
                        borderRadius='0px'
                        fontSize='13px'
                        p='1'
                        mt='10px'
                        height='20px'
                        cursor='pointer'
                        background='none'
                        _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
                        // onClick={() => showMaxValue(content.deposit, "deposit")}
                      >
                        MAX
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Text color={modalTextColor2} fontSize='14px' mb={5} mt={3}>
                    Minimum Stake: {minimumStakeAmount} RGP
                  </Text>
                  <Text color={modalTextColor2} fontSize='14px' mb={5} mt={3}>
                    RGP Available: {RGPBalance} RGP
                  </Text>
                  <Box display={showReferrerField ? "block" : "none"}>
                    <Text color={modalTextColor} fontSize='14px' mb={3}>
                      Referrer address
                    </Text>
                    <InputGroup size='md'>
                      <Input
                        placeholder="Enter referrer's address here"
                        opacity='0.5'
                        h='50px'
                        borderRadius='6px'
                        name='referralDetail'
                        border='2px'
                        disabled={URLReferrerAddress !== ""}
                        value={referrerAddress}
                        onChange={(e) => setReferrerAddress(e.target.value)}
                      />
                    </InputGroup>
                  </Box>
                  <Checkbox
                    mt={3}
                    onChange={handleSetReferralField}
                    isChecked={isReferrerCheck}
                    isDisabled={URLReferrerAddress !== ""}
                  >
                    No Referrer?
                  </Checkbox>
                  <Flex mt={4}>
                    <Box mr={2} mt={3}><Text color={modalTextColor2} fontSize="12px" >
                      Fee :
                    </Text>
                    <Text color={modalTextColor}fontSize="16px">-20%</Text></Box>
                    
                    {depositInputHasError || refAddressHasError ? (
                      <>
                        {/* Show Error Button */}
                        <Button
                          my='2'
                          variant='brand'
                          mx='auto'
                          color={
                            depositValue === "Confirm" ||
                            depositValue === "Confirmed"
                              ? "rgba(190, 190, 190, 1)"
                              : "#40BAD5"
                          }
                          width='100%'
                          background={
                            depositValue === "Confirm" ||
                            depositValue === "Confirmed"
                              ? "rgba(64, 186, 213, 0.15)"
                              : "#444159"
                          }
                          disabled={
                            depositValue !== "Confirm" ||
                            !account ||
                            !depositTokenValue ||
                            (showReferrerField && referrerAddress === "")
                          }
                          cursor='pointer'
                          border='none'
                          borderRadius='0px'
                          padding='10px'
                          height='50px'
                          fontSize='16px'
                          _hover={
                            depositValue === "Confirm" ||
                            depositValue === "Confirmed"
                              ? { background: "rgba(64, 186, 213, 0.15)" }
                              : { background: "#444159" }
                          }
                          onClick={() => {}}
                        >
                          {depositErrorButtonText}
                        </Button>
                      </>
                    ) : (
                      <>
                        {enoughApproval(
                          content.poolAllowance,
                          RGPBalance
                        ) ? (
                          <Button
                            my='2'
                            mx='auto'
                            variant='brand'
                            width='100%'
                            disabled={
                              depositValue !== "Confirm" ||
                              !account ||
                              !depositTokenValue ||
                              (showReferrerField && referrerAddress === "")
                            }
                            cursor='pointer'
                            border='none'
                            borderRadius='0px'
                            padding='10px'
                            height='50px'
                            fontSize='16px'
                            _hover={
                              depositValue === "Confirm"
                                ? { background: "rgba(64, 186, 213, 0.15)" }
                                : { background: "#444159" }
                            }
                            onClick={() => confirmDeposit(content.deposit)}
                          >
                            {depositValue}
                          </Button>
                        ) : (
                          approvalButton(content.deposit)
                        )}
                      </>
                    )}
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
</Flex>
    </Skeleton>
  )}
  </>
  
)
}
export default ShowProductFarmDetails
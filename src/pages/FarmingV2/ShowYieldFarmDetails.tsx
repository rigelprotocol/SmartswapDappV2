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
  smartSwapLPTokenV2PoolSix,
  smartSwapLPTokenV2PoolSeven,
  smartSwapLPTokenV2PoolEight,
  smartSwapLPTokenV2PoolNine,
  smartSwapLPTokenV2PoolTwelve,
  smartSwapLPTokenV2PoolThirteen,
} from "../../utils/Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPLP_TOKEN1ADDRESSES,
  SMARTSWAPLP_TOKEN2ADDRESSES,
  SMARTSWAPLP_TOKEN3ADDRESSES,
  SMARTSWAPLP_TOKEN4ADDRESSES,
  SMARTSWAPLP_TOKEN5ADDRESSES,
  SMARTSWAPLP_TOKEN6ADDRESSES,
  SMARTSWAPLP_TOKEN7ADDRESSES,
  SMARTSWAPLP_TOKEN8ADDRESSES,
  SMARTSWAPLP_TOKEN9ADDRESSES,
  SMARTSWAPLP_TOKEN12ADDRESSES,
  SMARTSWAPLP_TOKEN13ADDRESSES,
  RGP,
  RGPADDRESSES,
  RGPSPECIALPOOLADDRESSES,
  RGPSPECIALPOOLADDRESSES2,
} from "../../utils/addresses";
import { clearInputInfo, convertFromWei, convertToNumber } from "../../utils";
import { useRGPBalance } from "../../utils/hooks/useBalances";
import { updateFarmAllowances } from "../../state/farm/actions";
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
} from "../../state/newfarm/hooks";

const ShowYieldFarmDetails = ({
  content,
  wallet,
  URLReferrerAddress,
  LoadingState,
  section,
  showYieldfarm,
}: {
  content: {
    pid: number | string;
    id: string;
    totalLiquidity: string;
    earn: string;
    img: string;
    ARYValue: string;
    lpSymbol: string;
    tokensStaked: string[];
    availableToken: string;
    deposit: string;
    poolAllowance: any;
    RGPEarned: string;
    poolVersion: number | string;
  };
  wallet: any;
  LoadingState: boolean;
  section: string;
  showYieldfarm: boolean;
}) => {
  const mode = useColorModeValue("light", DARK_THEME);
  const bgColor = useColorModeValue("#FFF", "#15202B");
  const modalTextColor = useColorModeValue("#333333", "#F1F5F8");
  const modalTextColor2 = useColorModeValue("#666666", "#DCE6EF");

  const [checked, setChecked] = useState(true);
  const modal2Disclosure = useDisclosure();
  const modal1Disclosure = useDisclosure();
  const filterBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const [unstakeButtonValue, setUnstakeButtonValue] = useState("Confirm");
  const [depositValue, setDepositValue] = useState("Confirm");
  const [unstakeToken, setUnstakeToken] = useState("");
  const [inputHasError, setInputHasError] = useState(false);
  const [errorButtonText, setErrorButtonText] = useState("");
  const [approveValueForRGP, setApproveValueForRGP] = useState(false);
  const [approveValueForOtherToken, setApproveValueForOtherToken] =
    useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { account, chainId, library } = useActiveWeb3React();
  const dispatch = useDispatch();
  const [depositTokenValue, setDepositTokenValue] = useState("");
  const [referrerAddress, setReferrerAddress] = useState(URLReferrerAddress);
  const [depositInputHasError, setDepositInputHasError] = useState(false);
  const [refAddressHasError, setRefAddressHasError] = useState(false);
  const [depositErrorButtonText, setDepositErrorButtonText] = useState("");
  const [RGPBalance] = useRGPBalance();
  const [farmingFee, setFarmingFee] = useState("10");
  const [FarmingFeeLoading, setFarmingFeeLoading] = useState(true);
  const [deposited, setDeposited] = useState(false);
  const [minimumStakeAmount, setMinimumStakeAmount] = useState<string | number>(
    0
  );
  const [isMobileDevice] = useMediaQuery("(max-width: 767px)");
  const [showReferrerField, setShowReferrerField] = useState(true);
  const [isReferrerCheck, setIsReferrerCheck] = useState(false);
  const signer = library?.getSigner();
  const [reload, setReload] = useState(false);
  const [contentid, setContentId] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // const data = useGetFarmData(reload, setReload);

  const { loadingState } = useUpdateFarm({ reload, setReload, content });

  useFetchYieldFarmDetails({
    content,
    section,
    setLoading,
    loading,
  });

  const closeModal = () => {
    modal2Disclosure.onClose();
  };
  // useUpdate(reload, setReload, contentid, setContentId);
  const [userGasPricePercentage] = useUserGasPricePercentage();
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

  useEffect(() => {
    const poolAllowance = async (contract: Contract) => {
      if (account) {
        const rgpApproval = await contract.allowance(
          account,
          MASTERCHEFV2ADDRESSES[chainId as number]
        );
        return !(rgpApproval.toString() <= 0);
      }
    };

    if (!account) {
      setFarmingFeeLoading(false);
    }

    const specialPoolV1Allowance = async (contract: Contract) => {
      if (account) {
        const rgpApproval = await contract.allowance(
          account,
          RGPSPECIALPOOLADDRESSES[chainId as number]
        );
        return !(rgpApproval.toString() <= 0);
      }
    };

    const specialPoolV2Allowance = async (contract: Contract) => {
      if (account) {
        const rgpApproval = await contract.allowance(
          account,
          RGPSPECIALPOOLADDRESSES2[chainId as number]
        );
        return !(rgpApproval.toString() <= 0);
      }
    };

    const checkForApproval = async () => {
      const rgp = await rigelToken(RGP[chainId as number], library);
      const rgpApproval = await poolAllowance(rgp);
      if (content.deposit === "RGP" && Number(content.id) === 1) {
        const specialPoolV1Approval = await specialPoolV1Allowance(rgp);
        changeApprovalButton(true, specialPoolV1Approval);
      } else if (content.deposit === "RGP" && Number(content.id) === 13) {
        const specialPoolV2Approval = await specialPoolV2Allowance(rgp);
        console.log({ specialPoolV2Approval, content });
        changeApprovalButton(true, specialPoolV2Approval);
      } else {
        const pool = await smartSwapLPTokenPoolTwo(content.address, library);
        const approvalForRGPBNB = await poolAllowance(pool);
        changeApprovalButton(approvalForRGPBNB, rgpApproval);
      }
    };

    function changeApprovalButton(otherTokenApproval, rgpApproval) {
      if (otherTokenApproval && rgpApproval) {
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (otherTokenApproval) {
        setApproveValueForOtherToken(true);
      } else if (rgpApproval) {
        // setApproveValueForOtherToken(false);
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

  const RGPSpecialPoolV1Approval = async () => {
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
          RGPSPECIALPOOLADDRESSES[chainId as number],
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
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful RGP Approval`,
            })
          );
        }
        getAllowances();
      } catch (error) {
        console.error(error);
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

  const RGPSpecialPoolV2Approval = async () => {
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
          RGPSPECIALPOOLADDRESSES2[chainId as number],
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
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful RGP Approval`,
            })
          );
        }
        getAllowances();
      } catch (error) {
        console.error(error);
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
    console.log(content.deposit);
    if (approveValueForOtherToken && approveValueForRGP) {
      modal2Disclosure.onOpen();
    } else {
      checkUser(val);
    }
  };

  const checkUser = async () => {
    if (content.deposit === "RGP" && Number(content.id) === 1) {
      await RGPSpecialPoolV1Approval();
      setApproveValueForOtherToken(true);
      setApproveValueForRGP(true);
    } else if (content.deposit === "RGP" && Number(content.id) === 13) {
      await RGPSpecialPoolV2Approval();
      setApproveValueForOtherToken(true);
      setApproveValueForRGP(true);
    } else {
      const pool = await smartSwapLPTokenPoolTwo(content.address, library);

      if (!approveValueForOtherToken && !approveValueForRGP) {
        await RGPApproval();
        await LPApproval(pool);
      } else if (!approveValueForRGP) {
        await RGPApproval();
      } else {
        await LPApproval(pool);
      }
      setApproveValueForOtherToken(true);
      setApproveValueForRGP(true);
    }
  };

  const openDepositeModal = () => {
    //if (approveValueForOtherToken && approveValueForRGP) {
    modal1Disclosure.onOpen();
    // }
  };

  const closeDepositeModal = () => {
    modal1Disclosure.onClose();
  };

  const handleChecked = () => {
    setChecked(true);
  };

  useEffect(() => {
    const RGPfarmingFee = async () => {
      if (account) {
        const masterChef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const minFarmingFee = await masterChef.farmingFee();
        const fee = Web3.utils.fromWei(minFarmingFee.toString());
        setFarmingFee(fee);
        setFarmingFeeLoading(false);
      }
    };
    RGPfarmingFee();
  }, [account]);

  useEffect(() => {
    getAllowances();
  }, [account, deposited]);

  const allowance = (contract: Contract) =>
    contract.allowance(account, MASTERCHEFV2ADDRESSES[chainId as number]);

  const getAllowances = async () => {
    if (account) {
      try {
        const [
          rigel,
          pool1,
          pool2,
          pool3,
          pool4,
          pool5,
          pool6,
          pool7,
          pool8,
          pool9,
          pool12,
          pool13,
        ] = await Promise.all([
          rigelToken(RGP[chainId as number], library),
          smartSwapLPTokenPoolOne(
            SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolTwo(
            SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenPoolThree(
            SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolFour(
            SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolFive(
            SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolSix(
            SMARTSWAPLP_TOKEN6ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolSeven(
            SMARTSWAPLP_TOKEN7ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolEight(
            SMARTSWAPLP_TOKEN8ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolNine(
            SMARTSWAPLP_TOKEN9ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolTwelve(
            SMARTSWAPLP_TOKEN12ADDRESSES[chainId as number],
            library
          ),
          smartSwapLPTokenV2PoolThirteen(
            SMARTSWAPLP_TOKEN13ADDRESSES[chainId as number],
            library
          ),
        ]);

        const [
          pool1Allowance,
          pool2Allowance,
          pool3Allowance,
          pool4Allowance,
          pool5Allowance,
          pool6Allowance,
          pool7Allowance,
          pool8Allowance,
          pool9Allowance,
          pool12Allowance,
          pool13Allowance,
        ] = await Promise.all([
          allowance(pool1),
          allowance(pool2),
          allowance(pool3),
          allowance(pool4),
          allowance(pool5),
          allowance(pool6),
          allowance(pool7),
          allowance(pool8),
          allowance(pool9),
          allowance(pool12),
          allowance(pool13),
        ]);
        let rigelAllowance;
        if (RGPSPECIALPOOLADDRESSES[chainId as number]) {
          rigelAllowance = await rigel.allowance(
            account,
            RGPSPECIALPOOLADDRESSES[chainId as number]
          );
        } else {
          rigelAllowance = pool1Allowance;
        }
        if (Number(chainId) === Number(SupportedChainId.BINANCE)) {
          dispatch(
            updateFarmAllowances([
              rigelAllowance,
              pool2Allowance,
              pool1Allowance,
              pool3Allowance,
              pool4Allowance,
              pool5Allowance,
              pool6Allowance,
              pool7Allowance,
              pool8Allowance,
              pool9Allowance,
              pool12Allowance,
              pool13Allowance,
            ])
          );
        } else {
          dispatch(
            updateFarmAllowances([
              rigelAllowance,
              pool2Allowance,
              pool1Allowance,
              pool3Allowance,
              pool4Allowance,
              pool5Allowance,
              pool6Allowance,
              pool7Allowance,
              pool8Allowance,
              pool9Allowance,
              pool12Allowance,
              pool13Allowance,
            ])
          );
        }
      } catch (error) {
        console.error(error, "something went wrong");
      }
    }
  };

  //unstateButtton

  useEffect(() => {
    const getMinimumStakeAmount = async () => {
      if (account) {
        try {
          const specialPool = await RGPSpecialPool2(
            RGPSPECIALPOOLADDRESSES2[chainId as number],
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
  }, [account]);

  useEffect(() => {
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
        Number(content.poolVersion) === 2 &&
        parseFloat(content.tokensStaked[1]) <= 0 &&
        Number(depositTokenValue) < Number(minimumStakeAmount)
      ) {
        setDepositInputHasError(true);
        setDepositErrorButtonText(
          `Minimum stake amount is ${minimumStakeAmount}`
        );
      }
      if (parseFloat(depositTokenValue) > parseFloat(content.availableToken)) {
        setDepositInputHasError(true);
        setDepositErrorButtonText("Insufficient Balance");
      }
    }
  }, [depositTokenValue]);

  useEffect(() => {
    setRefAddressHasError(false);
    if (referrerAddress !== "") {
      if (!Web3.utils.isAddress(referrerAddress)) {
        setRefAddressHasError(true);
        setDepositErrorButtonText("Invalid Address");
      }
    }
  }, [referrerAddress]);

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
        parseFloat(
          content.deposit === "RGP"
            ? content.tokensStaked[1]
            : content.tokenStaked[1]
        )
      ) {
        setInputHasError(true);
        setErrorButtonText("Insufficient Balance");
      }
    }
  }, [unstakeToken, account]);

  // show max value
  const showMaxValue = async (deposit: any, input: any) => {
    try {
      if (input === "deposit") {
        setDepositTokenValue(content.availableToken);
      } else if (input === "unstake") {
        setUnstakeToken(
          content.deposit === "RGP"
            ? content.tokensStaked[1]
            : content.tokenStaked[1]
        );
      }
    } catch (e) {
      console.log(
        "sorry there is a few error, you are most likely not logged in. Please login to your metamask extensition and try again."
      );
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

  async function confirmUnstakeDeposit(val: string) {
    try {
      setUnstakeButtonValue("Pending Confirmation");
      dispatch(
        setOpenModal({
          message: `Unstaking ${unstakeToken} ${val}`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );

      if (account) {
        if (val === "RGP" && Number(content.id) === 1) {
          await RGPUnstake();
        } else if (val === "RGP" && Number(content.id) === 13) {
          await RGPUnstakeV2();
        } else {
          tokensWithdrawal(content.id);
        }
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

  const fetchTransactionData = async (sendTransaction: any) => {
    const { confirmations, status, logs } = await sendTransaction.wait(1);

    return { confirmations, status, logs };
  };

  // withdrawal for the Liquidity Provider tokens for all pools
  const tokensWithdrawal = async (pid: number) => {
    if (account) {
      try {
        const lpTokens = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );

        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();
        const data = await lpTokens.withdraw(
          pid,
          ethers.utils.parseEther(unstakeToken.toString()),
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
        const { confirmations, status, logs } = await fetchTransactionData(
          data
        );
        const { hash } = data;
        const amountUnstaked = convertToNumber(logs[1].data);

        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );

        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully unstaked ${convertFromWei(
              amountUnstaked
            )} RGP `,
          })
        );

        dispatch(
          addToast({
            message: `Successfully unstaked ${convertFromWei(
              amountUnstaked
            )} RGP `,
            URL: explorerLink,
          })
        );
        setReload(true);
        // dispatch the getTokenStaked action from here when data changes
        //callRefreshFarm(confirmations, status);
      } catch (e) {
        console.log(e);
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const harvestTokens = async (id: string | number) => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Harvesting RGP ${content.RGPEarned} Tokens`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        if (id === 0) {
          const { format1, format2, format3 } = await calculateGas(
            userGasPricePercentage,
            library,
            chainId as number
          );

          const isEIP1559 = await library?.getFeeData();
          const specialPool = await RGPSpecialPool(
            RGPSPECIALPOOLADDRESSES[chainId as number],
            library
          );
          const specialWithdraw = await specialPool.unStake(0, {
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
          });
          const { confirmations, status, logs } = await fetchTransactionData(
            specialWithdraw
          );

          const amountOfRgbSpecial = convertToNumber(logs[1].data);

          if (confirmations >= 1 && status) {
            dispatch(
              setOpenModal({
                trxState: TrxState.TransactionSuccessful,
                message: `Successfully Harvested ${convertFromWei(
                  amountOfRgbSpecial
                )} RGP `,
              })
            );
          }
        } else if (id === 10793) {
          const specialPool = await RGPSpecialPool2(
            RGPSPECIALPOOLADDRESSES2[chainId as number],
            library
          );
          const { format1, format2, format3 } = await calculateGas(
            userGasPricePercentage,
            library,
            chainId as number
          );

          const isEIP1559 = await library?.getFeeData();
          const specialWithdraw = await specialPool.unStake(0, {
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
          });
          const { confirmations, status, logs } = await fetchTransactionData(
            specialWithdraw
          );

          const amountOfRgbSpecial = convertToNumber(logs[1].data);

          if (confirmations >= 1 && status) {
            dispatch(
              setOpenModal({
                trxState: TrxState.TransactionSuccessful,
                message: `Successfully Harvested ${convertFromWei(
                  amountOfRgbSpecial
                )} RGP `,
              })
            );
          }
        } else {
          const lpTokens = await MasterChefV2Contract(
            MASTERCHEFV2ADDRESSES[chainId as number],
            library
          );
          const { format1, format2, format3 } = await calculateGas(
            userGasPricePercentage,
            library,
            chainId as number
          );

          const isEIP1559 = await library?.getFeeData();
          console.log({ lpTokens });
          const withdraw = await lpTokens.withdraw(id, 0, {
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
          });
          const { confirmations, status, logs } = await fetchTransactionData(
            withdraw
          );
          const amountOfRgb = convertToNumber(logs[1].data);
          console.log({ withdraw, amountOfRgb });
          const { hash } = withdraw;

          if (confirmations >= 1 && status) {
            dispatch(
              setOpenModal({
                trxState: TrxState.TransactionSuccessful,
                message: `Successfully Harvested ${convertFromWei(
                  amountOfRgb
                )} RGP `,
              })
            );
          }

          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          dispatch(
            addToast({
              message: `Successfully harvested ${convertFromWei(
                amountOfRgb
              )} RGP `,
              URL: explorerLink,
            })
          );
          setReload(true);
        }
      } catch (e) {
        console.log(e);
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
            message: `Transaction was not successful`,
          })
        );
      }
    }
  };

  // deposit for the Liquidity Provider tokens for all pools
  const LPDeposit = async (pid: any) => {
    if (account) {
      try {
        console.log({ RGPBalance, farmingFee });
        if (parseFloat(content.tokenStaked[1]) == 0) {
          if (parseFloat(RGPBalance) < parseFloat(farmingFee)) {
            // alert({
            //   title: "Insufficient Balance",
            //   body: `Insufficient RGP, you need at least ${farmingFee} RGP to enter this pool`,
            //   type: "error",
            // });
            // dispatch(
            //   addToast({
            //     message: `Insufficient RGP, you need at least ${farmingFee} RGP to enter this pool`,
            //     error: true
            //   })
            // );
            // throw new Error()
            dispatch(
              setOpenModal({
                trxState: TrxState.TransactionFailed,
                message: `Insufficient RGP, you need at least ${farmingFee} RGP to enter this pool`,
              })
            );
          } else {
            const lpTokens = await MasterChefV2Contract(
              MASTERCHEFV2ADDRESSES[chainId as number],
              library
            );
            const { format1, format2, format3 } = await calculateGas(
              userGasPricePercentage,
              library,
              chainId as number
            );

            const isEIP1559 = await library?.getFeeData();

            const data = await lpTokens.deposit(
              pid,
              ethers.utils.parseEther(depositTokenValue.toString()),
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
            const { confirmations, status, logs } = await fetchTransactionData(
              data
            );

            dispatch(
              setOpenModal({
                trxState: TrxState.TransactionSuccessful,
                message: `Successfully deposited`,
              })
            );

            //callRefreshFarm(confirmations, status);
            //temporal
            setDeposited(true);
          }
        } else {
          const lpTokens = await MasterChefV2Contract(
            MASTERCHEFV2ADDRESSES[chainId as number],
            library
          );

          const { format1, format2, format3 } = await calculateGas(
            userGasPricePercentage,
            library,
            chainId as number
          );

          const isEIP1559 = await library?.getFeeData();

          const data = await lpTokens.deposit(
            pid,
            ethers.utils.parseEther(depositTokenValue.toString()),
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
          // const { confirmations, status } = await fetchTransactionData(data);
          const receipt = await data.wait(3);
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successfully deposited`,
            })
          );
          setDeposited(true);
          setReload(true);
          setContentId(content.deposit === "RGP" ? undefined : content.id);
          //  callRefreshFarm(confirmations, status);
        }
      } catch (e) {
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const confirmDeposit = async (val: any) => {
    console.log("deposit", { val, content });
    setDepositValue("Pending Confirmation");
    dispatch(
      setOpenModal({
        message: `Staking ${depositTokenValue} ${val}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    try {
      if (account) {
        if (val === "RGP" && Number(content.id) === 1) {
          await RGPuseStake(depositTokenValue);
        } else if (val === "RGP" && Number(content.id) === 13) {
          await RGPuseStakeV2(depositTokenValue, referrerAddress);
        } else {
          LPDeposit(content.id);
        }
      }
    } catch (error) {
      console.log(error);

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

  //Deposit
  // const confirmDeposit = async (val: any) => {
  //   console.log("deposit", { val, content });
  //   setDepositValue("Pending Confirmation");
  //   dispatch(
  //     setOpenModal({
  //       message: `Staking ${depositTokenValue} ${val}`,
  //       trxState: TrxState.WaitingForConfirmation,
  //     })
  //   );
  //   try {
  //     if (account) {
  //       if (val === "RGP" && Number(content.id) === 1) {
  //         await RGPuseStake(depositTokenValue);
  //       } else if (val === "RGP" && Number(content.id) === 13) {
  //         await RGPuseStakeV2(depositTokenValue, referrerAddress);
  //       } else if (
  //         val === "RGP-BNB" ||
  //         val === "RGP-USDT" ||
  //         val === "USDT-RGP"
  //       ) {
  //         await LPDeposit(2);
  //       } else if (
  //         val === "BNB-BUSD" ||
  //         val === "RGP-USDC" ||
  //         val === "ROSE-USDT"
  //       ) {
  //         await LPDeposit(3);
  //       } else if (
  //         val === "RGP-BUSD" ||
  //         val === "MATIC-RGP" ||
  //         val === "RGP-MATIC" ||
  //         val === "RGP-ROSE" ||
  //         val === "ROSE-RGP"
  //       ) {
  //         await LPDeposit(1);
  //       } else if (val === "AXS-RGP") {
  //         await LPDeposit(4);
  //       } else if (val === "AXS-BUSD") {
  //         await LPDeposit(5);
  //       } else if (val === "PLACE-RGP") {
  //         await LPDeposit(6);
  //       } else if (val === "MHT-RGP") {
  //         await LPDeposit(7);
  //       } else if (val === "SHIB-RGP") {
  //         await LPDeposit(8);
  //       } else if (val === "MBOX-RGP") {
  //         await LPDeposit(9);
  //       } else if (val === "WARS-RGP") {
  //         await LPDeposit(12);
  //       } else if (val === "METO-RGP") {
  //         await LPDeposit(13);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     dispatch(
  //       setOpenModal({
  //         message: `Failed to deposit LP tokens.`,
  //         trxState: TrxState.TransactionFailed,
  //       })
  //     );
  //   }
  //   setTimeout(() => closeDepositeModal(), 400);
  //   //setDeposit(true);

  //   clearInputInfo(setDepositTokenValue, setDepositValue, "Confirm");
  // };

  const RGPuseStake = async (depositToken: any) => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool(
          RGPSPECIALPOOLADDRESSES[chainId as number],
          library
        );

        const { format1, format2, format3 } = await calculateGas(
          userGasPricePercentage,
          library,
          chainId as number
        );

        const isEIP1559 = await library?.getFeeData();

        const data = await specialPool.stake(
          ethers.utils.parseEther(depositTokenValue.toString()),
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

        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully staked ${depositTokenValue} RGP `,
          })
        );
        // callRefreshFarm(confirmations, status);
      } catch (error) {
        console.log(error);
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const RGPuseStakeV2 = async (depositToken: any, submitReferral: any) => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool2(
          RGPSPECIALPOOLADDRESSES2[chainId as number],
          library
        );
        // const { format1, format2, format3 } = await calculateGas(
        //   userGasPricePercentage,
        //   library,
        //   chainId as number
        // );

        // const isEIP1559 = await library?.getFeeData();
        // const data = await specialPool.stake(
        //   ethers.utils.parseEther(depositTokenValue.toString()),
        //   referrerAddress,
        //   {
        //     from: account,
        //     maxPriorityFeePerGas:
        //       isEIP1559 && chainId === 137
        //         ? ethers.utils.parseUnits(format1, 9).toString()
        //         : null,
        //     maxFeePerGas:
        //       isEIP1559 && chainId === 137
        //         ? ethers.utils.parseUnits(format2, 9).toString()
        //         : null,
        //     gasPrice:
        //       chainId === 137
        //         ? null
        //         : chainId === 80001
        //         ? null
        //         : ethers.utils.parseUnits(format3, 9).toString(),
        //   }
        // );
        const data = await specialPool.stake(
          ethers.utils.parseEther(depositTokenValue.toString()),
          referrerAddress,
          {
            from: account,
            gasLimit: 200000,
            gasPrice: ethers.utils.parseUnits("20", "gwei"),
          }
        );
        const { confirmations, status } = await fetchTransactionData(data);

        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully staked ${depositTokenValue} RGP `,
          })
        );
        // callRefreshFarm(confirmations, status);
      } catch (error) {
        console.log(error, 9290202);
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  // withdrawal of funds
  const RGPUnstake = async () => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool(
          RGPSPECIALPOOLADDRESSES[chainId as number],
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

        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully unstaked ${unstakeToken} RGP `,
          })
        );
        // dispatch the getTokenStaked action from here when data changes
        //  callRefreshFarm(confirmations, status);
      } catch (e) {
        console.log(e);
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
            message: `Transaction was not successful`,
          })
        );
      }
    }
  };

  const RGPUnstakeV2 = async () => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool2(
          RGPSPECIALPOOLADDRESSES2[chainId as number],
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

        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionSuccessful,
            message: `Successfully unstaked ${unstakeToken} RGP `,
          })
        );
        // dispatch the getTokenStaked action from here when data changes
        //  callRefreshFarm(confirmations, status);
      } catch (e) {
        console.log(`This - ${e}`);
        dispatch(
          setOpenModal({
            trxState: TrxState.TransactionFailed,
            message: `Transaction was not successful`,
          })
        );
      }
    }
  };

  const LPApproval = async (contract: any) => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Approving LP token`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const walletBal = (await contract.balanceOf(account)) + 400e18;
        const data = await contract.approve(
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
        const receipt = await data.wait(3);
        if (status) {
          setApproveValueForOtherToken(true);
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful LP token Approval`,
            })
          );
        }
        getAllowances();
        setReload(true);
      } catch (e) {
        // props.showErrorMessage(e);
        console.log(e);
        dispatch(
          setOpenModal({
            message: `Transaction failed`,
            trxState: TrxState.TransactionFailed,
          })
        );
      } finally {
        setApprovalLoading(false);
      }
    }
  };

  const approveLPToken = async (LPToken: any) => {
    console.log(LPToken, "tokens");
    switch (content?.type) {
      case "LP":
        const poolOne = await smartSwapLPTokenPoolOne(content.address, library);
        LPApproval(poolOne);
        break;

      default:
        RGPApproval();
        break;
    }
  };

  console.log("contentss", content);

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
          dispatch(
            setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successful RGP Approval`,
            })
          );
        }
        getAllowances();
        setReload(true);
      } catch (error) {
        console.error(error);
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

  const [run, setRun] = useState(false);
  const bgColor2 = useColorModeValue("#319EF6", "#4CAFFF");

  useEffect(() => {
    const visits = window.localStorage.getItem("firstYieldVisit");
    const farmVisits = window.localStorage.getItem("firstFarmVisit");
    if (!visits) {
      window.localStorage.setItem("firstYieldVisit", "1");
    }
    if (!visits && farmVisits !== "2") {
      setRun(true);
      window.localStorage.setItem("firstYieldVisit", "1");
    }
  }, []);

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
      onClick={() => approveLPToken(LPToken)}
    >
      {approvalLoading ? "Approving..." : "Approve"} {LPToken}
    </Button>
  );

  return (
    <>
      {loading ? (
        <Box border='1px' borderColor={filterBorderColor}>
          <SkeletonText mt='4' noOfLines={4} spacing='4' />
        </Box>
      ) : (
        <Skeleton isLoaded={!loadingState ? true : false}>
          <Joyride
            steps={steps}
            run={run}
            continuous={true}
            scrollToFirstStep={true}
            showSkipButton={true}
            styles={{
              options: {
                arrowColor: bgColor2,
                backgroundColor: bgColor2,
                textColor: "#FFFFFF",
                primaryColor: bgColor2,
              },
            }}
          />
          {Number(content.poolVersion) === 2 ? (
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
                      <Tooltip
                        hasArrow
                        label={content.tokensStaked[1]}
                        bg='gray.300'
                        color='black'
                      >
                        {parseFloat(content.tokensStaked[1]).toFixed(4)}
                      </Tooltip>
                    </Text>
                    <Text
                      fontSize='16px'
                      color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}
                    >
                      {content.deposit} Tokens Staked
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
                        approveValueForRGP &&
                        approveValueForOtherToken &&
                        parseFloat(content.tokensStaked[1]) <= 0
                      }
                      padding='10px 40px'
                      cursor='pointer'
                      onClick={() => setApprove(content.deposit)}
                      className={
                        approveValueForRGP && approveValueForOtherToken
                          ? "unstake"
                          : "approve"
                      }
                    >
                      {approveValueForRGP && approveValueForOtherToken
                        ? "Unstake"
                        : "Approve"}
                    </Button>
                    <Button
                      w='45%'
                      h='40px'
                      borderRadius='6px'
                      bg={
                        mode === DARK_THEME && !approveValueForRGP
                          ? "#319EF6"
                          : "#4A739B"
                      }
                      color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
                      border='0'
                      mb='4'
                      mr='6'
                      padding='10px 40px'
                      cursor='pointer'
                      disabled={
                        !approveValueForRGP || !approveValueForOtherToken
                      }
                      onClick={openDepositeModal}
                      className={"deposit"}
                    >
                      Deposit
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
                        {content.RGPEarned}
                      </Text>{" "}
                      <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                        RGP Earned
                      </Text>
                    </Flex>
                    <Button
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
                    </Button>
                  </Box>
                ) : (
                  <Box margin='0 auto'>
                    <Flex my={2}>
                      <Text
                        fontSize='20px'
                        color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                        marginRight='10px'
                        textAlign='center'
                        fontWeight='bold'
                      >
                        {content.RGPEarned}
                      </Text>{" "}
                      <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                        RGP Earned
                      </Text>
                    </Flex>
                    <Button
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
                    </Button>
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
                      onChange={handleChecked}
                      checked={!checked}
                      className='react-switch'
                    />
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          ) : (
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
                      <Tooltip
                        hasArrow
                        label={
                          content?.type !== "RGP"
                            ? content?.tokenStaked[1]
                            : content.tokensStaked[1]
                        }
                        bg='gray.300'
                        color='black'
                      >
                        {parseFloat(
                          content.type !== "RGP"
                            ? content?.tokenStaked[1]
                            : content.tokensStaked[1]
                        ).toFixed(4)}
                      </Tooltip>
                    </Text>
                    <Text
                      fontSize='16px'
                      color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}
                    >
                      {content.deposit} Tokens Staked
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
                        approveValueForRGP &&
                        approveValueForOtherToken &&
                        parseFloat(
                          content.type !== "RGP"
                            ? content.tokenStaked[1]
                            : content.tokensStaked[1]
                        ) <= 0
                      }
                      padding='10px 40px'
                      cursor='pointer'
                      onClick={() => setApprove(content.deposit)}
                      className={
                        approveValueForRGP && approveValueForOtherToken
                          ? "unstake"
                          : "approve"
                      }
                    >
                      {approveValueForRGP && approveValueForOtherToken
                        ? "Unstake"
                        : "Approve"}
                    </Button>
                    <Button
                      w='45%'
                      h='40px'
                      borderRadius='6px'
                      bg={
                        mode === DARK_THEME && !approveValueForRGP
                          ? "#319EF6"
                          : "#4A739B"
                      }
                      color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
                      border='0'
                      mb='4'
                      mr='6'
                      padding='10px 40px'
                      cursor='pointer'
                      disabled={
                        !approveValueForRGP || !approveValueForOtherToken
                      }
                      onClick={openDepositeModal}
                      className={"deposit"}
                    >
                      Deposit
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
                flexBasis='30%'
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
                        {content.RGPEarned}
                      </Text>{" "}
                      <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                        RGP Earned
                      </Text>
                    </Flex>
                    <Button
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
                    </Button>
                  </Box>
                ) : (
                  <Box margin='0 auto'>
                    <Flex my={2}>
                      <Text
                        fontSize='20px'
                        color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                        marginRight='10px'
                        textAlign='center'
                        fontWeight='bold'
                      >
                        {content.RGPEarned}
                      </Text>{" "}
                      <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                        RGP Earned
                      </Text>
                    </Flex>
                    <Button
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
                    </Button>
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
                flexBasis='20%'
                width='100%'
                display='flex'
                justifyContent='space-around'
              >
                <Box>
                  {
                    <Flex marginTop='10px'>
                      <Text fontSize='24px' marginTop='15px' fontWeight='bold'>
                        {FarmingFeeLoading ? (
                          <Spinner speed='0.65s' color='#999999' />
                        ) : (
                          farmingFee
                        )}
                      </Text>
                      <Flex flexDirection={["column", "column", "column"]}>
                        <Text
                          fontSize='16px'
                          color={mode === DARK_THEME ? "#999999" : "#999999"}
                          textAlign='right'
                          marginLeft='30px'
                        >
                          Minimum
                        </Text>{" "}
                        <Text
                          fontSize='16px'
                          color={mode === DARK_THEME ? "#999999" : "#999999"}
                          marginLeft='30px'
                        >
                          Farming Fee
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
                flexBasis='15%'
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
                      onChange={handleChecked}
                      checked={!checked}
                      className='react-switch'
                    />
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          )}

          {Number(content.poolVersion) === 2 ? (
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
                  Deposit
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
                        onClick={() => showMaxValue(content.deposit, "deposit")}
                      >
                        MAX
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Text color={modalTextColor2} fontSize='14px' mb={5} mt={3}>
                    RGP Available: {content.availableToken} {content.deposit}
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
                  <Box mt={4}>
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
                            (setShowReferrerField && referrerAddress === "")
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
                          content.availableToken
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
                              (setShowReferrerField && referrerAddress === "")
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
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          ) : (
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
                  fontSize='18px'
                  fontWeight='regular'
                  align='center'
                >
                  Deposit {content.deposit} Tokens
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
                  <Text color='gray.400' align='right' mb={3}>
                    {content.availableToken} {content.deposit} Available1
                  </Text>
                  <InputGroup size='md'>
                    <Input
                      placeholder='0'
                      opacity='0.5'
                      h='50px'
                      borderRadius='0px'
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
                        _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
                        onClick={() => showMaxValue(content.deposit, "deposit")}
                      >
                        MAX
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Box mt={4}>
                    {depositInputHasError ? (
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
                          disabled={depositValue !== "Confirm" || !account}
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
                          onClick={() => {}}
                        >
                          {depositErrorButtonText}
                        </Button>
                      </>
                    ) : (
                      <>
                        {enoughApproval(
                          content.poolAllowance,
                          content.availableToken
                        ) ? (
                          <Button
                            my='2'
                            mx='auto'
                            variant='brand'
                            width='100%'
                            disabled={depositValue !== "Confirm" || !account}
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
                        <Button
                          my='2'
                          mx='auto'
                          variant='brand'
                          width='100%'
                          cursor='pointer'
                          border='none'
                          borderRadius='0px'
                          padding='10px'
                          height='50px'
                          fontSize='16px'
                          onClick={closeDepositeModal}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          <Modal
            isCentered
            isOpen={modal2Disclosure.isOpen}
            onClose={closeModal}
          >
            <ModalOverlay />
            <ModalContent
              width='95vw'
              borderRadius='6px'
              paddingBottom='20px'
              bgColor={bgColor}
              minHeight='40vh'
            >
              <ModalHeader fontSize='18px' fontWeight='regular' align='center'>
                Unstake {content.deposit} Tokens
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
                <Text color='gray.400' align='right' mb={3}>
                  {`${
                    content.type === "RGP"
                      ? content.tokensStaked[1]
                      : content.tokenStaked[1]
                  }
               ${content.deposit} Staked `}
                </Text>

                <InputGroup size='md'>
                  <Input
                    placeholder='0'
                    opacity='0.5'
                    h='50px'
                    borderRadius='0px'
                    name='availableToken'
                    border='2px'
                    value={unstakeToken}
                    onChange={(e) => setUnstakeToken(e.target.value)}
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
                      _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
                      onClick={() => showMaxValue(content.deposit, "unstake")}
                    >
                      MAX
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Box mt={4}>
                  {inputHasError ? (
                    <>
                      {/* Show Error Button */}
                      <Button
                        my='2'
                        mx='auto'
                        color={
                          unstakeButtonValue === "Confirm" ||
                          unstakeButtonValue === "Confirmed"
                            ? "rgba(190, 190, 190, 1)"
                            : "#40BAD5"
                        }
                        width='100%'
                        background={
                          unstakeButtonValue === "Confirm" ||
                          unstakeButtonValue === "Confirmed"
                            ? "rgba(64, 186, 213, 0.15)"
                            : "#444159"
                        }
                        disabled={unstakeButtonValue !== "Confirm"}
                        cursor='pointer'
                        border='none'
                        borderRadius='0px'
                        padding='10px'
                        height='50px'
                        fontSize='16px'
                        _hover={
                          unstakeButtonValue === "Confirm" ||
                          unstakeButtonValue === "Confirmed"
                            ? { background: "rgba(64, 186, 213, 0.15)" }
                            : { background: "#444159" }
                        }
                        onClick={() => {}}
                      >
                        {errorButtonText}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        my='2'
                        variant='brand'
                        mx='auto'
                        width='100%'
                        disabled={
                          unstakeButtonValue !== "Confirm" ||
                          !unstakeToken ||
                          !account
                        }
                        cursor='pointer'
                        border='none'
                        borderRadius='0px'
                        padding='10px'
                        height='50px'
                        fontSize='16px'
                        _hover={
                          unstakeButtonValue === "Confirm" ||
                          unstakeButtonValue === "Confirmed"
                            ? { background: "rgba(64, 186, 213, 0.15)" }
                            : { background: "#444159" }
                        }
                        onClick={() => confirmUnstakeDeposit(content.deposit)}
                      >
                        {unstakeButtonValue}
                      </Button>
                      <Button
                        my='2'
                        mx='auto'
                        variant='brand'
                        width='100%'
                        cursor='pointer'
                        border='none'
                        borderRadius='0px'
                        padding='10px'
                        height='50px'
                        fontSize='16px'
                        onClick={closeModal}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Skeleton>
      )}
    </>
  );
};

export default ShowYieldFarmDetails;

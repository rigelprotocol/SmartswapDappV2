import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { useWeb3React } from "@web3-react/core";
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
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import Switch from "react-switch";
import { DARK_THEME } from "./index";
import { addToast } from "../../components/Toast/toastSlice";
import { useDispatch } from "react-redux";
import { setOpenModal, TrxState } from "../../state/application/reducer";
import { getExplorerLink, ExplorerDataType } from "../../utils/getExplorerLink";
import {
  MasterChefV2Contract,
  RGPSpecialPool,
  smartSwapLPTokenPoolOne,
  smartSwapLPTokenPoolTwo,
  smartSwapLPTokenPoolThree,
  smartSwapLPTokenV2PoolFour,
  smartSwapLPTokenV2PoolFive,
  rigelToken,
} from "../../utils/Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  RGPADDRESSES,
  SMARTSWAPLP_TOKEN1ADDRESSES,
  SMARTSWAPLP_TOKEN2ADDRESSES,
  SMARTSWAPLP_TOKEN3ADDRESSES,
  SMARTSWAPLP_TOKEN4ADDRESSES,
  SMARTSWAPLP_TOKEN5ADDRESSES,
  RGP,
 } from "../../utils/addresses";
import { clearInputInfo, convertFromWei, convertToNumber } from "../../utils";
import { SMART_SWAP } from '../../utils/constants';
import { updateFarmAllowances } from '../../state/farm/actions';

const ShowYieldFarmDetails = ({
  content,
  wallet,
}: {
  content: {
    pid: number;
    totalLiquidity: string;
    earn: string;
    img: string;
    ARYValue: string;
    lpSymbol: string;
    tokensStaked: string[];
    availableToken: string;
    deposit: string,
    RGPEarned: string

  };
}) => {
  const mode = useColorModeValue("light", DARK_THEME);
  const bgColor = useColorModeValue("#FFF", "#15202B");

  const [checked, setChecked] = useState(true);
  const modal2Disclosure = useDisclosure();
  const [unstakeButtonValue, setUnstakeButtonValue] = useState("Confirm");
  const [depositValue, setDepositValue] = useState("Confirm");
  const [unstakeToken, setUnstakeToken] = useState("");
  const [inputHasError, setInputHasError] = useState(false);
  const [errorButtonText, setErrorButtonText] = useState("");
  const [approveValueForRGP, setApproveValueForRGP] = useState(false);
  const [approveValueForOtherToken, setApproveValueForOtherToken] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { account, chainId } = useWeb3React();
  const dispatch = useDispatch();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const closeModal = () => {
    modal2Disclosure.onClose();
  };

  const getAllowances = async () => {
  try {
    const [rigel, pool1, pool2, pool3] = await Promise.all([
      rigelToken(RGP[chainId as number]),
      smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]),
      smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]),
      smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]),
    ]);
    if (wallet.address != '0x') {
      const [
        pool1Allowance,
        pool2Allowance,
        pool3Allowance,
      ] = await Promise.all([
        allowance(pool1),
        allowance(pool2),
        allowance(pool3),
      ]);
      let rigelAllowance;
      if (SMART_SWAP.specialPool) {
        rigelAllowance = await rigel.allowance(
          account,
          SMART_SWAP.specialPool,
        );
      } else {
        rigelAllowance = pool1Allowance;
      }

      updateFarmAllowances([
        rigelAllowance,
        pool2Allowance,
        pool1Allowance,
        pool3Allowance,
      ]);
    }
  } catch (error) {
    console.error(error, 'something went wrong');
  }
};

const allowance = contract =>
  contract.allowance(account, SMART_SWAP.masterChefV2);

useEffect(() => {
  getAllowances();
}, []);

useEffect(() => {
  const poolAllowance = async contract => {
    if (signer !== 'signer') {
      const rgpApproval = await contract.allowance(
        account,
        SMART_SWAP.masterChefV2,
      );
      return !(rgpApproval.toString() <= 0);
    }
  };

  const checkForApproval = async () => {
    const rgp = await rigelToken(RGP[chainId as number]);
    const rgpApproval = await poolAllowance(rgp);
    if (content.deposit === 'RGP-BNB') {
      const poolTwo = await smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]);
      const approvalForRGPBNB = await poolAllowance(poolTwo);
      changeApprovalButton(approvalForRGPBNB, rgpApproval);
    } else if (content.deposit === 'RGP-BUSD') {
      const poolOne = await smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]);
      const approvalForRGPBUSD = await poolAllowance(poolOne);
      changeApprovalButton(approvalForRGPBUSD, rgpApproval);
    } else if (content.deposit === 'BNB-BUSD') {
      const poolThree = await smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]);
      const approvalForBNBBUSD = await poolAllowance(poolThree);
      changeApprovalButton(approvalForBNBBUSD, rgpApproval);
    } else if (content.deposit === 'AXS-RGP') {
      const poolFour = await smartSwapLPTokenV2PoolFour(SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number]);
      const approveForAXSRGP = await poolAllowance(poolFour);
      changeApprovalButton(approveForAXSRGP, rgpApproval);
    } else if (content.deposit === 'AXS-BUSD') {
      const poolFive = await smartSwapLPTokenV2PoolFive(SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number]);
      const approveForAXSBUSD = await poolAllowance(poolFive);
      changeApprovalButton(approveForAXSBUSD, rgpApproval);
    }
  };

function changeApprovalButton(otherTokenApproval, rgpApproval) {
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
checkForApproval();
}, [wallet, content]);

const RGPApproval = async () => {
  if (signer !== 'signer') {
    try {
      dispatch(
        setOpenModal({
          message: `Approving RGP`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );
      const rgp = await rigelToken(RGP[chainId as number]);
      const walletBal = (await rgp.balanceOf(account)) + 400e18;
      const data = await rgp.approve(SMART_SWAP.masterChefV2, walletBal, {
        from: account,
        gasLimit: 150000,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
      });
      setApprovalLoading(true);
      const { confirmations, status } = await fetchTransactionData(data);
      if (confirmations >= 3) {
        setApproveValueForRGP(true);
        dispatch(setOpenModal({
          trxState: TrxState.TransactionSuccessful,
          message: `Successful RGP Approval`
        }));
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
    } finally {
      setApprovalLoading(false);
    }
  }
};

const RGPSpecialPoolApproval = async () => {
  if (signer !== 'signer') {
    try {
      const rgp = await rigelToken(RGP[chainId as number]);
      const walletBal = (await rgp.balanceOf(account)) + 400e18;
      const data = await rgp.approve(SMART_SWAP.specialPool, walletBal, {
        from: account,
        gasLimit: 150000,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
      });
      setApprovalLoading(true);
      const { confirmations, status } = await fetchTransactionData(data);
      getAllowances();
    } catch (error) {
      console.error(error);
    } finally {
      setApprovalLoading(false);
    }
  }
};

const LPApproval = async contract => {
  if (signer !== 'signer') {
    try {
      dispatch(
        setOpenModal({
          message: `Approving LP token`,
          trxState: TrxState.WaitingForConfirmation,
        })
      );
      const walletBal = (await contract.balanceOf(account)) + 400e18;
      const data = await contract.approve(
        SMART_SWAP.masterChefV2,
        walletBal,
        {
          from: account,
          gasLimit: 150000,
          gasPrice: ethers.utils.parseUnits('20', 'gwei'),
        },
      );
      setApprovalLoading(true);
      const { confirmations, status } = await fetchTransactionData(data);

      if (confirmations >= 3) {
        setApproveValueForOtherToken(true);
        dispatch(setOpenModal({
          trxState: TrxState.TransactionSuccessful,
          message: `Successful LP token Approval`
        }));
      }
      getAllowances();
    } catch (e) {
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

const approveLPToken = async LPToken => {
  switch (LPToken) {
    case 'RGP-BUSD':
      const poolOne = await smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]);
      LPApproval(poolOne);
      break;
    case 'RGP-BNB':
      const poolTwo = await smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]);
      LPApproval(poolTwo);
      break;
    case 'BNB-BUSD':
      const poolThree = await smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]);
      LPApproval(poolThree);
      break;
    case 'AXS-RGP':
      const poolFour = await smartSwapLPTokenV2PoolFour(SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number]);
      LPApproval(poolFour);
      break;
    case 'AXS-BUSD':
      const poolFive = await smartSwapLPTokenV2PoolFive(SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number]);
      LPApproval(poolFive);
      break;
    default:
      RGPApproval();
      break;
  }
};

const setApprove = val => {
  if (approveValueForOtherToken && approveValueForRGP) {
    modal2Disclosure.onOpen();
  } else {
    checkUser(val);
  }
};

  const checkUser = async val => {
    if (signer !== 'signer') {
      if (val === 'RGP-BNB') {
        const poolTwo = await smartSwapLPTokenPoolTwo(SMARTSWAPLP_TOKEN2ADDRESSES[chainId as number]);
        if (!approveValueForOtherToken && !approveValueForRGP) {
          await RGPApproval();
          await LPApproval(poolTwo);
        } else if (!approveValueForRGP) {
          await RGPApproval();
        } else {
          await LPApproval(poolTwo);
        }
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (val === 'BNB-BUSD') {
        const poolThree = await smartSwapLPTokenPoolThree(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number]);
        if (!approveValueForOtherToken && !approveValueForRGP) {
          await RGPApproval();
          await LPApproval(poolThree);
        } else if (!approveValueForRGP) {
          await RGPApproval();
        } else {
          await LPApproval(poolThree);
        }
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (val === 'RGP-BUSD') {
        const poolOne = await smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]);
        if (!approveValueForOtherToken && !approveValueForRGP) {
          await RGPApproval();
          await LPApproval(poolOne);
        } else if (!approveValueForRGP) {
          await RGPApproval();
        } else {
          await LPApproval(poolOne);
        }
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (val === 'AXS-RGP') {
        const poolFour = await smartSwapLPTokenV2PoolFour(SMARTSWAPLP_TOKEN4ADDRESSES[chainId as number]);
        if (!approveValueForOtherToken && !approveValueForRGP) {
          await RGPApproval();
          await LPApproval(poolFour);
        } else if (!approveValueForRGP) {
          await RGPApproval();
        } else {
          await LPApproval(poolFour);
        }
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (val === 'AXS-BUSD') {
        const poolFive = await smartSwapLPTokenV2PoolFive(SMARTSWAPLP_TOKEN5ADDRESSES[chainId as number]);
        if (!approveValueForOtherToken && !approveValueForRGP) {
          await RGPApproval();
          await LPApproval(poolFive);
        } else if (!approveValueForRGP) {
          await RGPApproval();
        } else {
          await LPApproval(poolFive);
        }
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      } else if (val === 'RGP') {
        await RGPSpecialPoolApproval();
        setApproveValueForOtherToken(true);
        setApproveValueForRGP(true);
      }
    } else if (ethers.utils.formatEther(checkAllow).toString() == 0.0) {
      await RGPSpecialPoolApproval();
    }
  };

  const handleChecked = () => {
    setChecked(true);
  };

  //unstateButtton

  useEffect(() => {
    setInputHasError(false);
    setErrorButtonText("");

    if (!account) {
      setUnstakeButtonValue("Connect wallet")
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
      if (parseFloat(unstakeToken) > parseFloat(content.tokensStaked[1])) {
        setInputHasError(true);
        setErrorButtonText("Insufficient Balance");
      }
    }
  }, [unstakeToken, account]);

  // show max value
  const showMaxValue = async (deposit: any, input: any) => {
    try {
      //  if (input === 'lpSymbol') {
      //  setDepositTokenValue(content.availableToken);
      //  } else if (input === 'unstake') {
      setUnstakeToken(content.tokensStaked[1]);
      //  }
    } catch (e) {
      console.log(
        "sorry there is a few error, you are most likely not logged in. Please login to ypur metamask extensition and try again."
      );
    }

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
        if (val === 'RGP') {
          await RGPUnstake()
        } else if (val === 'RGP-BNB') {
          await tokensWithdrawal(2);
        } else if (val === 'RBG-BUSD') {
          await tokensWithdrawal(1)
        } else if (val === 'BNB-BUSD') {
          await tokensWithdrawal(3)
        } else if (val === 'AXS-RGP') {
          await tokensWithdrawal(4)
        } else if (val === 'AXS-BUSD') {
          await tokensWithdrawal(5)
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
        const lpTokens = await MasterChefV2Contract(MASTERCHEFV2ADDRESSES[chainId as number]);
        const data = await lpTokens.withdraw(
          pid,
          ethers.utils.parseEther(unstakeToken.toString()),
          {
            from: account,
            gasLimit: 250000,
            gasPrice: ethers.utils.parseUnits('20', 'gwei'),
          },
        );
        const { confirmations, status, logs } = await fetchTransactionData(data);
        const { hash } = data;
        const amountUnstaked = convertToNumber(logs[1].data);

        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );

        dispatch(setOpenModal({
          trxState: TrxState.TransactionSuccessful,
          message: `Successfully unstaked ${convertFromWei(amountUnstaked)} RGP `
        }));

        dispatch(addToast({
          message: `Successfully unstaked ${convertFromWei(amountUnstaked)} RGP `
          ,

          URL: explorerLink
        })

        )
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
              message: `Harvesting Tokens`,
              trxState: TrxState.WaitingForConfirmation,
            })
        );
        if (id === 0) {
          const specialPool = await RGPSpecialPool(RGPSPECIALPOOLADDRESSES[chainId as number]);
          const specialWithdraw = await specialPool.unStake(0);
          const { confirmations, status, logs } = await fetchTransactionData(
              specialWithdraw,
          );

          const amountOfRgbSpecial = convertToNumber(logs[1].data);

          if (confirmations >= 1 && status) {
            dispatch(setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successfully Harvested ${convertFromWei(amountOfRgbSpecial)} RGP `
            }));
          }
        } else {
          const lpTokens = await MasterChefV2Contract(MASTERCHEFV2ADDRESSES[chainId as number]);
          const withdraw = await lpTokens.withdraw(id, 0);
          const { confirmations, status, logs } = await fetchTransactionData(
              withdraw,
          );
          const amountOfRgb = convertToNumber(logs[1].data);

          const { hash } = withdraw;

          if (confirmations >= 1 && status) {
            dispatch(setOpenModal({
              trxState: TrxState.TransactionSuccessful,
              message: `Successfully Harvested ${convertFromWei(amountOfRgb)} RGP `
            }));
          }

          const explorerLink = getExplorerLink(
              chainId as number,
              hash,
              ExplorerDataType.TRANSACTION
          );
          dispatch(addToast({
            message: `Successfully harvested ${convertFromWei(amountOfRgb)} RGP `,
            URL: explorerLink
            })
          )
        }

      } catch (e) {
        console.log(e);
        dispatch(setOpenModal({
          trxState: TrxState.TransactionFailed,
          message: `Transaction was not successful`
        }));
      }
    }
  };

  // withdrawal of funds
  const RGPUnstake = async () => {
    if (account) {

      const specialPool = await RGPSpecialPool(RGPADDRESSES[chainId as number]);
      const data = await specialPool.unStake(
        ethers.utils.parseUnits(unstakeToken, "ether"), // user input from onclick shoild be here...
        {
          from: account,
          gasLimit: 150000,
          gasPrice: ethers.utils.parseUnits("20", "gwei"),
        }
      );
      const { confirmations, status } = await fetchTransactionData(data);
      // dispatch the getTokenStaked action from here when data changes
      //  callRefreshFarm(confirmations, status);
    }
  };

  return (
    <>
      <Flex
        flexDirection={["column", "column", "row"]}
        color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
        background={mode === DARK_THEME ? "#213345" : "#F2F5F8"}
        padding="0 20px"
        paddingBottom="4px"
        border={mode === DARK_THEME ? "2px solid #324D68" : "2px solid #DEE6ED"}
        width="100%"
      >
        <Box
          flexBasis="35%"
          width="100%"
          textAlign="right"
          display="flex"
          justifyContent="space-around"
        >
          <Box>
            <Flex my={2} justify={{ base: "center", md: "none", lg: "none" }}>
              <Text
                color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                fontSize="20px"
                marginRight="20px"
                fontWeight="bold"
              >
                {content.tokensStaked[1]}
              </Text>
              <Text
                fontSize="16px"
                color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}
              >
                {content.deposit} Tokens Staked
              </Text>
            </Flex>

            <Flex marginLeft={{ base: "20px", md: "none", lg: "none" }}>
              <Button
                w="45%"
                h="40px"
                borderRadius="6px"
                bg={mode === DARK_THEME ? "#319EF6" : "#319EF6"}
                color={mode === DARK_THEME ? "#FFFFFF" : "#FFFFFF"}
                border="0"
                mb="4"
                mr="6"
                padding="10px 40px"
                cursor="pointer"
                onClick={() => setApprove(content.deposit)}
              >
                {approveValueForRGP && approveValueForOtherToken
                  ? 'Unstake'
                  : 'Approve'
                }
              </Button>
              <Button
                w="45%"
                h="40px"
                borderRadius="6px"
                bg={mode === DARK_THEME ? "#4A739B" : "#999999"}
                color={mode === DARK_THEME ? "#7599BD" : "#CCCCCC"}
                border="0"
                mb="4"
                mr="6"
                padding="10px 40px"
                cursor="pointer"
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
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>
        {/* margin={['0', '0', '0 20px']} */}
        <Box
          flexBasis="30%"
          width="100%"
          display="flex"
          justifyContent="space-around"
        >
          <Box width="60%" margin="0 auto">
            <Flex my={2}>
              <Text
                fontSize="20px"
                color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                marginRight="30px"
                textAlign="center"
                fontWeight="bold"
              >
                {content.RGPEarned}
              </Text>{" "}
              <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                RGP Earned
              </Text>
            </Flex>
            <Button
              w="95%"
              h="40px"
              margin="0 auto"
              borderRadius="6px"
              bg={mode === DARK_THEME ? "#4A739B" : "#999999"}
              color={mode === DARK_THEME ? "#7599BD" : "#CCCCCC"}
              border="0"
              mb="4"
              mr="2"
              cursor="pointer"
              _hover={{ color: "white" }}
              disabled={parseFloat(content.RGPEarned) <= 0}
              onClick={() => harvestTokens(content.pId)}
            >
              Harvest
            </Button>
          </Box>
          <Box
            my={3}
            display={{ base: "none", md: "block", lg: "block" }}
            mx={1}
          >
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>

        <Box
          flexBasis="20%"
          width="100%"
          display="flex"
          justifyContent="space-around"
        >
          <Box>
            {true && (
              <Flex marginTop="10px">
                <Text fontSize="24px" marginTop="15px" fontWeight="bold">
                  12
                </Text>
                <Flex flexDirection={["column", "column", "column"]}>
                  <Text
                    fontSize="16px"
                    color={mode === DARK_THEME ? "#999999" : "#999999"}
                    textAlign="right"
                    marginLeft="30px"
                  >
                    Minimum
                  </Text>{" "}
                  <Text
                    fontSize="16px"
                    color={mode === DARK_THEME ? "#999999" : "#999999"}
                    marginLeft="30px"
                  >
                    Farming Fee
                  </Text>{" "}
                </Flex>
              </Flex>
            )}
          </Box>

          <Box
            my={3}
            mx={1}
            display={{ base: "none", md: "block", lg: "block" }}
          >
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>
        <Box
          flexBasis="15%"
          width="100%"
          margin={["0", "0", "0 20px"]}
          justifySelf="end"
        >
          <Flex flexDirection="column" alignItems={{ base: "center" }}>
            <Flex mb="5px">
              <Text marginTop="15px">Auto-Harvest</Text>
              <Circle
                size="20px"
                bg="#fff"
                display="inline-flex"
                marginLeft="10px"
                marginTop="17px"
                marginRight="10px"
              >
                <Tooltip
                  label="Auto Harvest (weekly)"
                  fontSize="md"
                  marginTop="15px"
                >
                  <QuestionOutlineIcon color="#120136" cursor="pointer" />
                </Tooltip>
              </Circle>
            </Flex>
            <Flex>
              <Switch
                onChange={handleChecked}
                checked={checked}
                className="react-switch"
              />
            </Flex>
          </Flex>
        </Box>
      </Flex>

      <Modal isCentered isOpen={modal2Disclosure.isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent
          width="95vw"
          borderRadius="6px"
          paddingBottom="20px"
          bgColor={bgColor}
          minHeight="40vh"
        >
          <ModalHeader fontSize="18px" fontWeight="regular" align="center">
            Unstake {content.deposit} Tokens
          </ModalHeader>

          <ModalCloseButton
            bg="none"
            size={"sm"}
            mt={3}
            mr={3}
            cursor="pointer"
            _focus={{ outline: "none" }}
            p={"7px"}
            border={"1px solid"}
          />

          <ModalBody py={2}>
            <Text color="gray.400" align="right" mb={3}>
              {`${content.tokensStaked[1]}
               ${content.deposit} Staked `}
            </Text>

            <InputGroup size="md">
              <Input
                placeholder="0"
                opacity="0.5"
                h="50px"
                borderRadius="0px"
                name="availableToken"
                border="2px"
                value={unstakeToken}
                onChange={(e) => setUnstakeToken(e.target.value)}
              />
              <InputRightElement marginRight="15px">
                <Button
                  color="rgba(64, 186, 213, 1)"
                  border="none"
                  borderRadius="0px"
                  fontSize="13px"
                  p="1"
                  mt="10px"
                  height="20px"
                  cursor="pointer"
                  _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
                  onClick={() => showMaxValue(content.deposit, "lpSymbol")}
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
                    my="2"
                    mx="auto"
                    color={
                      unstakeButtonValue === "Confirm" ||
                        unstakeButtonValue === "Confirmed"
                        ? "rgba(190, 190, 190, 1)"
                        : "#40BAD5"
                    }
                    width="100%"
                    background={
                      unstakeButtonValue === "Confirm" ||
                        unstakeButtonValue === "Confirmed"
                        ? "rgba(64, 186, 213, 0.15)"
                        : "#444159"
                    }
                    disabled={unstakeButtonValue !== "Confirm"}
                    cursor="pointer"
                    border="none"
                    borderRadius="0px"
                    padding="10px"
                    height="50px"
                    fontSize="16px"
                    _hover={
                      unstakeButtonValue === "Confirm" ||
                        unstakeButtonValue === "Confirmed"
                        ? { background: "rgba(64, 186, 213, 0.15)" }
                        : { background: "#444159" }
                    }
                    onClick={() => { }}
                  >
                    {errorButtonText}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    my="2"
                    variant="brand"
                    mx="auto"
                    width="100%"
                    disabled={unstakeButtonValue !== "Confirm" || !unstakeToken || !account}
                    cursor="pointer"
                    border="none"
                    borderRadius="0px"
                    padding="10px"
                    height="50px"
                    fontSize="16px"
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
                    my="2"
                    mx="auto"
                    variant="brand"
                    width="100%"
                    cursor="pointer"
                    border="none"
                    borderRadius="0px"
                    padding="10px"
                    height="50px"
                    fontSize="16px"
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
    </>
  );
};

export default ShowYieldFarmDetails;

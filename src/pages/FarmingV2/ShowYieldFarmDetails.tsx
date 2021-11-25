import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, Circle, Divider, Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import Switch from "react-switch";
import { useColorModeValue } from "@chakra-ui/react";
import { DARK_THEME } from "./index";
import {
  rigelToken,
  masterChefV2Contract,
  wallet,
} from '../../utils/SwapConnect';
import { ethers } from 'ethers';
import Web3 from 'web3';
import configureStore from 'configureStore';

const ShowYieldFarmDetails = ({content, wallet, updateFarmAllowances}) => {

  const mode = useColorModeValue("light", DARK_THEME);

  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked(true);
  };
  const [deposit, setDeposit] = useState(false)
  const [approveValueForRGP, setApproveValueForRGP] = useState(false)
  const [approveValueForOtherToken, setApproveValueForOtherToken] = useState(false)
  const [allowanceApproval, setAllowanceApproval] = useState(false);

  const getAllowances = async () => {
    try {
      const [rigel, pool1, pool2, pool3] = await Promise.all([
        rigelToken(),
        smartSwapLPTokenPoolOne(),
        smartSwapLPTokenPoolTwo(),
        smartSwapLPTokenPoolThree(),
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
            wallet.address,
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

  const allowance = contract => contract.allowance(wallet.address, SMART_SWAP.masterChefV2);

  useEffect(() => {
    getAllowances();
  }, []);

  const poolAllowance = async contract => {
      if (wallet.signer !== 'signer') {
        const rgpApproval = await contract.allowance(
          wallet.address,
          SMART_SWAP.masterChefV2,
        );
        return !(rgpApproval.toString() <= 0);
      }
    };
  useEffect(() => {
    console.log(wallet)
    const checkForApproval = async () => {
      if (content.deposit === 'RGP') {
        setIsPoolRGP(true);
        console.log(content)
        const specialPoolApproval = await specailPoolAllowance();
        changeApprovalButton(true, specialPoolApproval);
      } else {
        const rgp = await rigelToken();
        const rgpApproval = await poolAllowance(rgp);
        if (content.deposit === 'RGP-BNB') {
          const poolTwo = await smartSwapLPTokenPoolTwo();
          const approvalForRGPBNB = await poolAllowance(poolTwo);
          changeApprovalButton(approvalForRGPBNB, rgpApproval);
        } else if (content.deposit === 'RGP-BUSD') {
          const poolOne = await smartSwapLPTokenPoolOne();
          const approvalForRGPBUSD = await poolAllowance(poolOne);
          changeApprovalButton(approvalForRGPBUSD, rgpApproval);
        } else if (content.deposit === 'BNB-BUSD') {
          const poolThree = await smartSwapLPTokenPoolThree();
          const approvalForBNBBUSD = await poolAllowance(poolThree);
          changeApprovalButton(approvalForBNBBUSD, rgpApproval);
        } else if (content.deposit === 'AXS-RGP') {
          const poolFour = await smartSwapLPTokenV2PoolFour();
          const approveForAXSRGP = await poolAllowance(poolFour);
          changeApprovalButton(approveForAXSRGP, rgpApproval);
        } else if (content.deposit === 'AXS-BUSD') {
          const poolFive = await smartSwapLPTokenV2PoolFive();
          const approveForAXSBUSD = await poolAllowance(poolFive);
          changeApprovalButton(approveForAXSBUSD, rgpApproval);
        }
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
    setDeposit(false)
  }, [wallet, content]);

  // checkings for approval.
const setApprove = val => {
  if (approveValueForOtherToken && approveValueForRGP) {
    modal2Disclosure.onOpen();
  } else {
    checkUser(val);
  }
};

const checkUser = async val => {
  if (wallet.signer !== 'signer') {
    if (val === 'RGP-BNB') {
      const poolTwo = await smartSwapLPTokenPoolTwo();
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
      const poolThree = await smartSwapLPTokenPoolThree();
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
      const poolOne = await smartSwapLPTokenPoolOne();
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
      const poolFour = await smartSwapLPTokenV2PoolFour();
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
      const poolFive = await smartSwapLPTokenV2PoolFive();
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
        <Box flexBasis="35%" width="100%" textAlign="right" display="flex" justifyContent="space-around">
          <Box>
            <Flex my={2} justify={{ base: "center", md: "none", lg: "none" }}>
              <Text color={mode === DARK_THEME ? "#F1F5F8" : "#333333"} fontSize="20px" marginRight="20px" fontWeight="bold">
                0.000
              </Text>
              <Text fontSize="16px" color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>
                {false ? `RGP-BUSD` : "RGP"} Tokens Staked
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
                color={mode === DARK_THEME ? "##7599BD" : "#CCCCCC"}
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
          <Box mx={1} my={3} display={{ base: "none", md: "block", lg: "block" }}>
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>
        {/* margin={['0', '0', '0 20px']} */}
        <Box flexBasis="30%" width="100%" display="flex" justifyContent="space-around">
          <Box width="60%" margin="0 auto">
            <Flex my={2}>
              <Text
                fontSize="20px"
                color={mode === DARK_THEME ? "#F1F5F8" : "#333333"}
                marginRight="30px"
                textAlign="center"
                fontWeight="bold"
              >
                5000
              </Text>{" "}
              <Text color={mode === DARK_THEME ? "#DCE5EF" : "#333333"}>RGP Earned</Text>
            </Flex>
            <Button
              w="95%"
              h="40px"
              margin="0 auto"
              borderRadius="6px"
              bg={mode === DARK_THEME ? "#4A739B" : "#999999"}
              color={mode === DARK_THEME ? "##7599BD" : "#CCCCCC"}
              border="0"
              mb="4"
              mr="2"
              cursor="pointer"
              _hover={{ color: "white" }}
            >
              Harvest
            </Button>
          </Box>
          <Box my={3} display={{ base: "none", md: "block", lg: "block" }} mx={1}>
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>

        <Box flexBasis="20%" width="100%" display="flex" justifyContent="space-around">
          <Box>
            {true && (
              <Flex marginTop="10px">
                <Text fontSize="24px" marginTop="15px" fontWeight="bold">
                  12
                </Text>
                <Flex flexDirection={["column", "column", "column"]}>
                  <Text fontSize="16px" color={mode === DARK_THEME ? "#999999" : "#999999"} textAlign="right" marginLeft="30px">
                    Minimum
                  </Text>{" "}
                  <Text fontSize="16px" color={mode === DARK_THEME ? "#999999" : "#999999"} marginLeft="30px">
                    Farming Fee
                  </Text>{" "}
                </Flex>
              </Flex>
            )}
          </Box>

          <Box my={3} mx={1} display={{ base: "none", md: "block", lg: "block" }}>
            <Divider orientation="vertical" height="84px" />
          </Box>
        </Box>
        <Box flexBasis="15%" width="100%" margin={["0", "0", "0 20px"]} justifySelf="end">
          <Flex flexDirection="column" alignItems={{ base: "center" }}>
            <Flex mb="5px">
              <Text marginTop="15px">Auto-Harvest</Text>
              <Circle size="20px" bg="#fff" display="inline-flex" marginLeft="10px" marginTop="17px" marginRight="10px">
                <Tooltip label="Auto Harvest (weekly)" fontSize="md" marginTop="15px">
                  <QuestionOutlineIcon color="#120136" cursor="pointer" />
                </Tooltip>
              </Circle>
            </Flex>
            <Flex>
              <Switch onChange={handleChecked} checked={checked} className="react-switch" />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default ShowYieldFarmDetails;

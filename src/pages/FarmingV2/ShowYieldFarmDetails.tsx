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
import { MasterChefV2Contract, RGPSpecialPool } from "../../utils/Contracts";
import { MASTERCHEFV2ADDRESSES, RGPADDRESSES } from "../../utils/addresses";
import { clearInputInfo, convertFromWei, convertToNumber } from "../../utils";
const ShowYieldFarmDetails = ({
  content,
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
    poolAllowance: any

  };
}) => {
  const mode = useColorModeValue("light", DARK_THEME);
  const bgColor = useColorModeValue("#FFF", "#15202B");

  const [checked, setChecked] = useState(true);
  const modal2Disclosure = useDisclosure();
  const modal1Disclosure = useDisclosure();
  const [unstakeButtonValue, setUnstakeButtonValue] = useState("Confirm");
  const [depositValue, setDepositValue] = useState("Confirm");
  const [unstakeToken, setUnstakeToken] = useState("");
  const [inputHasError, setInputHasError] = useState(false);
  const [errorButtonText, setErrorButtonText] = useState("");
  const { account, chainId } = useWeb3React();
  const dispatch = useDispatch();
  const [depositTokenValue, setDepositTokenValue] = useState('');
  const [depositInputHasError, setDepositInputHasError] = useState(false);
  const [depositErrorButtonText, setDepositErrorButtonText] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const closeModal = () => {
    modal2Disclosure.onClose();
  };

  const setApprove = () => {
    // if (approveValueForOtherToken && approveValueForRGP) {
    modal2Disclosure.onOpen();
    //} else {
    //   checkUser(val);
    // }
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

  //unstateButtton

  useEffect(() => {
    setDepositInputHasError(false);
    setDepositErrorButtonText('');
    if (depositTokenValue !== '') {
      if (
        isNaN(parseFloat(depositTokenValue)) ||
        !Math.sign(parseFloat(depositTokenValue)) ||
        Math.sign(parseFloat(depositTokenValue)) == -1
      ) {
        setDepositInputHasError(true);
        setDepositErrorButtonText('Invalid Input');
        return;
      }
      if (parseFloat(depositTokenValue) > parseFloat(content.availableToken)) {
        setDepositInputHasError(true);
        setDepositErrorButtonText('Insufficient Balance');
      }
    }
  }, [depositTokenValue]);

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
      if (input === 'deposit') {
        setDepositTokenValue(content.availableToken);
      } else if (input === 'unstake') {
        setUnstakeToken(content.tokensStaked[1]);
      }
    } catch (e) {
      console.log(
        "sorry there is a few error, you are most likely not logged in. Please login to ypur metamask extensition and try again."
      );
    }

  };
  const enoughApproval = (allowance: any, balance: any) => {
    if (allowance && balance) {
      return allowance.gt(ethers.utils.parseEther(balance));
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
        const amountUnstaked = convertToNumber(logs[1].data)

        const explorerLink = getExplorerLink(
          chainId as number,
          hash,
          ExplorerDataType.TRANSACTION
        );

        dispatch(setOpenModal({
          trxState: TrxState.TransactionSuccessful,
          message: `Successfully unstaked ${convertFromWei(amountUnstaked)} RGP `
        }))

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

    };
  }

  //Deposit
  const confirmDeposit = async (val: any) => { }

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

  const approveLPToken = async (LPToken: any) => { }

  const approvalButton = (LPToken: any) => (
    <Button
      my="2"
      mx="auto"
      color="rgba(190, 190, 190, 1)"
      width="100%"
      background="rgba(64, 186, 213, 0.15)"
      cursor="pointer"
      border="none"
      borderRadius="0px"
      padding="10px"
      height="50px"
      fontSize="16px"
      _hover={{ background: 'rgba(64, 186, 213, 0.15)' }}
      onClick={() => approveLPToken(LPToken)}
    >
      {approvalLoading ? 'Approving...' : 'Approve'} {LPToken}
    </Button>
  );

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
                onClick={() => setApprove()}
              >
                {true ? "Unstake" : "Approve"}
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
                onClick={openDepositeModal}
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
                5000
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
      <Modal isOpen={modal1Disclosure.isOpen} onClose={closeDepositeModal} isCentered>
        <ModalOverlay />
        <ModalContent
          width="95vw"
          borderRadius="6px"
          paddingBottom="20px"
          bgColor={bgColor}
          minHeight="40vh"
        >

          <ModalHeader fontSize="18px" fontWeight="regular" align="center">
            Deposit {content.deposit} Tokens
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
              {content.availableToken} {content.deposit} Available
            </Text>
            <InputGroup size="md">
              <Input
                placeholder="0"
                opacity="0.5"
                h="50px"
                borderRadius="0px"
                name="availableToken"
                value={depositTokenValue}
                onChange={e => setDepositTokenValue(e.target.value)}
                border="2px"
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
                  onClick={() => showMaxValue(content.deposit, 'deposit')}
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
                    my="2"

                    variant="brand"
                    mx="auto"
                    color={
                      unstakeButtonValue === 'Confirm' ||
                        unstakeButtonValue === 'Confirmed'
                        ? 'rgba(190, 190, 190, 1)'
                        : '#40BAD5'
                    }
                    width="100%"
                    background={
                      unstakeButtonValue === 'Confirm' ||
                        unstakeButtonValue === 'Confirmed'
                        ? 'rgba(64, 186, 213, 0.15)'
                        : '#444159'
                    }
                    disabled={unstakeButtonValue !== 'Confirm'}
                    cursor="pointer"
                    border="none"
                    borderRadius="0px"
                    padding="10px"
                    height="50px"
                    fontSize="16px"
                    _hover={
                      unstakeButtonValue === 'Confirm' ||
                        unstakeButtonValue === 'Confirmed'
                        ? { background: 'rgba(64, 186, 213, 0.15)' }
                        : { background: '#444159' }
                    }
                    onClick={() => { }}
                  >
                    {depositErrorButtonText}
                  </Button>
                </>
              ) : (
                <>
                  {enoughApproval(
                    content.poolAllowance,
                    content.availableToken,
                  ) ? (
                    <Button
                      my="2"
                      mx="auto"

                      variant="brand"

                      width="100%"

                      disabled={depositValue !== 'Confirm' || !account}
                      cursor="pointer"
                      border="none"
                      borderRadius="0px"
                      padding="10px"
                      height="50px"
                      fontSize="16px"
                      _hover={
                        depositValue === 'Confirm'
                          ? { background: 'rgba(64, 186, 213, 0.15)' }
                          : { background: '#444159' }
                      }
                      onClick={() => confirmDeposit(content.deposit)}
                    >
                      {depositValue}
                    </Button>
                  ) : (
                    approvalButton(content.deposit)
                  )}
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

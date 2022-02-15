import React, { useState, useCallback, useEffect } from 'react';
import ShowDetails from './components/details/ShowDetails';
import History from './components/history/History';
import From from './components/sendToken/From';
import To from './components/sendToken/To';
import SwapSettings from './components/sendToken/SwapSettings';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import USDTLOGO from '../../assets/roundedlogo.svg';
import { VectorIcon, ExclamationIcon, SwitchIcon } from '../../theme/components/Icons';
import { useAutoTimeActionHandlers, useDerivedAutoTimeInfo, useAutoTimeState } from '../../state/auto-time/hooks';
import { getERC20Token } from '../../utils/utilsFunctions';
import { Field } from '../../state/auto-time/actions';
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
  useMediaQuery
} from '@chakra-ui/react';
import {
  ChevronDownIcon
} from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { autoSwapV2, rigelToken } from '../../utils/Contracts';
import { RGPADDRESSES, AUTOSWAPV2ADDRESSES } from '../../utils/addresses';
import { setOpenModal, TrxState } from "../../state/application/reducer";


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
  const tokenListTriggerColor = useColorModeValue('', '#DCE5EF');
  const tokenListTrgiggerBgColor = useColorModeValue('', '#213345');
  const balanceColor = useColorModeValue('#666666', '#DCE5EF');



  const { account, library, chainId } = useActiveWeb3React()
  const { onCurrencySelection, onUserInput } = useAutoTimeActionHandlers();
  const { independentField, typedValue } = useAutoTimeState();
  const [signedTransaction, setSignedTransaction] = useState({})
  const [hasBeenApproved, setHasBeenApproved] = useState(false)
  const [transactionSigned, setTransactionSigned] = useState(false)
  const [approval, setApproval] = useState<String[] | undefined>([])

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const {
    currencies,
    getMaxValue,
  } = useDerivedAutoTimeInfo();
  useEffect(async () => {
    await checkForApproval()
  }, [currencies[Field.INPUT]])

  const checkForApproval = async () => {
    // check approval for RGP and the other token
    const RGPBalance = await checkApprovalForRGP(RGPADDRESSES[chainId as number])
    const tokenBalance = await checkApproval(currencies[Field.INPUT]?.wrapped.address)
    console.log({ RGPBalance, tokenBalance }, parseFloat(RGPBalance), parseFloat(tokenBalance))
    if (parseFloat(RGPBalance) > 0 && parseFloat(tokenBalance) > 0) {
      setHasBeenApproved(true)
    } else if (parseFloat(RGPBalance) <= 0 && parseFloat(tokenBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval(["RGP", currencies[Field.INPUT]?.wrapped.name])
    } else if (parseFloat(tokenBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval([currencies[Field.INPUT].wrapped.name])
    } else if (parseFloat(RGPBalance) <= 0) {
      setHasBeenApproved(false)
      setApproval(["RGP"])
    }
  }

  const signTransaction = async () => {
    if (account !== undefined) {
      try {
        let web3 = new Web3(Web3.givenProvider);
        console.log("Getting the require hash for transaction")
        const permitHash = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";

        const mess = web3.utils.soliditySha3(permitHash)

        let signature = await web3.eth.sign(mess, account);

        var sig = ethers.utils.splitSignature(signature)

        setSignedTransaction({ ...sig, mess })
        setTransactionSigned(true)
        // }
        await checkForApproval()
      } catch (e) {
        alert("e error")
      }

    } else {
      alert("connect wallet")
    }

  }





  const approveOneOrTwoTokens = async () => {
    if (currencies[Field.INPUT]?.isNative) {
      setHasBeenApproved(true);
      setApproval(approval.filter(t => t !== currencies[Field.INPUT]?.name))
    }
    if (setApproval.length > 0) {
      try {
        dispatch(
          setOpenModal({
            message: `Approve Tokens for Swap`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        let arr = approval
        let arrow = arr
        if (arr[0] === "RGP") {
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

          arr.length > 1 ? setApproval([arr[1]]) : setApproval([])
        } else {
          // setRGPApproval(true)
        }
        if (approval[0] === currencies[Field.INPUT]?.name) {
          const address = currencies[Field.INPUT]?.wrapped.address;
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
          const { hash } = approveTransaction;
          if (confirmations >= 1) {
            dispatch(
              setOpenModal({
                message: `Approval Successful.`,
                trxState: TrxState.TransactionSuccessful,
              })
            );
          }
          setApproval([])
        } else {
          // setOtherTokenApproval(true)
        }
        dispatch(
          setOpenModal({
            message: `Approval Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
      } catch (e) {
        console.log(e)
      }
    } else return

  }
  const sendTransactionToDatabase = async () => {
    const smartSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
    dispatch(
      setOpenModal({
        message: `Signing initial transaction between ${currencies[Field.INPUT]?.symbol} and ${currencies[Field.OUTPUT]?.symbol}`,
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    const time = Date.now();
    console.log("Get current time: ", time)
    console.log({ smartSwapV2Contract })
    let data
    if (currencies[Field.INPUT]?.isNative) {
      data = await smartSwapV2Contract.setPeriodToSwapETHForTokens(
        currencies[Field.OUTPUT]?.wrapped.address,
        account,
        time,
        signedTransaction?.mess,
        signedTransaction?.r,
        signedTransaction?._vs,
        { value: Web3.utils.toWei(typedValue, 'ether') }
      )
    } else if (currencies[Field.OUTPUT]?.isNative) {
      data = await smartSwapV2Contract.setPeriodToSwapTokensForETH(
        currencies[Field.INPUT]?.wrapped.address,
        account,
        time,
        signedTransaction?.mess,
        signedTransaction?.r,
        signedTransaction?._vs,
        { value: Web3.utils.toWei(typedValue, 'ether') }
      )
    } else {
      data = await smartSwapV2Contract.callPeriodToSwapExactTokens(
        currencies[Field.INPUT]?.wrapped.address,
        currencies[Field.OUTPUT]?.wrapped.address,
        account,
        time,
        signedTransaction?.mess,
        signedTransaction?.r,
        signedTransaction?._vs,
        { value: Web3.utils.toWei(typedValue, 'ether') }
      )
    }

    console.log(data)
    console.log({ signedTransaction })
    dispatch(
      setOpenModal({
        message: "Storing Transaction",
        trxState: TrxState.WaitingForConfirmation,
      })
    );
    const response = await fetch('http://localhost:4000/auto/add', {
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
        frequency: 2,
        fromAddress: currencies[Field.INPUT]?.isNative ? "" : currencies[Field.INPUT]?.wrapped.address,
        toAddress: currencies[Field.OUTPUT]?.isNative ? "" : currencies[Field.OUTPUT]?.wrapped.address,
        signature: signedTransaction
      })
    })
    const res = await response.json()
    console.log(res)
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
      console.log({ status }, RGP[chainId as number])
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
          <>
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
              <Flex justifyContent="center">
                <SwitchIcon />
              </Flex>
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" p={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
                  {/* <Text color={balanceColor} fontSize="14px">
                    Balance: 2.2332 USDT
                  </Text>
                  <Menu>
                    <Button
                      border="0px"
                      h="40px"
                      w="120px"
                      rightIcon={<ChevronDownIcon />}
                      bgColor={tokenListTrgiggerBgColor}
                    >
                      <Image mr={3} h="24px" w="24px" src={USDTLOGO} />
                      <Text color={tokenListTriggerColor}>USDT</Text>
                    </Button>
                  </Menu> */
                    <To
                      onUserInput={(value) => console.log(value)}
                      onCurrencySelection={onCurrencySelection}
                      currency={currencies[Field.OUTPUT]}
                      otherCurrency={currencies[Field.INPUT]}
                      value={"0"}
                      display={true}
                    />
                  }
                  <To
                    onUserInput={(value) => console.log(value)}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    value={"0"}

                    display={true}
                  />
                </Box>

                <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px">
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne}>
                      2.5566
                    </Text>
                    <Text fontSize="14px" color={color}>
                      -2.56
                    </Text>
                  </VStack>
                </Box>
                <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2}>
                  <Flex>
                    <Text color={textColorOne} fontSize="16px">
                      Uniswap
                    </Text>
                    <ChevronDownIcon mt={1} />
                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne}>
                        2.6766
                      </Text>
                      <Text fontSize="14px" color={color}>
                        -2.67
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Flex mt={5}>
                <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
                  <VectorIcon />
                </Center>
                <Spacer />
                <Text fontSize="14px" mr={2} color={textColorOne}>
                  1 RGP = 1.34566 USDT
                </Text>
                <ExclamationIcon />
              </Flex>
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap if price changes by
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="60px" />
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
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="md" bg={bgColor} fontSize="16px" color={textColorOne} borderColor={borderColor} borderWidth="1px">
                      Week
                    </MenuButton>
                  </Menu>
                </VStack>
              </Box>
              <Box mt={5}>
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
                  Enter Percentage
                </Button>
              </Box>
            </Box>

            <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
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
              <Flex justifyContent="center">
                <SwitchIcon />
              </Flex>
              <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" p={3} mt={4}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
                  {/* <Text color={balanceColor} fontSize="14px">
                    Balance: 2.2332 USDT
                  </Text> */}
                  {/* <Menu>
                    <Button
                      border="0px"
                      h="40px"
                      w="120px"
                      rightIcon={<ChevronDownIcon />}
                      bgColor={tokenListTrgiggerBgColor}
                    >
                      <Image mr={3} h="24px" w="24px" src={USDTLOGO} />
                      <Text color={tokenListTriggerColor}>USDT</Text>
                    </Button>
                  </Menu> */}
                  <To
                    onUserInput={(value) => console.log(value)}
                    onCurrencySelection={onCurrencySelection}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    value={"0"}
                    display={false}
                  />
                </Box>

                <Box display="flex" pt={4} pb={4} pr={4} pl={4} borderColor={borderTwo} borderWidth="2px" borderRadius="2px" bg={buttonBgcolor}>
                  <Text color={textColorOne} fontSize="16px">
                    RigelProtocol
                  </Text>
                  <Spacer />
                  <VStack>
                    <Text fontSize="24px" color={textColorOne}>
                      2.5566
                    </Text>
                    <Text fontSize="14px" color={color}>
                      -2.56
                    </Text>
                  </VStack>
                </Box>
                <Box borderColor={borderColor} borderWidth="1px" borderRadius="6px" mt={5} pt={4} pb={4} pr={2} pl={2}>
                  <Flex>
                    <Text color={textColorOne} fontSize="16px">
                      Uniswap
                    </Text>
                    <ChevronDownIcon mt={1} />
                    <Spacer />
                    <VStack>
                      <Text fontSize="24px" color={textColorOne}>
                        2.6766
                      </Text>
                      <Text fontSize="14px" color={color}>
                        -2.67
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              </Box>

              <Flex mt={5}>
                <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
                  <VectorIcon />
                </Center>
                <Spacer />
                <Text fontSize="14px" mr={2} color={textColorOne}>
                  1 RGP = 1.34566 USDT
                </Text>
                <ExclamationIcon />
              </Flex>
              <Box display="flex" mt={5}>
                <VStack>
                  <Flex>
                    <Text fontSize="14px" mr={2}>
                      Swap if price changes by
                    </Text>
                    <ExclamationIcon />
                  </Flex>
                  <InputGroup size="md" borderRadius="4px" borderColor={borderColor}>
                    <Input placeholder="0" w="60px" />
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
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="md" bg={bgColor} fontSize="16px" color={textColorOne} borderColor={borderColor} borderWidth="1px">
                      Week
                    </MenuButton>
                  </Menu>
                </VStack>
              </Box>
              <Box mt={5}>
                {account === undefined ?
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
                    Connect Wallet
                  </Button> : !transactionSigned ? <Button
                    w="100%"
                    borderRadius="6px"
                    border={lightmode ? '2px' : 'none'}
                    borderColor={borderColor}
                    onClick={signTransaction}
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
                    onClick={sendTransactionToDatabase}
                    fontSize="18px"
                    boxShadow={lightmode ? 'base' : 'lg'}
                    _hover={{ bgColor: buttonBgcolor }}
                  >
                    Send Transaction
                  </Button>
                }
                {/* <Button
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
                  Enter Percentage
                </Button> */}
                {/* <Button
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
                  onClick={signTransaction}
                >
                  Sign Transaction
                </Button> */}
              </Box>

            </Box>

            <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
              <History />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  )
}

export default SetPrice

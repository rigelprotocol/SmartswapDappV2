import React, { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  useColorModeValue,
  Text,
  Input,
  Button,
  useMediaQuery,
  Img,
} from '@chakra-ui/react';
import { ArrowBackIcon, TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../theme/components/Icons';
import { useGetLiquidityById } from '../../utils/hooks/usePools';
import { useHistory, useParams } from 'react-router';
import BNBImage from '../../assets/BNB.svg';
import RGPImage from '../../assets/rgp.svg';
import ETHImage from '../../assets/eth.svg';
import NullImage from '../../assets/Null-24.svg';
import BUSDImage from '../../assets/busd.svg';
import { useWeb3React } from '@web3-react/core';
import { LiquidityPairInstance } from '../../utils/Contracts';
import { SMARTSWAPROUTER } from '../../utils/addresses';
import { setOpenModal, TrxState } from '../../state/application/reducer';
import { addToast } from '../../components/Toast/toastSlice';
import { getExplorerLink, ExplorerDataType } from '../../utils/getExplorerLink';
import { useDispatch } from 'react-redux';

const Remove = () => {
  const [isTabDevice] = useMediaQuery('(min-width: 990px)');
  const [isTabDevice2] = useMediaQuery('(max-width: 1200px)');

  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const titleColor = useColorModeValue('#666666', '#DCE5EF');
  const positionBgColor = useColorModeValue('#F2F5F8', '#213345');
  const positiontextColor = useColorModeValue('#666666', '#DCE5EF');
  const pairTextColor = useColorModeValue('#333333', '#F1F5F8');
  const pairinformationBgColor = useColorModeValue('#FFFFFF', '#15202B');
  const pairinformationBorderColor = useColorModeValue('#DEE5ED', '#324D68');
  const inputTextColor = useColorModeValue('#CCCCCC', '#4A739B');
  const approveButtonColor = useColorModeValue('#FFFFFF', '#FFFFFF');
  const WithdrawalButtonColor = useColorModeValue('#999999', '#7599BD');
  const approveButtonBgColor = useColorModeValue('#319EF6', '#4CAFFF');
  const withdrawalButtonBorderColor = useColorModeValue('#666666', '#324D68');
  const withdrawaButtonBgColor = useColorModeValue('#FFFFFF', '#15202B');
  const inActiveApproveButtonBgColor = useColorModeValue('#999999', '#7599BD');
  const inActiveApproveButtonColor = useColorModeValue('#CCCCCC', '#4A739B');
  const approvedButtonColor = useColorModeValue('#3CB1D2', '#1B90B1');
  const approvedButtonBgColor = useColorModeValue('#FFFFFF', '#15202B');
  const approvedButtonBorderColor = useColorModeValue('#3CB1D2', '#1B90B1');
  const [inputValue, setInputValue] = useState('');
  const [pool, setPool] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [hasBeenApproved, setHasBeenApproved] = useState(false);
  const { account, chainId } = useWeb3React();

  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const data = useGetLiquidityById(
    params.currencyIdA,
    params.currencyIdB,
    hasBeenApproved
  );

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const details = await data;
      if (details && !cancel) {
        try {
          setHasBeenApproved(details.approved);
          setPool(details.LiquidityPairData);
          setLoading(details.loading);
        } catch (err) {
          console.log(err);
          setPool([]);
        }
      }
    };
    load();
    return () => {
      cancel = true;
    };
  }, [data, hasBeenApproved]);

  const approveLPTokens = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `${pool?.path[0].token === 'WBNB'
                ? 'BNB'
                : pool?.path[0].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[0].token
              }
          /
          ${pool?.path[1].token === 'WBNB'
                ? 'BNB'
                : pool?.path[1].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[1].token
              } LP token Approval`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const smartSwapLP = await LiquidityPairInstance(pool.pairAddress);
        const walletBal = (await smartSwapLP.balanceOf(account)) + 4e18;
        const approveTransaction = await smartSwapLP.approve(
          SMARTSWAPROUTER[chainId as number],
          walletBal,
          {
            from: account,
          }
        );
        const { confirmations } = await approveTransaction.wait(1);
        const { hash } = approveTransaction;
        if (confirmations >= 1) {
          setHasBeenApproved(true);
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          dispatch(
            setOpenModal({
              message: `${pool?.path[0].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[0].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[0].token
                }
            /
            ${pool?.path[1].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[1].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[1].token
                } LP token Approval`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          dispatch(
            addToast({
              message: `Approve ${pool?.path[0].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[0].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[0].token
                }
            /
            ${pool?.path[1].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[1].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[1].token
                } LP token`,
              URL: explorerLink,
            })
          );
        }
      } catch (e) {
        console.log(e);
        dispatch(
          setOpenModal({
            message: `${pool?.path[0].token === 'WBNB'
                ? 'BNB'
                : pool?.path[0].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[0].token
              }
          /
          ${pool?.path[1].token === 'WBNB'
                ? 'BNB'
                : pool?.path[1].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[1].token
              } LP token Approval`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  const removeApproval = async () => {
    if (account) {
      try {
        dispatch(
          setOpenModal({
            message: `Removing approval for ${pool?.path[0].token === 'WBNB'
                ? 'BNB'
                : pool?.path[0].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[0].token
              }
          /
          ${pool?.path[1].token === 'WBNB'
                ? 'BNB'
                : pool?.path[1].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[1].token
              } LP token`,
            trxState: TrxState.WaitingForConfirmation,
          })
        );
        const smartSwapLP = await LiquidityPairInstance(pool.pairAddress);
        const approveTransaction = await smartSwapLP.approve(
          SMARTSWAPROUTER[chainId as number],
          0,
          {
            from: account,
          }
        );
        const { confirmations } = await approveTransaction.wait(1);
        const { hash } = approveTransaction;
        if (confirmations >= 1) {
          setHasBeenApproved(false);
          const explorerLink = getExplorerLink(
            chainId as number,
            hash,
            ExplorerDataType.TRANSACTION
          );
          dispatch(
            setOpenModal({
              message: `Removing approval for ${pool?.path[0].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[0].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[0].token
                }
            /
            ${pool?.path[1].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[1].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[1].token
                } LP token`,
              trxState: TrxState.TransactionSuccessful,
            })
          );
          dispatch(
            addToast({
              message: `UnApprove ${pool?.path[0].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[0].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[0].token
                }
            /
            ${pool?.path[1].token === 'WBNB'
                  ? 'BNB'
                  : pool?.path[1].token === 'WETH'
                    ? 'ETH'
                    : pool?.path[1].token
                } LP token`,
              URL: explorerLink,
            })
          );
        }
      } catch (e) {
        console.log(e);
        dispatch(
          setOpenModal({
            message: `Removing approval for ${pool?.path[0].token === 'WBNB'
                ? 'BNB'
                : pool?.path[0].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[0].token
              }
          /
          ${pool?.path[1].token === 'WBNB'
                ? 'BNB'
                : pool?.path[1].token === 'WETH'
                  ? 'ETH'
                  : pool?.path[1].token
              } LP token`,
            trxState: TrxState.TransactionFailed,
          })
        );
      }
    }
  };

  return (
    <Flex minH="100vh" mt={10} justifyContent="center">
      <Box
        h={isTabDevice && isTabDevice2 ? '620px' : '600px'}
        mx={4}
        w={['100%', '100%', '45%', '29.5%']}
        border="1px"
        borderColor={borderColor}
        borderRadius="6px"
        py={2}
        px={4}
      >
        <Flex flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <ArrowBackIcon
                w={6}
                h={6}
                fontWeight="thin"
                color={topIcons}
                cursor="pointer"
                mr={3}
                onClick={() => history.goBack()}
              />
              <Text color={titleColor} fontSize="18px">
                Back to Liquidity Positions
              </Text>
            </Flex>
            <Flex alignItems="center">
              <SettingsIcon />
              <TimeIcon ml={1} w="22px" h="22px" color={topIcons} />
            </Flex>
          </Flex>
          <Box
            bgColor={positionBgColor}
            mt="3"
            border="1px"
            borderRadius="6px"
            borderColor={borderColor}
            h={'220px'}
          >
            {loading ? (
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
              >
                <Text color={positiontextColor} textAlign="center">
                  Loading...
                </Text>
              </Flex>
            ) : pool.length === 0 ? (
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
              >
                <Text color={positiontextColor} textAlign="center">
                  Liquidity not found
                </Text>
              </Flex>
            ) : (
              <Flex p={3} flexDirection="column">
                <Flex justifyContent="flex-start">
                  <Text color={positiontextColor} fontWeight="bold">
                    Your Position
                  </Text>
                </Flex>
                <Flex mt={2} justifyContent="space-between">
                  <Flex alignItems="center">
                    <Flex
                      mr={isTabDevice && isTabDevice2 ? '' : 2}
                      alignItems="center"
                    >
                      {pool?.path[0].token === 'RGP' ? (
                        <Img src={RGPImage} />
                      ) : pool?.path[0].token === 'BUSD' ? (
                        <Img src={BUSDImage} />
                      ) : pool?.path[0].token === 'WETH' ? (
                        <Img src={ETHImage} />
                      ) : pool?.path[0].token === 'WBNB' ? (
                        <Img src={BNBImage} />
                      ) : (
                        <Img src={NullImage} />
                      )}
                      {pool?.path[1].token === 'RGP' ? (
                        <Img src={RGPImage} />
                      ) : pool?.path[1].token === 'BUSD' ? (
                        <Img src={BUSDImage} />
                      ) : pool?.path[1].token === 'WETH' ? (
                        <Img src={ETHImage} />
                      ) : pool?.path[1].token === 'WBNB' ? (
                        <Img src={BNBImage} />
                      ) : (
                        <Img src={NullImage} />
                      )}
                    </Flex>
                    <Text
                      fontWeight="bold"
                      mr={isTabDevice && isTabDevice2 ? 4 : ''}
                      ml={isTabDevice && isTabDevice2 ? 4 : ''}
                      color={pairTextColor}
                    >
                      {pool?.path[0].token === 'WBNB'
                        ? 'BNB'
                        : pool?.path[0].token === 'WETH'
                          ? 'ETH'
                          : pool?.path[0].token}{' '}
                      /{' '}
                      {pool?.path[1].token === 'WBNB'
                        ? 'BNB'
                        : pool?.path[1].token === 'WETH'
                          ? 'ETH'
                          : pool?.path[1].token}
                    </Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Text
                      mr={isTabDevice && isTabDevice2 ? 4 : 2}
                      fontWeight="bold"
                      color={pairTextColor}
                    >
                      {parseFloat(pool?.poolToken).toFixed(7)}
                    </Text>
                    <Text fontSize="12px" color={titleColor}>
                      Pool Tokens
                    </Text>
                  </Flex>
                </Flex>
                <Box
                  mt={4}
                  border="1px"
                  borderColor={pairinformationBorderColor}
                  bgColor={pairinformationBgColor}
                  borderRadius="6px"
                  p="3"
                  h="120px"
                >
                  <Flex
                    color={pairTextColor}
                    fontSize="14px"
                    flexDirection="column"
                  >
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Text>
                        Pooled{' '}
                        {pool?.path[0].token === 'WBNB'
                          ? 'BNB'
                          : pool?.path[0].token === 'WETH'
                            ? 'ETH'
                            : pool?.path[0].token}
                        :
                      </Text>
                      <Text>{pool?.pooledToken0}</Text>
                    </Flex>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Text>
                        Pooled{' '}
                        {pool?.path[1].token === 'WBNB'
                          ? 'BNB'
                          : pool?.path[1].token === 'WETH'
                            ? 'ETH'
                            : pool?.path[1].token}
                        :
                      </Text>
                      <Text>{pool?.pooledToken1}</Text>
                    </Flex>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Text>Your pool share:</Text>
                      <Text>{parseFloat(pool?.poolShare).toFixed(6)}%</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            )}
          </Box>
          <Box
            mt={3}
            bgColor={pairinformationBgColor}
            border="1px"
            borderColor={pairinformationBorderColor}
            borderRadius="6px"
            h="95px"
            p="3"
          >
            <Flex flexDirection="column">
              <Flex mb={2} justifyContent="flex-start">
                <Text color={positiontextColor} fontSize="14px">
                  Amount to be removed
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Input
                  color={inputTextColor}
                  focusBorderColor="none"
                  fontSize="24px"
                  p="0"
                  border="none"
                  value={inputValue}
                  placeholder="0"
                  onChange={(e) => {
                    let input = e.target.value;
                    let regex = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/;
                    if (e.target.value === '' || regex.test(input)) {
                      setInputValue(input);
                    }
                  }}
                />
                <Text color={pairTextColor} fontWeight="bold" fontSize="24px">
                  %
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Box
            mt={3}
            mb={3}
            bgColor={pairinformationBgColor}
            border="1px"
            borderColor={pairinformationBorderColor}
            borderRadius="6px"
            h="140px"
            p="3"
          >
            <Flex flexDirection="column">
              <Flex mb={2} justifyContent="flex-start">
                <Text color={positiontextColor} fontSize="14px">
                  Amount to be received
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Flex
                  w="46%"
                  border="1px"
                  borderColor={pairinformationBorderColor}
                  borderRadius="6px"
                  h="76px"
                  bgColor={positionBgColor}
                  p={3}
                  alignItems="center"
                >
                  {loading || pool.length === 0 ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={NullImage} />
                  ) : pool?.path[0].token === 'RGP' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={RGPImage} />
                  ) : pool?.path[0].token === 'BUSD' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={BUSDImage} />
                  ) : pool?.path[0].token === 'WETH' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={ETHImage} />
                  ) : pool?.path[0].token === 'WBNB' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={BNBImage} />
                  ) : (
                    <Img w="24px" h="24px" mr={2} mb={3} src={NullImage} />
                  )}
                  <Flex flexDirection="column">
                    <Text fontWeight="bold" color={pairTextColor}>
                      -
                    </Text>
                    <Text color={titleColor} fontSize="12px">
                      {loading || pool.length === 0
                        ? ''
                        : pool?.path[0].token === 'WBNB'
                          ? 'BNB'
                          : pool?.path[0].token === 'WETH'
                            ? 'ETH'
                            : pool?.path[0].token}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  w="46%"
                  border="1px"
                  borderColor={pairinformationBorderColor}
                  borderRadius="6px"
                  h="76px"
                  bgColor={positionBgColor}
                  p={3}
                  alignItems="center"
                >
                  {loading || pool.length === 0 ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={NullImage} />
                  ) : pool?.path[1].token === 'RGP' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={RGPImage} />
                  ) : pool?.path[1].token === 'BUSD' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={BUSDImage} />
                  ) : pool?.path[1].token === 'WETH' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={ETHImage} />
                  ) : pool?.path[1].token === 'WBNB' ? (
                    <Img w="24px" h="24px" mr={2} mb={3} src={BNBImage} />
                  ) : (
                    <Img w="24px" h="24px" mr={2} mb={3} src={NullImage} />
                  )}
                  <Flex flexDirection="column">
                    <Text fontWeight="bold" color={pairTextColor}>
                      -
                    </Text>
                    <Text color={titleColor} fontSize="12px">
                      {loading || pool.length === 0
                        ? ''
                        : pool?.path[1].token === 'WBNB'
                          ? 'BNB'
                          : pool?.path[1].token === 'WETH'
                            ? 'ETH'
                            : pool?.path[1].token}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Flex justifyContent="space-between">
            <Button
              h="45px"
              color={
                hasBeenApproved && inputValue
                  ? approvedButtonColor
                  : inputValue
                    ? approveButtonColor
                    : inActiveApproveButtonColor
              }
              bgColor={
                hasBeenApproved && inputValue
                  ? approvedButtonBgColor
                  : inputValue
                    ? approveButtonBgColor
                    : inActiveApproveButtonBgColor
              }
              _active={{
                bgColor:
                  hasBeenApproved && inputValue
                    ? approvedButtonBgColor
                    : inputValue
                      ? approveButtonBgColor
                      : inActiveApproveButtonBgColor,
              }}
              _hover={{
                bgColor:
                  hasBeenApproved && inputValue
                    ? approvedButtonBgColor
                    : inputValue
                      ? approveButtonBgColor
                      : inActiveApproveButtonBgColor,
              }}
              borderRadius="6px"
              w="46%"
              fontSize={isTabDevice && isTabDevice2 ? '12px' : ''}
              border={hasBeenApproved && inputValue ? '1px' : ''}
              borderColor={approvedButtonBorderColor}
              disabled={inputValue === ''}
              onClick={
                hasBeenApproved && inputValue
                  ? () => {
                    removeApproval();
                  }
                  : !hasBeenApproved && inputValue
                    ? () => {
                      approveLPTokens();
                    }
                    : undefined
              }
            >
              {hasBeenApproved && inputValue ? 'Approved' : 'Approve'}
            </Button>
            <Button
              h="45px"
              w="46%"
              borderRadius="6px"
              color={WithdrawalButtonColor}
              border="1px"
              borderColor={withdrawalButtonBorderColor}
              bgColor={withdrawaButtonBgColor}
              _active={{ bgColor: withdrawaButtonBgColor }}
              _hover={{ bgColor: withdrawaButtonBgColor }}
              px={14}
              fontSize={isTabDevice && isTabDevice2 ? '12px' : ''}
            >
              <Text>Confirm Withdrawal</Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Remove;

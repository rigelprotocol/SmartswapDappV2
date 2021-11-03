import React from 'react';
import {
  Flex,
  Box,
  useColorModeValue,
  Text,
  Image,
  Input,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon, TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../theme/components/Icons';
import BNBLOGO from '../../assets/BNB.svg';

const Remove = () => {
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
  return (
    <Flex minH="100vh" mt={10} justifyContent="center">
      <Box
        h="600px"
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
            mt="2"
            border="1px"
            borderRadius="6px"
            borderColor={borderColor}
            h={'220px'}
          >
            <Flex p={3} flexDirection="column">
              <Flex justifyContent="flex-start">
                <Text color={positiontextColor} fontWeight="bold">
                  Your Position
                </Text>
              </Flex>
              <Flex mt={2} justifyContent="space-between">
                <Flex alignItems="center">
                  <Flex mr={2} alignItems="center">
                    <Image src={BNBLOGO} />
                    <Image src={BNBLOGO} />
                  </Flex>
                  <Text fontWeight="bold" color={pairTextColor}>
                    RGP/BNB
                  </Text>
                </Flex>
                <Flex alignItems="center">
                  <Text mr={2} fontWeight="bold" color={pairTextColor}>
                    15750000
                  </Text>
                  <Text color={titleColor}>Pool Tokens</Text>
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
                    <Text>Pooled RGP:</Text>
                    <Text>0.4999999</Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Text>Pooled USDT:</Text>
                    <Text>15455675463645</Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Text>Your pool share:</Text>
                    <Text>6.10%</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
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
                  value="0.00"
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
                  <Image w="24px" h="24px" mr={2} mb={3} src={BNBLOGO} />
                  <Flex flexDirection="column">
                    <Text fontWeight="bold" color={pairTextColor}>
                      0.03022
                    </Text>
                    <Text color={titleColor} fontSize="12px">
                      BNB
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
                  <Image w="24px" h="24px" mr={2} mb={3} src={BNBLOGO} />
                  <Flex flexDirection="column">
                    <Text fontWeight="bold" color={pairTextColor}>
                      0.03022
                    </Text>
                    <Text color={titleColor} fontSize="12px">
                      BNB
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Flex justifyContent="space-between">
            <Button
              h="45px"
              color={approveButtonColor}
              bgColor={approveButtonBgColor}
              borderRadius="6px"
              w="46%"
            >
              Approve
            </Button>
            <Button
              h="45px"
              w="46%"
              borderRadius="6px"
              color={WithdrawalButtonColor}
              border="1px"
              borderColor={withdrawalButtonBorderColor}
              bgColor={withdrawaButtonBgColor}
            >
              Confirm Withdrawal
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Remove;

import React from "react";
import RGPLOGO from '../../assets/rgp-logo.png';
import {
  Box,
  Flex,
  Spacer,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Button,
  Heading,
  Input,
  Menu,
  Image,
  useColorModeValue,
  Divider,
  Center,
} from "@chakra-ui/react";
import {
  TimeIcon,
  SettingsIcon,
  ArrowBackIcon,
  AddIcon,
  ChevronDownIcon
} from "@chakra-ui/icons";

const AddLiquidity = () => {
  const infoBg = '#EBF6FE';
  const outerBoxBorder = useColorModeValue('#fffff', '#324D68');
  const inputBorder = useColorModeValue('#DEE6ED', '#324D68');
  const bgColor = useColorModeValue('#F2F5F8','#213345');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const iconColor = useColorModeValue('#333333', '#F1F5F8');
  const btnTextColor = useColorModeValue('#999999', '#7599BD')

  return(
    <Center m={8}>
      <Box
        maxW="496px"
        borderWidth="1px"
        borderRadius="md"
        borderColor={outerBoxBorder}
        overflow="hidden"
        alignItems="center"
        p={4}
      >
        <Flex>
          <ArrowBackIcon w={6} h={6} color={topIcons}/>
           <Spacer />
          <Heading as="h4" size="md">Add Liquidity</Heading>
           <Spacer />
          <SettingsIcon mr={5} w={6} h={6} color={topIcons}/>
          <TimeIcon w={6} h={6} color={topIcons}/>
        </Flex>
        <Box bg={infoBg} borderRadius="md" p={5} mt={5} mb={5}>
          <Text color="#319EF6" fontWeight="bold" fontSize="14px">
            Tip: When you add liquidity, you will receive pool tokens representing your position.
            These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
          </Text>
        </Box>
        <Box borderRadius="md" borderWidth="1px" pt={2} pb={2} borderColor={inputBorder}>
          <Flex alignItems="center" mt={3} justifyContent="space-between">
            <Input
              fontSize="2xl"
              type="number"
              border="none"
              isRequired
              placeholder="0.00"
              value="0.00"
              color="#CCCCCC"
            />
            <Flex>
              <Menu>
                <Button
                  border="0px"
                  h="40px"
                  w="120px"
                  rightIcon={<ChevronDownIcon />}
                  mr={3}
                >
                  <Image mr={3} h="24px" w="24px" src={RGPLOGO} />
                  <Text>RGP</Text>
                </Button>
              </Menu>
            </Flex>
          </Flex>
          <Flex mt={3} alignItems="center">
            <Text ml={4} fontSize="14px">
              Balance: 4.4544 RGP
            </Text>
              <Text
                ml={2}
                h="22px"
                w="34px"
                pl="4px"
                pr="4px"
                borderRadius="4px"
                fontSize="14px"
                color="#319EF6"
                bg="#EBF6FE"
              >
                Max
              </Text>
          </Flex>
        </Box>
        <Flex justifyContent="center">
          <Center w="40px" h="40px" bg={bgColor} borderWidth="3px" borderColor={inputBorder} color="#333333" borderRadius="xl" mt={5} mb={5}>
            <AddIcon color={iconColor}/>
          </Center>
        </Flex>
        <Box borderRadius="md" border="1px solid #DEE6ED" pt={2} pb={2} borderColor={inputBorder}>
          <Flex alignItems="center" mt={3} justifyContent="space-between">
            <Input
              fontSize="2xl"
              type="number"
              border="none"
              isRequired
              placeholder="0.00"
              value="0.00"
              color="#CCCCCC"
            />
            <Flex>
              <Menu>
                <Button
                  border="0px"
                  h="40px"
                  w="120px"
                  rightIcon={<ChevronDownIcon />}
                  mr={3}
                >
                  <Image mr={3} h="24px" w="24px" src={RGPLOGO} />
                  <Text>USDT</Text>
                </Button>
              </Menu>
            </Flex>
          </Flex>
          <Flex mt={3} alignItems="center">
            <Text ml={4} fontSize="14px">
              Balance: 2.3223 USDT
            </Text>
          </Flex>
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          borderColor={inputBorder}
          mt="5"
          mb="3"
        >
          <Text p="4">Prices & pool share</Text>
          <Divider orientation="horizontal" borderColor={inputBorder}/>
          <Flex p="4">
            <VStack>
              <Text>11.5068</Text>
              <Text>BNB per RGP</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text>0.08445554</Text>
              <Text>RGP per BNB</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text>0%</Text>
              <Text>Share of Pool</Text>
            </VStack>
          </Flex>
        </Box>
        <Button
          size="lg"
          height="48px"
          width="200px"
          border="2px"
          borderColor={inputBorder}
          color={btnTextColor}
          w="100%"
        >
          Enter An Amount
      </Button>
      </Box>
    </Center>
  )
}

export default AddLiquidity;

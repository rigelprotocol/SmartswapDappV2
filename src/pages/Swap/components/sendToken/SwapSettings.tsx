import React, {useState} from 'react';
import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  IconButton,
 }
 from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../../../theme/components/Icons';
import SwapSetting from '../../modals/swapSetting';
import { ExclamationIcon } from '../../../../theme/components/Icons';

const SwapSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  const bgColor = useColorModeValue('#ffffff', '#15202B');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgColorTwo = useColorModeValue('#F2F5F8', '#324D68');
  const textColorTwo = useColorModeValue('#666666', '#DCE6EF');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const activeButtonColor = useColorModeValue("#319EF6","#4CAFFF");
  const [slippageValue, setSlippageValue] = useState("");
  const handleClick = (e) => {
    e.preventDefault();
    setSlippageValue(e.target.value)
  }

  return (
    <Box w="100%">
      <Flex mt="3" alignItems="center" justifyContent="space-between">
        <Text fontWeight="400" fontSize="16px" color={textColor}>
          Swap
        </Text>
        <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
          <Popover>
            <PopoverTrigger>
              <IconButton
              bg="ghost"
              icon={<SettingsIcon />}
              _hover={{background: "none"}}
              _focus={{background: "none"}}
              />
            </PopoverTrigger>
            <PopoverContent borderRadius="6px" bg={bgColor}>
              <PopoverHeader color={textColorOne} fontSize="14px" borderBottom="none">Settings</PopoverHeader>
              <PopoverCloseButton
              bg="none"
              size={'sm'}
              mt={2}
              mr={3}
              cursor="pointer"
              _focus={{ outline: 'none' }}
              p={'7px'}
              border={'1px solid'}
              borderColor={textColorTwo}
              />
              <PopoverBody>
                <Flex mb={3}>
                  <Text fontSize="14px" mr={2} color={textColorTwo}>Slippage Tolerance</Text>
                  <ExclamationIcon color={textColorTwo}/>
                </Flex>
                <Flex mb={8}>
                {['0.1', '0.5', '1'].map((value, index) => (
                  <Button
                  key={index}
                  value={value}
                  onClick={handleClick}
                  mr={2}
                  bgColor={buttonBgcolor}
                  borderWidth="1px"
                  borderColor={borderColor}
                  color={textColorTwo}
                  pl={6}
                  pr={6}
                  _hover={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
                  _focus={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
                  >
                  {value}%
                  </Button>
                  ))}
                  <InputGroup>
                    <Input
                    value={slippageValue}
                    textAlign="right"
                    p={1}
                    borderRight="none"
                    borderRadius="4px"
                    borderColor={borderColor}
                    borderWidth="1px"
                    />
                    <InputRightAddon
                    children="%"
                    bg="ghost"
                    p={1}
                    borderColor={borderColor}
                    borderWidth="1px"
                    />
                  </InputGroup>
                </Flex>
                <Flex mb={3}>
                  <Text fontSize="14px" mr={2} color={textColorTwo}>Transaction Deadline</Text>
                  <ExclamationIcon color={textColorTwo}/>
                </Flex>
                <InputGroup mb={3} w="50%">
                  <Input
                  textAlign="right"
                  borderRight="none"
                  borderRadius="4px"
                  p={1}
                  borderColor={borderColor}
                  borderWidth="1px"
                  />
                  <InputRightAddon
                  children="Min"
                  bg="ghost"
                  p={1}
                  borderColor={borderColor}
                  borderWidth="1px"
                  />
               </InputGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <TimeIcon w="30px" color={iconColor} padding="4px" h="30px" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SwapSettings;

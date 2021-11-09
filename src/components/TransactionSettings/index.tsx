import React, {useState, useEffect} from 'react';
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
  PopoverCloseButton,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  IconButton,
 }
 from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../theme/components/Icons';
import { ExclamationIcon } from '../../theme/components/Icons';
import { useUserSlippageTolerance } from '../../state/user/hooks'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

const TransactionSettings = () => {
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  const bgColor = useColorModeValue('#ffffff', '#15202B');
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
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();
  const [slippageInput, setSlippageInput] = useState('');
  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
  <Flex alignItems="center" fontWeight="bold" rounded={100}>
    <Popover>
      <PopoverTrigger>
        <IconButton
        bg="transparent"
        icon={<SettingsIcon />}
        _hover={{background: "transparent"}}
        _focus={{background: "transparent !important"}}
        />
      </PopoverTrigger>
      <PopoverContent borderRadius="6px" bg={bgColor} borderColor={borderColor}>
        <PopoverHeader color={textColor} fontSize="14px" borderBottom="none">Settings</PopoverHeader>
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
            <Button
            value='0.1'
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
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
            0.1%
            </Button>
            <Button
            value='0.5'
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
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
            0.5%
            </Button>
            <Button
            value='1.0'
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
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
            1.0%
            </Button>

            <InputGroup>
              <Input
              placeholder={(userSlippageTolerance / 100).toFixed(2)}
              value={slippageInput}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                }
              }}
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
          <InputGroup mb={3} w="68%">
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
  </Flex>
  );
};

export default TransactionSettings;

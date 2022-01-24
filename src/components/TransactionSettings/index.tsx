import React, {useState} from 'react';
import {
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
  Tooltip,
 }
 from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '../../theme/components/Icons';
import { ExclamationIcon } from '../../theme/components/Icons';
import { useUserSlippageTolerance, useUserTransactionTTL } from '../../state/user/hooks'
import { escapeRegExp } from '../../utils'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../state";
import {detailsTab, transactionTab} from "../../state/transaction/actions";
import {removeSideTab} from "../../utils/utilsFunctions";

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
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
  };
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();
  const [slippageInput, setSlippageInput] = useState('');
  const [ttl, setTtl] = useUserTransactionTTL();
  const [deadlineInput, setDeadlineInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const transactionState = useSelector((state: RootState) => state.transactions.removeSideTab);
  const detailsState = useSelector((state: RootState) => state.transactions.removeDetailsTab);

  const showTransactionTab = () => {
    dispatch(transactionTab({removeSideTab: false}));
    window.localStorage.removeItem('history');
  };

  const hideTransactionTab = () => {
    dispatch(transactionTab({removeSideTab: true}));
    removeSideTab('history');
  };

  const showDetails = () => {
    dispatch(detailsTab({removeDetailsTab: false}));
    window.localStorage.removeItem('details');
  };

  const hideDetails = () => {
    dispatch(detailsTab({removeDetailsTab: true}));
    removeSideTab('details');
  };


  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);

  let slippageError: SlippageError | undefined;
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
      setSlippageInput(value);

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput;
  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value);

    try {
      const valueAsInt: number = Number.parseInt(value) * 60;
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  };

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
            <Tooltip
                hasArrow
                label="Your transactions will revert if the price changes unfavorably by more than this percentage."
                aria-label="A tooltip"
                placement="right-end"
              >
              <IconButton aria-label="Icon button" icon={<ExclamationIcon color={textColorTwo}/>} colorScheme="ghost" h="auto" minWidth="10px"/>
            </Tooltip>
          </Flex>
          <Flex mb={8}>
            <Button
            value='0.1'
            onClick={() => {
              setSlippageInput('');
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
              setSlippageInput('');
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
              setSlippageInput('');
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
              onBlur={() => {
                parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
              }}
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
          {!!slippageError && (
            <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? '#E53E3E' : '#DD6B20'} mb="8px">
              {slippageError === SlippageError.InvalidInput
                ? 'Enter a valid slippage percentage'
                : slippageError === SlippageError.RiskyLow
                ? 'Your transaction may fail'
                : 'Your transaction may be frontrun'}
            </Text>
          )}
          <Flex mb={3}>
            <Text fontSize="14px" mr={2} color={textColorTwo}>Transaction Deadline</Text>
            <Tooltip
                hasArrow
                label="Your transaction will revert if it is pending for more than this period of time."
                aria-label="A tooltip"
                placement="right-end"
              >
              <IconButton aria-label="Icon button" icon={<ExclamationIcon color={textColorTwo}/>} colorScheme="ghost" h="auto" minWidth="10px"/>
              </Tooltip>
          </Flex>
          <InputGroup mb={3} w="68%">
            <Input
            textAlign="right"
            borderRight="none"
            borderRadius="4px"
            p={1}
            borderColor={borderColor}
            borderWidth="1px"
            inputMode="numeric"
            pattern="^[0-9]+$"
            color={deadlineError ? 'red' : undefined}
            onBlur={() => {
              parseCustomDeadline((ttl / 60).toString())
            }}
            placeholder={(ttl / 60).toString()}
            value={deadlineInput}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                parseCustomDeadline(event.target.value)
              }
            }}
            />
            <InputRightAddon
            children="Min"
            bg="ghost"
            p={1}
            borderColor={borderColor}
            borderWidth="1px"
            />
         </InputGroup>
          <Button
              onClick={transactionState ? showTransactionTab : hideTransactionTab}
              bgColor={buttonBgcolor}
              borderColor={borderColor}
              color={textColorTwo}
              _hover={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
              _focus={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
          >
            {transactionState ?  'Show History Tab' : 'Hide History Tab'}
          </Button>

          <Button
              onClick={detailsState ? showDetails : hideDetails}
              bgColor={buttonBgcolor}
              borderColor={borderColor}
              color={textColorTwo}
              my={3}
              _hover={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
              _focus={{border:`1px solid ${activeButtonColor}`,color:`${activeButtonColor}`, background: `$buttonBgColorTwo`}}
          >
            {detailsState ?  'Show Details Tab' : 'Hide Details Tab'}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  </Flex>
  );
};

export default TransactionSettings;

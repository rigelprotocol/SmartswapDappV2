import React, {useState} from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    useDisclosure,
    useColorModeValue,
    Flex,
    Text,
    Button,
    InputGroup,
    InputRightAddon,
    Input,
} from "@chakra-ui/react"
import { ExclamationIcon } from '../../../theme/components/Icons';


const SwapSetting = () => {
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

  const {isOpen, onOpen, onClose} = useDisclosure();
  return(
    <>
    <Button onClick={onOpen} mt={4}>Swap Settings</Button>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="6px" bg={bgColor}>
        <ModalHeader color={textColorOne} fontSize="14px">Settings</ModalHeader>
        <ModalCloseButton
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
        <ModalBody>
          <Flex mb={3}>
            <Text fontSize="14px" mr={2} color={textColorTwo}>Slippage Tolerance</Text>
            <ExclamationIcon color={textColorTwo}/>
          </Flex>
          <Flex mb={8}>
            <Button
            value="0.1"
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
            0.1%
            </Button>
            <Button
            value="0.5"
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
            0.5%
            </Button>
            <Button
            value="1"
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
            1%
            </Button>
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
        </ModalBody>

      </ModalContent>
    </Modal>
    </>
  )
}

export default SwapSetting

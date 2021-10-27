import React from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton,
    ModalHeader,
    useDisclosure,
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import { shortenAddress } from "../../../utils";
import MetamaskLogo from "./../../../assets/metamaskLogo.png";
import { CopyIcon } from "../../../theme/components/Icons";
export type IModal= {
    displayWallet:boolean,
    accounts:string,
    setDisplayWallet:React.Dispatch<React.SetStateAction<boolean>>
}

const WalletModal:React.FC<IModal> = ({
displayWallet,
accounts,
setDisplayWallet
    }) => {
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const borderColor = useColorModeValue("#DEE6ED","#324D68")
    const dashedColor = useColorModeValue("#DEE6ED","#4A739B")
    const activeButtonColor = useColorModeValue("#319EF6","#4CAFFF")
    const buttonColor = useColorModeValue("#666666","#7599BD")
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();
    return (
        <>
          <Modal isCentered isOpen={displayWallet} onClose={()=>setDisplayWallet(false)}>
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                paddingBottom="20px"
                bgColor={bgColor}
                minHeight="40vh"
            >
                <ModalHeader
                     fontSize="24px"
                     fontWeight="regular"
                    >Wallet</ModalHeader>
              <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={()=>setDisplayWallet(false)}
                  p={'7px'}
                  border={'1px solid'}

              />
              <Box
              width="90%"
                margin="0 auto"
                fontSize="14px"
              >
                  <Flex
                  border ={`1px solid ${borderColor}`}
                  borderRadius ="6px"
                  padding="4px 0"
                  justifyContent="space-between"
                  >
                  <Button
              variant={'ghost'}
            leftIcon={
              <Image boxSize="30px" objectFit="contain" src={MetamaskLogo} mr="2"/>
            }
          >
            {shortenAddress(accounts)}
          </Button>
          <CopyIcon />
                      </Flex>
               <Box mt="4" fontSize="16px" color={lightTextColor}>
                <CopyIcon /> View on Etherscan
                </Box>
                <Box>
                  <Flex
                  justifyContent="space-between"
                  my="6">
                <Button
              background="transparent"
              border={`1px solid ${activeButtonColor}`}
              box-sizing="border-box"              
              box-shadow="0px 1px 7px rgba(41, 45, 50, 0.08)"
              border-radius="6px"
              padding="23px 0"
              color={activeButtonColor}
              isFullWidth
              _hover={{background:`${activeButtonColor}`,color:"#fff"}}
          >
            Switch Wallet
          </Button>
                <Button
              border={`1px solid ${buttonColor}`}
              box-sizing="border-box"              
              box-shadow="0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)"
              border-radius="6px"
              padding="23px 0"
              color={buttonColor}
              _hover={{background:`${buttonColor}`,color:"#fff"}}
              isFullWidth
              ml="4"
              background="transparent"
          >
            Disconnect Wallet
          </Button>
          </Flex>
                </Box>
                <Box padding="15px"border={`1px dashed ${dashedColor}`} borderRadius="6px" fontSize="16px" mt="9">
<Text color={lightTextColor} mb="6" textAlign="center">Your recent transactions will appear here</Text>
                  </Box>
                </Box>
                
               
            </ModalContent>
            </Modal>
          </>
    )
}

export default WalletModal
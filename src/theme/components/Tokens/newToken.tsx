import React,{useState} from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    useDisclosure,
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import USDTLOGO from '../../../assets/roundedlogo.svg';
import { ArrowBackIcon } from "@chakra-ui/icons"
import Warning from '../../../assets/warning.svg'; 
import { WarningIcon } from "../Icons";

export type IModal= {
token:{symbol?:string, name?:string},
open:boolean,
setDisplayImportedToken:React.Dispatch<React.SetStateAction<boolean>>
}

const NewToken:React.FC<IModal> = ({token,open, setDisplayImportedToken}) => {

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const dangerColor = useColorModeValue("#CC334F","#FF3358")
    const dangerBackground = useColorModeValue("#FFE5EA","#FFFFFF")
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();

    return (
        
        <>
        <Modal isOpen={open} onClose={onClose} isCentered >
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                bgColor={bgColor}
                minHeight="90vh"
            >
                 <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={()=>setDisplayImportedToken(false)}
                  p={'7px'}
                  border='1px solid'
              />
          <ModalHeader color={heavyTextColor} fontWeight="500"
         boxShadow={`0px 1px 0px ${boxShadow}`}>
            <ArrowBackIcon
              w={10}
              h={6}
              cursor="pointer"
              marginLeft="-12px"
              onClick={()=>setDisplayImportedToken(false)}
            />
            <Flex
              flexDirection="row"
              justifyContent="space-evenly"
              marginTop="-49px"
            >
              <Text marginLeft="0px" marginTop="22px" fontSize="16px">
                Import Token
              </Text>
            </Flex>
          </ModalHeader>
                <ModalBody maxHeight="100vh" pb="30px">
                  <Flex justifyContent="center" py="30px" alignItems="center" flexDirection="column">
                  <Image src={Warning}  pb="20px"/> 
                  <Text textAlign="center" color={heavyTextColor}>
                      This token doesn't appear on the active token list(s). Make sure this is the token that you want to trade.
                          </Text>
                    </Flex>
                
                     
                <Flex 
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                bgColor={boxColor} borderRadius="6px"
                py="30px">
                <Image src={USDTLOGO} />
                    <Text my="4" color={heavyTextColor}>{token.symbol}</Text>
                    <Text color={lightTextColor}>{token.name}</Text>
                    <Text my="4" color={textColor}>0x03B8ba77046851F062a2905ed9B8f7c903191c57</Text>
                    <Button color={dangerColor} _hover={{bgColor:"#FFE6EE"}} bgColor={dangerBackground}><WarningIcon color={dangerColor} /> Unknown Source</Button>
                </Flex>
                <Button color="white" bgColor={textColor} isFullWidth mt="3" height="48px"> Import</Button>
                      </ModalBody>
            </ModalContent>
          </Modal>
          </>
    )
}

export default NewToken

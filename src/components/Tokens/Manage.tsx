import React,{useState,Dispatch} from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    useColorModeValue,
    Box,
    Flex,
    Text
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state";
import { ArrowBackIcon } from "@chakra-ui/icons"
import ManageToken from "./manageTokens";
import ManageList from "./manageLists";
export type IModal= {
    open:boolean,
    setDisplayManageToken:Dispatch<React.SetStateAction<boolean>>
}

const Manage:React.FC<IModal> = ({open,setDisplayManageToken}) => {
const selected:Array<{type:string}> = [
{
type : "LISTS",
},
{
type : "TOKENS"
}
]

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const [selectedText,setSelectedText] = useState(0)
    
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();
 const dispatch = useDispatch()
 const tokenDetails = useSelector((state:RootState) =>state.application.tokenGroup)      


    return (
        
        <>
        <Modal isOpen={open} onClose={onClose} isCentered >
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                bgColor={bgColor}
                minHeight="80vh"
            >
             <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={()=>setDisplayManageToken(false)}
                  p={'7px'}
                  border='1px solid'
              />
          <ModalHeader color={heavyTextColor} fontWeight="500">
            <ArrowBackIcon
              w={10}
              h={6}
              cursor="pointer"
              marginLeft="-12px"
              onClick={()=>setDisplayManageToken(false)}
            />
            <Flex
              flexDirection="row"
              justifyContent="space-evenly"
              marginTop="-49px"
            >
              <Text marginLeft="0px" marginTop="22px" fontSize="16px">
                Manage
              </Text>
            </Flex>
          </ModalHeader>
                 
<Box
              width="100%"
                fontSize="14px"
                boxShadow={`0px 1px 0px ${boxShadow}`}
              >
                  <Box
                  width="90%"
                  margin="0 auto"
                  pb="5">
            <Flex 
            background={boxColor}
                borderRadius="6px"
                 p="2"
                 justifyContent="space-between">
                {selected.map((obj,id)=>{
                  return (
                    <Box 
                textAlign="center" 
                background={id===selectedText ? bgColor :"transparent"}
                onClick={()=>setSelectedText(id)}
                key={id}
                width="50%"
                borderRadius="6px"
                cursor="pointer">
                  <Text color={heavyTextColor} py="2">{obj.type} </Text> 
                </Box>
                  )
                })}
                    </Flex>
                   {selectedText === 0 ? <ManageToken/>:<ManageList/>}
                  
             
                </Box>
                </Box>
               
              
             
            </ModalContent>
          </Modal>
          </>
    )
}

export default Manage

import React,{useState} from "react"
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
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import ModalInput from "./input"
import USDTLOGO from '../../../assets/roundedlogo.svg';
import ManageToken from "./manageTokens"


export type IModal= {
tokenModal:boolean,
setTokenModal:React.Dispatch<React.SetStateAction<boolean>>
}

const SelectToken:React.FC<IModal> = ({tokenModal,setTokenModal}) => {

    const [displayManageToken,setDisplayManageToken] = useState(false)
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();
const openManageToken = ():void => {
setDisplayManageToken(state => !state)
}

      const arr = [
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
          },
          {
              symbol:"RGP",
              name:"RigelCoin",
              balance:"4.5554",
              img:USDTLOGO,
              imported:true
          },
      ]
    return (
        
        <>
        <Modal isOpen={tokenModal} onClose={onClose} isCentered >
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                bgColor={bgColor}
                minHeight="40vh"
            >
                <ModalHeader
                     fontSize="18px"
                     fontWeight="regular"
                    >Select a token</ModalHeader>
              <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={()=>setTokenModal(false)}
                  p={'7px'}
                  border='1px solid'
                  
              />
                 
<Box
              width="100%"
                fontSize="14px"
                boxShadow={`0px 1px 0px ${boxShadow}`}
              >
                  <Box 
                  width="90%"
                  margin="0 auto"
                  pb="5">
 <ModalInput placeholder="Search name or paste address"/>
                    </Box>
             
                </Box>
                <ModalBody maxHeight="50vh"
                  overflowY="scroll">
                <Box
                margin="0px auto">
                {arr.map((obj,index)=>{
                  return (
                      <Flex 
                      justifyContent="space-between"
                      py="3" 
                      fontSize="16px"
                       key={index}
                       cursor="pointer">
                          <Flex>
                           <Image src={obj.img} mr="3"/>
                           <Box>
                           <Text color={heavyTextColor} fontWeight="700">{obj.symbol}</Text>
                           <Text color={lightTextColor}>{obj.name} {obj.imported ? " . Added by user" : ""}</Text>
                           </Box>
                          
                          </Flex> 
                          <Box mt="3">
                               <Text color={heavyTextColor} fontWeight="700">{obj.balance}</Text>
                           </Box>
                    </Flex>
                  )  
                })}
                </Box>
                      </ModalBody>
              
               <ModalFooter py="4" bg={boxColor}
                borderRadius="6px">
                   <Box
                    w="100%" 
                    textAlign="center">
<Text fontSize="16px" color={textColor} cursor="pointer" onClick={() =>openManageToken()}>Manage Tokens</Text>
                       </Box>
                   
               </ModalFooter>
            </ModalContent>
          </Modal>
          <ManageToken open={displayManageToken} setDisplayManageToken={setDisplayManageToken}/>
          </>
    )
}

export default SelectToken

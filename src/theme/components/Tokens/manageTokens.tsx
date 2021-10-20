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
    Text,
    Switch,
    Button,
    Image
} from "@chakra-ui/react"
import ModalInput from "./input"
import USDTLOGO from '../../../assets/roundedlogo.svg';
import { ArrowBackIcon } from "@chakra-ui/icons"
import NewToken from "./newToken";

export type IModal= {
    open:boolean,
    setDisplayManageToken:Dispatch<React.SetStateAction<boolean>>
}

const ManageToken:React.FC<IModal> = ({open,setDisplayManageToken}) => {
  let arr = [{
    id:1,
    img: USDTLOGO,
    name:"RigelProtocol Extended",
    type:"RigelProtocol Extended",
    display:true
}, {
  id:2,
  img: USDTLOGO,
  name:"RigelProtocol Extended",
  type:"RigelProtocol Token List",
  display:false
}
]
const [listToken,setListToken] = useState(arr)
const selected:Array<{type:string}> = [
{
type : "LISTS",
},
{
type : "TOKENS"
}
]
const customToken = [
  {
    name:"RGP",
    symbol:"RGP"
  }
]
type IToken ={
  name:string,
  symbol:string
}

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const borderColor= useColorModeValue('#DEE6ED', '#324D68');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const selectedList = useColorModeValue("#EBF6FE","#213345")
    const [selectedText,setSelectedText] = useState(0)
    const [displayImportedToken,setDisplayImportedToken] = useState(false)
    const [importedToken,setImportedToken] = useState({})
    
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();
      

const changeDisplay = (e:any,id:number) =>{
let obj =arr.map(obj=>(id===obj.id) ? {...obj,
  display:obj.display = e.target.checked} : 
  {...obj,
    display:obj.display = obj.display
  })
console.log(obj)
setListToken(obj)
}
const displayImportToken = (token:IToken):void => {
  setDisplayImportedToken(state => !state)
  setImportedToken(token)
  }
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
                    {selectedText === 0 ?
                    <ModalInput placeholder="https:// or ipfs:// or ENS name"/> : 
                    <Box>
                    <ModalInput placeholder="0x0000"/>
                    <Box>
                      {customToken.map(token =>{
                        return (
                        <Flex justifyContent="space-between" borderRadius="6px" my="3" p="3"
                        background={boxColor}>
                          <Flex justifyContent="center" alignItems="center" flexDirection="row">
                          <Box><Image src={USDTLOGO} /></Box>
                          <Text mx="3" color={heavyTextColor} fontSize="16px">{token.name}</Text>
                          <Text color={lightTextColor} fontSize="12px">{token.symbol}</Text>
                            </Flex>
                          
                          <Button background={textColor} color="#ffffff" onClick={() => displayImportToken(token)}>Import</Button>
                          </Flex>)
                      })}
                      </Box>
                    </Box>
                    }
                
                      </Box>
                  
             
                </Box>
                <ModalBody maxHeight="70vh"
                  overflowY="scroll">
                    {selectedText===0 ? <Box
                margin="0px auto">
                {listToken.map((obj,index)=>{
                  return (
                      <Flex 
                      justifyContent="space-between"
                      p="2"
                       key={index}
                       cursor="pointer"
                       bgColor={obj.display === true ? selectedList : boxColor}
                       border={`1px solid ${obj.display === true ? textColor : borderColor}`}
                       borderRadius="6px"
                       my="4">
                          <Flex>
                           <Image src={obj.img} mr="3"/>
                           <Box>
                           <Text color={heavyTextColor} fontWeight="700" 
                      fontSize="15px">{obj.name}</Text>
                           <Text color={lightTextColor} 
                      fontSize="12px">{obj.type}</Text>
                           </Box>
                          
                          </Flex> 
                          <Box mt="3">
                               <Switch size="lg" py="3" 
                               defaultChecked={obj.display}
                               colorScheme="#EBF6FE" onChange={(e) => changeDisplay(e,obj.id)}/>
                           </Box>
                    </Flex>
                  )  
                })}
                </Box>: <Box>
                  <Text>0 Custom Tokens</Text>
                  </Box>
                  }
                
                
                      </ModalBody>
              
              {selectedText === 1 ?  <ModalFooter py="4" bg={boxColor}
                borderRadius="6px">
                   <Box
                    w="100%" 
                    textAlign="center">
<Text fontSize="16px" color={lightTextColor} cursor="pointer">Tip: Custom tokens are stored locally in your browser</Text>
                       </Box>
                   
               </ModalFooter>: <div/>}
            </ModalContent>
          </Modal>
          <NewToken open={displayImportedToken} setDisplayImportedToken={setDisplayImportedToken} token={importedToken}/>
          </>
    )
}

export default ManageToken

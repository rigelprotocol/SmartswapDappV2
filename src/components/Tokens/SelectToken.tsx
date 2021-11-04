import React,{ useState,useCallback,useMemo,useRef } from "react"
// import { Token } from "@sushiswap/sdk"
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
    Text,
} from "@chakra-ui/react"
import ModalInput from "./input"
import ManageToken from "./manageTokens"
import { useWeb3React } from "@web3-react/core"
import CurrencyList from "./CurrencyList"
import { Token } from "@uniswap/sdk-core"
import useDebounce from "../../hooks/useDebounce";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { useAllTokens,ExtendedEther } from "../../hooks/Tokens"
 type IModal= {
tokenModal:boolean,
setTokenModal:React.Dispatch<React.SetStateAction<boolean>>
}

export type Currency = Token
const SelectToken:React.FC<IModal> = ({tokenModal,setTokenModal}) => {
const { chainId } = useWeb3React()

    const [searchQuery,setSearchQuery] = useState<string>('')
    const debouncedQuery = useDebounce(searchQuery,300)
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
  
    const [displayManageToken,setDisplayManageToken] = useState(false)

    const allTokens = useAllTokens()
    
    const [ ,Symbol,Name,Logo] = useNativeBalance();
    const ether = ExtendedEther(chainId,Symbol,Name,Logo)


    const filteredTokens: Token[] = Object.values(allTokens)


    const filteredTokenListWithETH = useMemo(():Token[]=>{
      const s = debouncedQuery.toLowerCase().trim()
      if(s==="" || s ==="e" || s==="et" || s==="eth"){
        return ether ? [ ether,...filteredTokens] : filteredTokens
      }
      return filteredTokens
    },[debouncedQuery, ether, filteredTokens])
    const {
        onClose,
      } = useDisclosure();
const openManageToken = ():void => {
setDisplayManageToken(state => !state)
}
// refs for fixed size lists
const handleInput = useCallback(
  (event) => {
   const input = event.target.value
    setSearchQuery(input)
  },
  [],
)


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
                  <ModalInput 
                  placeholder="Search name or paste address"
                  searchQuery={searchQuery}
                  changeInput ={handleInput}
                  />
                    </Box>
             
                </Box>
                <ModalBody maxHeight="60vh"
                  overflowY="scroll">     
                {
                filteredTokenListWithETH.map((currency,index)=>{
                  return <CurrencyList
                  key={index}
                  currency={currency}
                  />
                })
                }
                      </ModalBody>
              
               <ModalFooter py="4" bg={boxColor}
                borderRadius="6px">
                   <Box
                    w="100%" 
                    textAlign="center">
                    <Text fontSize="16px" 
                    color={textColor} 
                    cursor="pointer" 
                    onClick={() =>openManageToken()}>
                        Manage Tokens</Text>
                       </Box>
                   
               </ModalFooter>
            </ModalContent>
          </Modal>
          <ManageToken open={displayManageToken} setDisplayManageToken={setDisplayManageToken}/>
          </>
    )
}

export default SelectToken

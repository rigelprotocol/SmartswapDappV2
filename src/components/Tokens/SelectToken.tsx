import React,{ useState,useCallback,useMemo,useRef } from "react"
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
import ManageToken from "./manageTokens"
import { useWeb3React } from "@web3-react/core"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList } from "react-window"
import CurrencyList from "./CurrencyList"
import useDebounce from "../../hooks/useDebounce";
import { defaultTokenList } from "./tokens";

 type IModal= {
tokenModal:boolean,
setTokenModal:React.Dispatch<React.SetStateAction<boolean>>
}
export type Currency = {
  chainId: number,
  address:string,
  name: string,
  symbol: string,
  decimals: number,
  logoURI: string
}
type currencyArray = Currency[]
const SelectToken:React.FC<IModal> = ({tokenModal,setTokenModal}) => {
const { chainId } = useWeb3React()
    const [displayManageToken,setDisplayManageToken] = useState(false)
    const [searchQuery,setSearchQuery] = useState<string>('')
    const debouncedQuery = useDebounce(searchQuery,300)

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")

    // const ether = useMemo(() => chainId && ExtendedEther.onChain(chainId),[chainId])


    const filteredTokenListWithETH = useMemo(():currencyArray=>{
      const s = debouncedQuery.toLowerCase().trim()
      if(s==="" || s ==="e" || s==="et" || s==="eth"){
       return defaultTokenList
      }
      return defaultTokenList
    },[defaultTokenList,defaultTokenList])
    const {
        onClose,
      } = useDisclosure();
const openManageToken = ():void => {
setDisplayManageToken(state => !state)
}

const handleInput = useCallback(
  (event) => {
   const input = event.target.value
  //  const checksummedInput = isAddress(input)
    setSearchQuery(input)
    // setSearchQuery(checksummedInput || input)
  },
  [],
)

// const Balance = ({balance}) => {
//   return  <Text title={balance.toExact()}>{balance.toSignificant(4)}</Text>
// }
const fixedList = useRef<FixedSizeList>()

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

  
  {/* <AutoSizer disableWidth>
{({height}) => {
  console.log({height})
  return(
  <CurrencyList
  height={height}
  currencies = {defaultTokenList}
  fixedListRef={fixedList}
  />
   )}} 
                     </AutoSizer> */}
                {defaultTokenList.map((currency,index)=>
                
                {
                  
                  return (
    //                   <Flex 
    //                   justifyContent="space-between"
    //                   py="2" 
    //                   fontSize="16px"
    //                    key={index}
    //                    cursor="pointer">
    //                       <Flex>
    //                       <Image 
    //  src={currency.logoURI}
    //  width="24px"
    //  height="24px"
    //  borderRadius="24px"/>
    //                        <Box>
    //                        <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
    //                        {/* <Text color={lightTextColor}>{currency.name} {currency.imported ? " • Added by user" : ""}</Text> */}
    //                        </Box>
                          
    //                       </Flex> 
    //                       <Box mt="3">
    //                            {/* <Text color={heavyTextColor} fontWeight="700">{currency.balance}</Text> */}
    //                        </Box>
    //                 </Flex>
    <CurrencyList currency={currency} />
                  )  
                })}
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

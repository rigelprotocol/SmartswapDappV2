import React,{ useState,useCallback,useMemo,useEffect } from "react"
// import { Token } from "@uniswap/sdk"
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
import Manage from "./Manage"
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import CurrencyList from "./CurrencyList"
import { Token,Currency,NativeCurrency } from "@uniswap/sdk-core"
import useDebounce from "../../hooks/useDebounce";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { useAllTokens,ExtendedEther,useToken,useIsUserAddedToken } from "../../hooks/Tokens"
import { isAddress } from "../../utils"
import { filterTokens } from "./filtering"
import ImportRow from "./ImportRow"
import NewToken from "./newToken"


type IModal= {
tokenModal:boolean,
setTokenModal:React.Dispatch<React.SetStateAction<boolean>>
onCurrencySelect: (currency: Currency) => void,
selectedCurrency?: Currency | null,
 otherSelectedCurrency?: Currency | null,
}

const SelectToken:React.FC<IModal> = ({
  tokenModal,
  setTokenModal,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency
}) => {
    const { chainId } = useActiveWeb3React();
     const [openNewTokenModal,setOpenNewTokenModal] = useState<boolean>(false);
    const [searchQuery,setSearchQuery] = useState<string>('');
    const debouncedQuery = useDebounce(searchQuery,300);
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const textColor = useColorModeValue("#319EF6","#4CAFFF");
    const boxColor = useColorModeValue("#F2F5F8","#213345");

    useEffect(()=>{
      setSearchQuery('')
      },[tokenModal]);

    const [displayManageToken,setDisplayManageToken] = useState(false);
    const handleCurrencySelect = useCallback(
      (currency: Currency) => {
        onCurrencySelect(currency)
      },
      [ onCurrencySelect],

    )
    const allTokens = useAllTokens()
    // useUpdateTokenList()
        // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
    const [ ,Symbol,Name,Logo] = useNativeBalance();
    const ether =  chainId && ExtendedEther(chainId,Symbol,Name,Logo);


    const filteredTokens: Token[] = useMemo(() => {
      return filterTokens(Object.values(allTokens), debouncedQuery)
    }, [allTokens, debouncedQuery]);
    

    const filteredTokenListWithETH = useMemo(():Currency[]=>{
      const s = debouncedQuery.toLowerCase().trim();
      if(s==="" || s ==="e" || s==="et" || s==="eth"){
        return ether ? [ ether,...filteredTokens] : filteredTokens
      }
      return filteredTokens
    },[debouncedQuery, ether, filteredTokens]);
    const {
        onClose,
      } = useDisclosure();
const openManageToken = ():void => {
setDisplayManageToken(state => !state)
};
// refs for fixed size lists
const handleInput = useCallback(
  (event) => {
    const input = event.target.value;
       const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input)

  },
  [],
);

const [isSearchingForToken, setIsSearchingForToken] = useState(false);
useEffect(() =>{
  if(!searchToken && !(filteredTokenListWithETH?.length > 0)){
     setIsSearchingForToken(true);
   }else{
     setIsSearchingForToken(false);
   }
 }, [searchToken, filteredTokenListWithETH]);

    return (

        <>
        <Modal isOpen={tokenModal} onClose={()=>setTokenModal(false)} isCentered>
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
                  overflowY="scroll" p={0}>
                  {isSearchingForToken ? <Text textAlign="center" py="7">Searching...</Text> : searchToken && !searchTokenIsAdded ?
                  <ImportRow
                  token = {searchToken}
                  openNewTokenModal = {setOpenNewTokenModal}
                  /> : filteredTokenListWithETH?.length > 0 ?
                filteredTokenListWithETH.map((currency,index)=>{
                  return <CurrencyList
                  onCurrencySelect={handleCurrencySelect}
                  key={index}
                  currency={currency}
                  selectedCurrency ={selectedCurrency}
                  otherSelectedCurrency ={otherSelectedCurrency}
                  />
                }) :
                <Text textAlign="center" py="7">No Result found...</Text>
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
          <Manage
          open={displayManageToken}
          setDisplayManageToken={setDisplayManageToken}
          setOpenNewTokenModal={setOpenNewTokenModal}
          openNewTokenModal={openNewTokenModal}
          handleCurrencySelect={handleCurrencySelect}
          />
          {searchToken && openNewTokenModal ?
          <NewToken
          open={openNewTokenModal}
          handleCurrencySelect={handleCurrencySelect}
          setDisplayImportedToken={setOpenNewTokenModal}
          tokens={[searchToken]}
           />: null
          }

          </>
    )
};

export default SelectToken

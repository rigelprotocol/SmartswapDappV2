import React,{useState, useMemo, useEffect} from "react"
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Switch,
    Image
} from "@chakra-ui/react"
import ModalInput from "./input"
import { useDispatch, useSelector } from "react-redux";
import { setTokenGroup } from "../../state/application/reducer";
import { RootState } from "../../state";
import { uriToHttp } from "../../utils/functions/uriToHttp";
import parseENSAddress from "../../utils/ENS/parseENSaddress";
import { TokenList } from "@uniswap/token-lists";
import useFetch
export type IModal= {}

const ManageList:React.FC<IModal> = () => {

// temporary fetched list for import flow
const [tempList, setTempList] = useState<TokenList>()
const [addError, setAddError] = useState<string | undefined>()

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const borderColor= useColorModeValue('#319EF6', '#4CAFFF');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const borderColor2 = useColorModeValue("#DEE6ED","#324D68")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const selectedList = useColorModeValue("#EBF6FE","#4CAFFF")
    const switchColor = useColorModeValue("#ffffff","#15202B")
    const [tokenInput,setTokenInput] = useState("")
 const dispatch = useDispatch()
 const tokenDetails = useSelector((state:RootState) =>state.application.tokenGroup)      

 const handleInput = (e:any) => {
    const input = e.target.value
    setTokenInput(input)
  }
  const fetchList = useFetchListCallback()

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(tokenInput).length > 0 || Boolean(parseENSAddress(tokenInput))
  }, [tokenInput])

  useEffect(() => {
    async function fetchTempList() {
      fetchList(tokenInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      if (tokenInput !== '') {
        setAddError('Enter valid list location')
      }
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [fetchList, listUrlInput, validUrl])

    return (
        
        <>
        <Box borderBottom="1px solid yellow" pt="4" pb="4">
          <ModalInput 
          placeholder="https:// or ipfs:// or ENS name"
          searchQuery ={tokenInput}
          changeInput={handleInput}
          /> 
        </Box>
        {addError ? (
          <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {addError}
          </Text>
        ) : null}
     
                     <Box
                          margin="0px auto" mt="4">
                            {tempList && <Text>yead</Text>}
                {tokenDetails.map((obj,index)=>{
                  return (
                      <Flex 
                      justifyContent="space-between"
                      p="2"
                       key={index}
                       cursor="pointer"
                       bgColor={obj.display === true ? selectedList : boxColor}
                       border={`1px solid ${obj.display === true ? borderColor : borderColor2}`}
                       borderRadius="6px"
                       my="4">
                          <Flex width="80%">
                           <Image src={obj.img} mr="3"/>
                           <Box mt="2">
                           <Text color={heavyTextColor} fontWeight="700" 
                      fontSize="15px">{obj.name}</Text>
                           <Text color={lightTextColor} 
                      fontSize="12px">{obj.type}</Text>
                           </Box>
                          
                          </Flex> 
                          <Box mt="3">
                               <Switch size="lg" py="2" 
                               defaultChecked={obj.display}
                               colorScheme={switchColor} onChange={(e) => dispatch(setTokenGroup({checked:e.target.checked,id:obj.id}))}/>
                           </Box>
                    </Flex>
                  )  
                })}
                </Box>
                
                
              
             
        
          </>
    )
}

export default ManageList

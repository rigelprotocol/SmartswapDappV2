import React,{useState,Dispatch} from "react"
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Switch,
    Button,
    Image
} from "@chakra-ui/react"
import ModalInput from "./input"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state";
export type IModal= {
}

const ManageToken:React.FC<IModal> = ({}) => {
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
    return (
       
     <>
    
                    <Box borderBottom="1px solid white" pt="4" pb="6">
                     <ModalInput placeholder="0x0000"
                     searchQuery ={tokenInput}
                      changeInput={handleInput}
                     />
                    </Box>
                   <Box>
                  <Text py="4">0 Custom Tokens</Text>
                  </Box>           
           
          </>
    )
}

export default ManageToken

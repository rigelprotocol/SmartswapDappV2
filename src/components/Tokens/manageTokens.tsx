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


    const [tokenInput,setTokenInput] = useState("")
         
 const handleInput = (e:any) => {
  const input = e.target.value
  setTokenInput(input)
}
    return (
       
     <>
    
                    <Box pb="2" pt="3">
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

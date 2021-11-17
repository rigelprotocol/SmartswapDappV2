
import React from 'react'

import { Token } from "@uniswap/sdk-core"
import CurrencyLogo from '../currencyLogo';
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button
} from "@chakra-ui/react"
import { useIsTokenActive, useIsUserAddedToken } from "../../hooks/Tokens"
type IImportRow = {
    token:Token,
    openNewTokenModal: React.Dispatch<React.SetStateAction<boolean>>
}
const ImportRow =({
   token,
   openNewTokenModal
}:IImportRow) => {
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8"); 
       const hover = useColorModeValue('rgba(228, 225, 222, 0.74)', "#14181b6c");
     // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)
    return (
        <Flex 
        justifyContent="space-between"
        py="2"
        fontSize="16px"
         cursor= "pointer"
         onClick={() => openNewTokenModal(true)}
         opacity='1'
        //  _hover={{ background: hover}}
         px="4"
         borderRadius="10px"
         >
            <Flex>
        
        <Box mr={3} mt={3}>
        <CurrencyLogo currency={token} size={24} squared={true}/>
        </Box>
         
             <Box>
             <Text color={heavyTextColor} fontWeight="700" mt="2">{token.symbol}</Text>
             <Text color={lightTextColor}>{token.name}</Text>
             {/* { currency?.isImported ? " • Added by user" : ""} */}
             </Box>
        
            </Flex> 
            <Box mt="3">
            {!isActive && !isAdded ? 

                <Button>
                    import
                </Button> :
<Text>active</Text>
            }
             </Box>
        </Flex> 



    )
}

export default ImportRow

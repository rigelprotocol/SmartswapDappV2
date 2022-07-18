
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
import {useDispatch} from "react-redux";
import {addImportedToken} from "../../state/lists/actions";
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
  const boxColor = useColorModeValue("#F2F5F8","#213345")
     // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

    const importedToken = {
        ...token,
        isToken: true
    };

    const dispatch = useDispatch();

    return (
        <>
        <Flex 
        justifyContent="space-between"
        py="2"
        fontSize="16px"
        bg={boxColor}
         opacity='1'
         px="4"
         borderRadius="10px"
        m={2}
         >
            <Flex>
        
        <Box mr={3} mt={2}>
        <CurrencyLogo currency={token} size={28} squared={true}/>
        </Box>
         
             <Box>
             <Text color={heavyTextColor} fontWeight="700" mt="1">{token.symbol}</Text>
             <Text color={lightTextColor}>{token.name}</Text>
             </Box>
        
            </Flex> 
            <Box mt={2}>
            {!isActive && !isAdded ? 

                <Button
                cursor= "pointer"
                onClick={() => {
                    openNewTokenModal(true);
                    dispatch(addImportedToken({newToken: importedToken}))
                }}>
                    import
                </Button> : <Text>active</Text>
            }
             </Box>
        </Flex> 

</>
    )
}

export default ImportRow

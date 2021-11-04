
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Token } from '@uniswap/sdk-core'
import CurrencyLogo from '../currencyLogo';
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Spinner,
    Image
} from "@chakra-ui/react"
import { GetAddressTokenBalance } from "../../state/wallet/hooks"
type ICurrencyList = {
    currency:Token
}
const CurrencyList =({
   currency
}:ICurrencyList) => {
const {account } = useWeb3React()
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const [balance] = GetAddressTokenBalance(currency)
    function Balance({ balance }: { balance:string | number}) {
        return <Text>{balance}</Text>
      }
    return (
        <Flex 
        justifyContent="space-between"
        py="2" 
        fontSize="16px"
         cursor="pointer">
            <Flex>
        
        <Box mr={3}>
        <CurrencyLogo currency={currency} size={24} squared={true} style={{marginTop:"20px"}}/>
        </Box>
         
             <Box>
             <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
             <Text color={lightTextColor}>{currency.name} </Text>
             {/* { currency?.isImported ? " • Added by user" : ""} */}
             </Box>
        
            </Flex> 
            <Box mt="3">
            {balance ? <Balance balance={balance} /> : account ? <Spinner size="xs" /> : null}
             </Box>
        </Flex> 



    )
}

export default CurrencyList

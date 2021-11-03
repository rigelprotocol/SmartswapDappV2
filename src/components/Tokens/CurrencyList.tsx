
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Currency,Token } from '@uniswap/sdk-core'
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import USDTLOGO from '../../assets/roundedlogo.svg';
import { GetAddressTokenBalance } from "../../state/wallet/hooks"
type ICurrencyList = {
    currency:Token,
    key:number
}
const CurrencyList =({
   currency,
   key
}:ICurrencyList) => {
const {account,chainId} = useWeb3React()
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
            <Image 
        src={currency.logoURI}
        width="24px"
        height="24px"
        borderRadius="24px" mr="3" mt="4"/>
             <Box>
             <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
             <Text color={lightTextColor}>{currency.name} </Text>
             {/* { currency?.isImported ? " • Added by user" : ""} */}
             </Box>
        
            </Flex> 
            <Box mt="3">
            {balance ? <Balance balance={balance} /> : account ? <Image src={USDTLOGO} /> : null}
             </Box>
        </Flex> 



    )
}

export default CurrencyList

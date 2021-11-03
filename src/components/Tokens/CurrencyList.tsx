
import React,{useCallback,useState,useEffect } from 'react'
import { FixedSizeList } from 'react-window'
import { useWeb3React } from '@web3-react/core'
import { Currency } from '@uniswap/sdk-core'
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import USDTLOGO from '../../assets/roundedlogo.svg';
import { useCurrencyBalance,GetAddressTokenBalance } from "../../state/wallet/hooks"
type ICurrencyList = {
    currency:Currency,
    key:number
}
const CurrencyList =({
   currency,
   key
}:ICurrencyList) => {
const {account,chainId} = useWeb3React() 

    // const GetBalance = async ()=>await useCurrencyBalance(account ?? undefined, currency)

  
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    // const [result,loading] = useCurrencyBalance(account ?? undefined, currency)
    const [balance] = GetAddressTokenBalance(currency)
    console.log(balance)
    function Balance({ balance }: { balance:string | number}) {
        return <Text>{balance ?? "love"}</Text>
      }
//     const Row = useCallback(
//         function TokenRow({data,index,style}){
// const row = data[index]

// const currency = row

// console.log({currency,balance})
// if(currency) {
//     return (
//         <Flex 
//         justifyContent="space-between"
//         py="2" 
//         fontSize="16px"
//          cursor="pointer">
//             <Flex>
//             <Image 
//         src={currency.logoURI}
//         width="24px"
//         height="24px"
//         borderRadius="24px" mr="3" mt="4"/>
//              <Box>
//              <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
//              <Text color={lightTextColor}>{currency.name} { currency?.isImported ? " • Added by user" : ""}</Text>
//              </Box>
        
//             </Flex> 
//             <Box mt="3">
//             {balance ? <Balance balance={balance} /> : account ? "undefined" : null}
//              </Box>
//         </Flex>
//     )
// }else {
//     return null
// }
//         },[currencies.length]
//     )
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
             {/* <Text color={lightTextColor}>{currency.name} { currency?.isImported ? " • Added by user" : ""}</Text> */}
             </Box>
        
            </Flex> 
            <Box mt="3">
            {balance ? <Balance balance={balance} /> : account ? <Image src={USDTLOGO} /> : null}
             </Box>
        </Flex> 



    )
}

export default CurrencyList

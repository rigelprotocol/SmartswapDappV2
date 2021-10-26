
import React,{useCallback,useMemo} from 'react'
import { FixedSizeList } from 'react-window'
import {  Token, CurrencyAmount } from '@uniswap/sdk'
import { useWeb3React } from '@web3-react/core'
import {GetAddressTokenBalance} from "../../hooks/useWallet"
import {
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image
} from "@chakra-ui/react"
import USDTLOGO from '../../assets/roundedlogo.svg';
type Currency = {
    chainId: number,
    address:string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    imported?:boolean
}
type ICurrencyList = {
    currency: Currency
}
const CurrencyList =({
   currency
}:ICurrencyList) => {
    
const {account} = useWeb3React() 
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    function Balance({ balance }: { balance:string[]}) {
        return <Text>{balance}</Text>
      }
    const Row = useCallback(
        function TokenRow({data,index,style}){
const row = data[index]

const currency = row

if(currency) {
    return (
        <Flex 
        justifyContent="space-between"
        py="2" 
        fontSize="16px"
         key={index}
         style={style}
         cursor="pointer"
          zIndex="999">
            <Flex>
     <Image 
     src={currency.logoURI}
     width="24px"
     height="24px"/>
        
             <Box>
             <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
             {/* <Text color={lightTextColor}>{currency.name} {currency.imported ? " • Added by user" : ""}</Text> */}
             </Box>
            
            </Flex> 
            <Box mt="3">
                 {/* <Text color={heavyTextColor} fontWeight="700">{obj.balance}</Text> */}
             </Box>
      </Flex>
    )
}else {
    return null
}
        },[currency]
    )
    
    const balance = GetAddressTokenBalance(currency.address)
    return (
//        <FixedSizeList
//        height={height}
//        width="100%"
//        ref={fixedListRef as any}
//        itemData={itemData}
//        itemCount={itemData.length}
//        itemSize={35}
//        >
// {Row}
//        </FixedSizeList>
<Flex 
justifyContent="space-between"
py="2" 
fontSize="16px"
 cursor="pointer"
 bg="yellow" zIndex="999">
    <Flex>
<Image 
src={currency.logoURI}
width="24px"
height="24px"/>

     <Box>
     <Text color={heavyTextColor} fontWeight="700" mt="2">{currency.symbol}</Text>
     <Text color={lightTextColor}>{currency.name} {currency?.imported ? " • Added by user" : ""}</Text>
     </Box>
    
    </Flex> 
    <Box mt="3">
     {balance ? <Balance balance={balance} /> : account ? <Image src={USDTLOGO} /> : null}
     </Box>
</Flex>
    )
}

export default CurrencyList

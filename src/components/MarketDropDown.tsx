import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Flex, Img, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react"
import { binanceTestMarketArray,polygonMarketArray,binanceMarketArray, binanceFreeMarketArray } from "../state/swap/hooks"

// const binanceMarketArray = [
//   {name:"Smartswap",image:"Smartswap.png"},
//   {name:"Pancakeswap",image:"Pancakeswap.png"},
// ]

// const polygonMarketArray = [
//   {name:"Smartswap",image:"Smartswap.png"},
//   {name:"Quickswap",image:"Quickswap.png"}
// ]

// const binanceTestMarketArray = [
//   {name:"Smartswap",image:"Smartswap.png"},
// ]
const MarketDropDown = ({marketType,setMarketType,chainID,switchMarket,type}:{marketType:string,setMarketType:React.Dispatch<React.SetStateAction<string>>,chainID:number | undefined,switchMarket:(market:string)=>void,type?:string}) => {
  const [marketArray,setMarketArray] = useState(binanceFreeMarketArray)
  useEffect(()=>{
    console.log({type})
    if(chainID === 56 && type==="free"){
      setMarketArray(binanceFreeMarketArray)
    }else if(chainID===56 && type !=="free"){
      setMarketArray(binanceMarketArray)
    }
    if(chainID === 97) setMarketArray(binanceTestMarketArray)
    else if(chainID === 137) setMarketArray(polygonMarketArray)
  },[chainID])
    const borderColor = useColorModeValue('#DEE6ED', '#324D68');
    return (
        <Menu>
        <MenuButton
          variant="ghost"
          as={Button}
          transition="all 0.2s"
          rightIcon={<ChevronDownIcon />}
          fontWeight={200}
          _focus={{ color: "#319EF6" }}
          fontSize="13px"
          textTransform={'capitalize'}
          border={`2px solid ${borderColor}`}
        >
          <Flex>
            <Img src={`./images/${marketType}.png`} width="25px" height="25px" mr="1" /> <Text mt="1">{marketType}</Text>
          </Flex>
         
        </MenuButton>
        <MenuList>
          {marketArray.map((item:{name:string,image:string},index)=>(
            <MenuItem
            key={index}
            _focus={{ color: "#319EF6" }}
            onClick={() => {
              setMarketType(item.name)
              switchMarket(item.name.toLowerCase())
              }} fontSize="13px">
           <Img 
           src={`./images/${item.image}`} 
           width="30px" 
           height="30px" 
           mr={2} />
           {item.name}
          </MenuItem>
          ))
  
          }
          
        </MenuList>
      </Menu>
  
    )
}


export default MarketDropDown
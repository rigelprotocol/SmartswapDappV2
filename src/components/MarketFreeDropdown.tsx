import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Flex, Img, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react"
import { AvalancheFreeMarketArray, binanceFreeMarketArray, binanceTestFreeMarketArray, polygonFreeMarketArray, polygonTestFreeMarketArray } from "../state/swap/hooks"
import { useLocation } from "react-router-dom"


const MarketFreeDropDown = ({marketType,setMarketType,chainID,switchMarket,type}:{marketType:string,setMarketType:React.Dispatch<React.SetStateAction<string>>,chainID:number | undefined,switchMarket:(market:string)=>void,type?:string}) => {
  const location = useLocation()
  console.log({location},location.search.includes("bsc_test"))
  const [marketArray,setMarketArray] = useState(location.search.includes("bsc_test")? binanceTestFreeMarketArray : binanceFreeMarketArray)
  useEffect(()=>{
    console.log({type})
    if(chainID === 56) setMarketArray(binanceFreeMarketArray)
    if(chainID === 97) setMarketArray(binanceTestFreeMarketArray)
    else if(chainID === 137) setMarketArray(polygonFreeMarketArray)
    else if(chainID === 43113 || chainID === 43114) setMarketArray(AvalancheFreeMarketArray)
    else if(chainID === 80001) setMarketArray(polygonTestFreeMarketArray)
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
              
              console.log({item,marketArray})
              // setMarketType(item.name)
              // switchMarket(item.name.toLowerCase())
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


export default MarketFreeDropDown
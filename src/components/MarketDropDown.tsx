import React from "react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Flex, Img, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react"

const MarketDropDown = ({marketType,setMarketType}:{marketType:string,setMarketType:React.Dispatch<React.SetStateAction<string>>}) => {
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
          border={`1px solid ${borderColor}`}
        >
          <Flex>
            <Img src={`./images/${marketType}.png`} width="25px" height="25px" mr="1" /> <Text mt="1">{marketType}</Text>
          </Flex>
         
        </MenuButton>
        <MenuList>
          {[
              {name:"Smartswap",image:"Smartswap.png"},
              {name:"Pancakeswap",image:"Pancakeswap.png"},
              {name:"Sushiswap",image:"Sushiswap.png"}
            ].map((item:{name:string,image:string},index)=>(
            <MenuItem
            key={index}
            _focus={{ color: "#319EF6" }}
            onClick={() => setMarketType(item.name)} fontSize="13px">
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
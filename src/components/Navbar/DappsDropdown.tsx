import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Button,
  Badge,
  Text,
  Spacer,
  IconButton,
  Link,
  Icon,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { AiOutlineAppstore } from "react-icons/ai";

function DappsDropdown() {
  const swapItems = [
    {
      name:"SmartSwap",
      text:" Swap tokens directly.",
      link:"/#/swap",
      icon:""
    },
    {
      name:"GiftDApp",
      text:"Gift tokens in a fun way.",
      link:"https://giftdapp.rigelprotocol.com/",
      icon:""
    },
    {
      name:"LaunchPad",
      text:"Join projects hosted on RigelProtocol.",
      link:"https://launchpad.rigelprotocol.com/",
      icon:""
    },
    {
      name:"SmartBid",
      text:"Bid on tokens",
      link:"https://smartswap.rigelprotocol.com/#/smartbid",
      icon:""
    },
    {
      name:"Auto Period",
      text:"Auto invest in any crypto of your choice",
      link:"https://smartswap.rigelprotocol.com/#/auto-period",
      icon:""
    },
    {
      name:"Farms",
      text:"Stake Liquidity Pair Tokens from any pool",
      link:"https://smartswap.rigelprotocol.com/#/farming-v2",
      icon:""
    },
  ]
  return (
    <>
      <Menu>
        <MenuButton
          mr={1}
          variant="ghost"
          as={Button}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.100" }}
          _focus={{ boxShadow: "outline" }}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<AiOutlineAppstore />}
          fontSize="14px"
          className='HeaderDApps'
        >
          DApps
        </MenuButton>
        <MenuList>
          {/* <MenuItem>
            <Stack direction={'column'} spacing={0} >
              <Text>SmartSwap</Text>
              <Text color={'gray.500'}>  Swap tokens directly.</Text>
            </Stack>

          </MenuItem> */}
          {swapItems.map((item,index)=>{
            return (
              <MenuItem key={index}>
            <Link href={item.link} isExternal ={item.link==="/#/swap" ?false:true} >
              <Stack direction={'column'} spacing={0} >
                <Text>{item.name}</Text>
                <Text color={'gray.500'}>{item.text}</Text>
              </Stack>
            </Link>
          </MenuItem>
   
            )
          })}
          
        </MenuList>
      </Menu>
    </>
  );
}

export default DappsDropdown;

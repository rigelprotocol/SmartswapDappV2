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
  useColorModeValue,
  Img,
  Box,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { AiOutlineAppstore } from "react-icons/ai";
import SwapIcon from "../../assets/swapIcon1.svg";
import SmartBidIcon from "../../assets/smartBidI.svg";
import GiftDapp from "../../assets/giftDapp.svg";
import Launchpad from "../../assets/Launchpad.svg";
import Autoperiod from "../../assets/Autoperiod.svg";

function DappsDropdown() {
  const swapItems = [
    {
      name:"SmartSwap",
      text:" Swap tokens directly.",
      link:"/#/swap",
      icon:<Img src={SwapIcon} />
    },
    {
      name:"GiftDApp",
      text:"Gift tokens in a fun way.",
      link:"https://giftdapp.rigelprotocol.com/",
      icon:<Img src={GiftDapp} />
    },
    {
      name:"LaunchPad",
      text:"Join projects hosted on RigelProtocol.",
      link:"https://launchpad.rigelprotocol.com/",
      icon:<Img src={Launchpad} />
    },
    {
      name:"SmartBid",
      text:"Bid on tokens",
      link:"https://smartswap.rigelprotocol.com/#/smartbid",
      icon:<Img src={SmartBidIcon} />
    },
    {
      name:"Auto Period",
      text:"Auto invest in any crypto of your choice",
      link:"https://smartswap.rigelprotocol.com/#/auto-period",
      icon:<Img src={Autoperiod} />
    },
    {
      name:"Farms",
      text:"Stake Liquidity Pair Tokens from any pool",
      link:"https://smartswap.rigelprotocol.com/#/farming-v2",
      icon:<Img src={SwapIcon} />
    },
  ]
  const background=useColorModeValue("white","#15202B")
  const bg=useColorModeValue("linear-gradient(90deg, #EEF0FC 0%, #EEFCFC 100%)","linear-gradient(90deg, #0E1644 0%, #0D4544 100%);")
  const color = useColorModeValue("#319EF6","#F1F5F8")
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
        <MenuList
        background={background}
        width="408px"
        boxShadow="0px 4px 20px -4px rgba(0, 0, 0, 0.1)"
        borderRadius="6px"
        boxSizing="border-box"
        padding="16px 16px 24px 16px"

        >
          {/* <MenuItem>
            <Stack direction={'column'} spacing={0} >
              <Text>SmartSwap</Text>
              <Text color={'gray.500'}>  Swap tokens directly.</Text>
            </Stack>

          </MenuItem> */}
          {swapItems.map((item,index)=>{
            return (
              <MenuItem key={index}
              _hover={{bg,color}}
              >
            <Link href={item.link} isExternal ={item.link==="/#/swap" ?false:true} >
              <Flex>
                <Box mt="10px" mr="14px">
                {item.icon}
                </Box>
              <Stack direction={'column'} spacing={0} >
                <Text>{item.name}</Text>
                <Text color={'gray.500'}>{item.text}</Text>
              </Stack>
              </Flex>
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

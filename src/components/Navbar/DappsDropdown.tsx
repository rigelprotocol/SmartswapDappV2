import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Text,
  Link,
  Stack,
  useColorModeValue,
  Img,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AiOutlineAppstore } from "react-icons/ai";
import SwapIcon from "../../assets/swapIcon1.svg";
import SmartBidIcon from "../../assets/smartBidI.svg";
import GiftDapp from "../../assets/giftDapp.svg";
import Launchpad from "../../assets/Launchpad.svg";
import Autoperiod from "../../assets/Autoperiod.svg";

function DappsDropdown() {
  const swapItems = [
    {
      name: "SmartSwap",
      text: " Swap tokens instantly.",
      link: "/swap",
      icon: <Img src={SwapIcon} />,
      isExternal: false,
    },
    {
      name: "GiftDApp",
      text: "Gift tokens in a fun way.",
      link: "https://giftdapp.rigelprotocol.com/",
      icon: <Img src={GiftDapp} />,
      isExternal: true,
    },
    {
      name: "LaunchPad",
      text: "Join projects hosted on RigelProtocol.",
      link: "https://launchpad.rigelprotocol.com/",
      icon: <Img src={Launchpad} />,
      isExternal: true,
    },
    {
      name: "SmartBid",
      text: "Bid on tokens",
      link: "/smartbid",
      icon: <Img src={SmartBidIcon} />,
      isExternal: false,
    },
    {
      name: "AutoTrade",
      text: "Auto invest in any crypto of your choice",
      link: "https://smartswap.rigelprotocol.com/#/autotrade",
      icon: <Img src={Autoperiod} />,
      isExternal: true,
    },
    {
      name: "Farms",
      text: "Stake Liquidity Pair Tokens from any pool",
      link: "/farm",
      icon: <Img src={SwapIcon} />,
      isExternal: false,
    },
  ];
  const background = useColorModeValue("white", "#15202B");
  const bg = useColorModeValue(
    "linear-gradient(90deg, #EEF0FC 0%, #EEFCFC 100%)",
    "linear-gradient(90deg, #0E1644 0%, #0D4544 100%)"
  );
  const color = useColorModeValue("#319EF6", "#F1F5F8");
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          mr={1}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          icon={<AiOutlineAppstore />}
          rightIcon={<ChevronDownIcon />}
          _hover={{ bg: "gray.100" }}
          _focus={{ boxShadow: "outline" }}
          fontSize="20px"
          className="HeaderDApps"
          p={2}
        />
        <MenuList
          background={background}
          width="408px"
          boxShadow="0px 4px 20px -4px rgba(0, 0, 0, 0.1)"
          borderRadius="6px"
          boxSizing="border-box"
          padding="16px 16px 24px 16px"
        >
          {swapItems.map((item, index) => {
            return (
              <MenuItem key={index} _hover={{ bg, color }} borderRadius={"6px"}>
                <Link href={item.link} isExternal={item.isExternal}>
                  <Flex>
                    <Box mt="10px" mr="14px">
                      {item.icon}
                    </Box>
                    <Stack direction={"column"} spacing={0}>
                      <Text>{item.name}</Text>
                      <Text color={"gray.500"}>{item.text}</Text>
                    </Stack>
                  </Flex>
                </Link>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
}

export default DappsDropdown;

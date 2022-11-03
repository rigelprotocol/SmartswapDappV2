import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Text,
  Flex,
  Box,
  Img,
  Divider,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import Spherium from "../../assets/spherium1.svg";
import Polygon from "../../assets/Chainpolygon1.svg";
import Binance from "../../assets/binance1.svg";
import Router from "../../assets/router1.svg";
import VectorFire from "../../assets/VectorFIre.svg";
import { SupportedChainId } from "../../constants/chains";

const Nav = ({ to, label,children,img }: { to: string; label?: string,children?:React.ReactNode,img?:any }) => (
  <NavLink
    to={to}
    activeStyle={{
      color: "#319EF6",
    }}

  >
    <Flex justifyContent="space-between">{label} <Img src={img} ml="20px"/></Flex>
    {children}
  </NavLink>
);

export function SwapDropdown() {
  const location = useLocation();
  const { chainId } = useActiveWeb3React();
  const name = location.pathname;
  const {search} = useLocation();

  const useName = () => {
    console.log(name);
    if (name.includes('swap') || name.includes('autotrade') || name.includes('set-price')) {
      console.log(`Correct name is ${name.split("/")}`);
      return name.split("/")[1];
    } else {
      return 'Swap'
    }
  };

  return (
    <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{ color: "#319EF6" }}
        fontSize="14px"
        padding="5px 6px"
        textTransform={'capitalize'}
      >
        {useName()}
      </MenuButton>
      <MenuList>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Swap" to={`/swap${search}`} />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="AutoTrade" to={chainId !== SupportedChainId.BINANCETEST && chainId !== SupportedChainId.BINANCE && chainId !== SupportedChainId.POLYGON  && chainId !== SupportedChainId.AVALANCHE && chainId!== SupportedChainId.AVALANCHE_FUJI  ? '#' : `/autotrade${search}`} img={VectorFire}/>
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Set Price" to={chainId !== SupportedChainId.BINANCETEST && chainId !== SupportedChainId.BINANCE && chainId !== SupportedChainId.POLYGON && chainId !== SupportedChainId.AVALANCHE && chainId!== SupportedChainId.AVALANCHE_FUJI ? '#' :`/set-price${search}`} />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Freeswap" to={chainId !== SupportedChainId.BINANCETEST && chainId !== SupportedChainId.BINANCE && chainId !== SupportedChainId.POLYGON && chainId !== SupportedChainId.POLYGONTEST && chainId !== SupportedChainId.AVALANCHE && chainId!== SupportedChainId.AVALANCHE_FUJI   ? '#' :`/freeswap${search}`} img={VectorFire}/>
        </MenuItem>
      </MenuList>
    </Menu> 
  );
}

export function BridgeDropdown() {
  const location = useLocation();
  const { chainId } = useActiveWeb3React();
  const boxShadow=useColorModeValue("0px 4px 6px -4px rgba(178, 193, 230, 0.12), 0px 8px 8px -4px rgba(178, 193, 230, 0.08);","0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)")
  const bg= useColorModeValue("linear-gradient(90deg, #EEF0FC 0%, #EEFCFC 100%)","linear-gradient(90deg, #0E1644 0%, #0D4544 100%)")
  const background=useColorModeValue("white","#15202B")
  return (
    <Menu >
    <MenuButton

      variant="ghost"
      as={Button}
      transition="all 0.2s"
      rightIcon={<ChevronDownIcon />}
      fontWeight={200}
      _focus={{ color: "#319EF6" }}
      fontSize="14px"
      padding="5px 6px"
      textTransform={'capitalize'}
    >
      Bridge
    </MenuButton>
    <MenuList 
    width="408px"
    height="289px"
    boxShadow="0px 4px 20px -4px rgba(0, 0, 0, 0.1)"
borderRadius="6px"
boxSizing="border-box"
padding="16px 16px 24px 16px"
    background={background}>
       <Tooltip label={chainId === SupportedChainId.AVALANCHE || chainId=== SupportedChainId.AVALANCHE_FUJI ? "coming soon":""}  bg={chainId === SupportedChainId.AVALANCHE || chainId=== SupportedChainId.AVALANCHE_FUJI ?"gray.300":"transparent"} color="black">
      <MenuItem cursor="pointer" _focus={{ color: "#319EF6" }}
      py="10px"
      _hover={{background:`${bg}`,boxShadow:`${boxShadow}`,borderRadius:"6px"}}
      mt="3px">
        <Nav to="#">
          <Flex justifyContent="space-between" w="360px">
            <Flex>
              <Box>
          <Img src={Spherium} alt="Spherium" mt="10px" />
        </Box>
        <Box ml="20px">
        <Text
      fontWeight="700"
      fontSize="16px"
      color="#319EF6"
      >Bridge RGPs on Spherium</Text>
      <Text
      fontWeight="400"
      fontSize="14px"
      color="#51627B"
      mt="3px"
      >Bridge via hyperbridge.</Text>
        </Box>
            </Flex>
          <Box>
          <ArrowForwardIcon fontSize="24px" mt="15px"  color="white"/>
          </Box>
          </Flex>
     
          </Nav>
      </MenuItem>
      </Tooltip>
       <Tooltip label={chainId === SupportedChainId.AVALANCHE || chainId=== SupportedChainId.AVALANCHE_FUJI ? "coming soon" :""}  bg="gray.300" color="black">
      <MenuItem _focus={{ color: "#319EF6" }} mt="20px"
       py="10px"
       _hover={{background:`${bg}`,boxShadow:`${boxShadow}`,borderRadius:"6px"}}
      >
        <Nav to={chainId ===43114?"/freeswap":"/bridge/router"}>
          <Flex justifyContent="space-between" w="360px">
  <Flex>
        <Box>
          <Img src={Router} alt="Router" mt="10px" />
        </Box>
        <Box ml="20px">
        <Text
      fontWeight="700"
      fontSize="16px"
      color="#319EF6"
      >Bridge RGPs on Router</Text>
      <Text
      fontWeight="400"
      fontSize="14px"
      color="#51627B"
      mt="3px"
      >Bridge via Router Voyager</Text>
        </Box>
          </Flex>
          <Box>
          <ArrowForwardIcon fontSize="24px" mt="15px"  color="white"/>
          </Box>
          </Flex>
        
     
          </Nav>
      </MenuItem>
      </Tooltip>
      <Divider background="#DEE6ED" mb="10px" mt="20px"/>
      <MenuItem _focus={{ color: "#319EF6" }} display="block">
        <Text fontSize="12px" color="#666" mb="10px" fontWeight="500">SUPPORTED CHAINS:</Text>
        <Flex>
      <Img src={Binance} alt="Binance" _hover={{boxShadow:"0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)"}}/>
      <Img src={Polygon} alt="Polygon" ml="20px" _hover={{boxShadow:"0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)"}}  />
        </Flex>
        
        </MenuItem>
    </MenuList>
  </Menu>
  )
}
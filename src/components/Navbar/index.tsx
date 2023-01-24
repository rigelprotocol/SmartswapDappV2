import React from "react";
import {
  Flex,
  Spacer,
  Box,
  Img,
  Link,
  useColorModeValue,
  useMediaQuery,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import SocialMedia from "./SocialMedia";
import DappsDropdown from "./DappsDropdown";
import WalletConnection from "./WalletConnection";
import { SwapDropdown, BridgeDropdown } from "./SwapDropdown";
import LightLogo from "./../../assets/logo/logo-light.svg";
import DarkLogo from "./../../assets/logo/logo-dark.svg";
// import ChristmasLightLogo from "./../../assets/logo/ChristmasSmartSwapLightLogo.svg";
// import ChristmasDarkLogo from "./../../assets/logo/ChristmasSmartSwapDarkLogo.svg";
import MobileNavDrawer from "./MobileNavDrawer";
import NetworkConnector from "../NetworkConnector";
import EarnDropdown from "./EarnDropdown";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { SupportedChainId } from "../../constants/chains";

export const Nav = ({
  to,
  label,
  active,
  img,
}: {
  to: string;
  label: string;
  active?: boolean;
  img?: any;
}) => {
  const {chainId} = useActiveWeb3React()
  const mobileNavColor = useColorModeValue("#FFFFFF", "#15202B");
  return (
    <Tooltip label={chainId === SupportedChainId.AVALANCHE || chainId=== SupportedChainId.AVALANCHE_FUJI && "coming soon"}  bg="gray.300" color="black">
    <NavLink
      to={to}
      activeStyle={{
        color: "#319EF6",
      }}
      color={active ? "#319EF6" : mobileNavColor}
      style={active ? { color: "#319EF6" } : { color: "" }}
    >
      <Flex>
        {img}{" "}
        <Text ml="8px" fontSize="14px">
          {label}
        </Text>
      </Flex>
    </NavLink>
    </Tooltip>
  );
};

const Index = () => {
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const location = useLocation().pathname;
  // const Logo = useColorModeValue(LightLogo, DarkLogo);
  const Logo = useColorModeValue(LightLogo,DarkLogo);
  const mobileNavColor = useColorModeValue("#FFFFFF", "#15202B");
  const mobileNavBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const { search } = useLocation();
  
  const {chainId} = useActiveWeb3React()

  return (
    <>
      {location === "/" ? null : (
        <Flex px={6} py={2} boxShadow="sm">
          {isMobileDevice ? (
            <>
              <Flex w="100%" justifyContent="space-between" h="10">
                <Box mr={6}>
                  <NavLink to="/">
                    {" "}
                    <Img src={Logo} />
                  </NavLink>
                </Box>
                <MobileNavDrawer />
              </Flex>
              <Flex
                h="70px"
                zIndex="200"
                position="fixed"
                left={0}
                bottom={0}
                justify="space-between"
                alignItems="center"
                borderTop="1px"
                borderColor={mobileNavBorderColor}
                w="100%"
                bgColor={mobileNavColor}
                mr={4}
              >
                <Flex ml={4}>
                  <WalletConnection />
                </Flex>
                <Flex mr={4}>
                  <NetworkConnector />
                  <ColorModeSwitcher />
                  <SocialMedia />
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Flex h="10">
                <Box mr={4}>
                  <NavLink to="/">
                    {" "}
                    <Img src={Logo} />{" "}
                  </NavLink>
                </Box>
                <DappsDropdown />

                <Flex
                  mr="4px"
                  w="400px"
                  h="10"
                  align="center"
                  justify="space-around"
                  fontSize="14px"
                  className="HeaderRide"
                >
                  <SwapDropdown />
                  <BridgeDropdown />
                  <EarnDropdown />
                  {/* <Nav label="Liquidity" to="/pool" active={location === '/add' || location === '/remove' ? true : false} />
                  <Nav label="Farming" to="/farming-v2"  /> */}
                  
                  {/* <Nav label="Farm" to="/farm-v2"  />  */}
                  <Nav label="NFTs" to={chainId ===43114?"/freeswap":`/nft${search}`} />
                  <Nav label="SmartBid" to={chainId ===43114?"/freeswap":`/smartbid${search}`} />
                 
                </Flex>
              </Flex>
              <Spacer />

              <Flex h="8" justify="flex-end">
                <NetworkConnector />
                <Flex h="8" justify="flex-end" className="Wallet">
                  <WalletConnection />
                </Flex>
                <SocialMedia />
                <ColorModeSwitcher />
              </Flex>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default Index;

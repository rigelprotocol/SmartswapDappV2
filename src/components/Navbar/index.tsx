import React from "react";
import {
  Flex,
  Spacer,
  Box,
  Img,
  Text,
  Stack,
  Link,
  Button,
  Image, useColorModeValue
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import SocialMedia from "./SocialMedia";
import DappsDropdown from "./DappsDropdown";
import WalletConnection from "./WalletConnection";
import SwapDropdown from "./SwapDropdown";
import LightLogo from "./../../assets/logo/logo-light.svg";
import DarkLogo from "./../../assets/logo/logo-dark.svg";
import MetamaskLogo from "./../../assets/metamaskLogo.png";

const Nav = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    activeStyle={{
      color: "#319EF6",
    }}
  >
    {label}
  </NavLink>
);

const Index = () => {
  const Logo = useColorModeValue(LightLogo, DarkLogo);
  return (
  <Flex px={6} py={2} boxShadow="sm">
    <Flex h="10">

      <Box mr={6}>
        <Img src={Logo} />
      </Box>
      <DappsDropdown />

      <Flex w="350px" h="10" align="center" justify="space-between">
        <Nav label="Swap" to="/swap" />
        <Nav label="Liquidity" to="/pool" />
        <Nav label="Farming" to="/farming" />
        <Link href="https://rigelprotocol.com" isExternal>
          Analytics <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </Flex>
    <Spacer />

    <Flex h="8" justify="flex-end">
      <WalletConnection />
      <SocialMedia />
      <ColorModeSwitcher />
    </Flex>
  </Flex>
)
};

export default Index;

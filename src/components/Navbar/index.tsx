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
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { IoWalletOutline } from "react-icons/io5";
import { ColorModeSwitcher } from "./../ColorModeSwitcher";
import SocialMedia from "./SocialMedia";
import DappsDropdown from "./DappsDropdown";
import Logo from "./../../assets/logoRGP.png";

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

const index = () => (
  <Flex px={6} py={2} boxShadow="sm">
    <Flex h="10">
      <Img src={Logo} />
      <Box mr={6}>
        <Stack spacing={3}>
          <Text fontSize="lg">Rigel Protocol</Text>
          <Text as="sup" color="brand.100">
            Smartswap
          </Text>
        </Stack>
      </Box>
      <DappsDropdown />

      <Flex w="350px" h="10" align="center" justify="space-between">
        <Nav label="Swap" to="/swap" />
        <Nav label="Liquidity" to="/add" />
        <Nav label="Farming" to="/farming" />
        <Link href="https://rigelprotocol.com" isExternal>
          Analytics <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </Flex>
    <Spacer />

    <Flex h="10" justify="flex-end">
      <Button
        rightIcon={<IoWalletOutline />}
        colorScheme="teal"
        variant="brand"
      >
        Connect Wallet
      </Button>
      <SocialMedia />
      <ColorModeSwitcher />
    </Flex>
  </Flex>
);

export default index;

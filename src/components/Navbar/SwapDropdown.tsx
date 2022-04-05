import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { SupportedChainId } from "../../constants/chains";

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

function SwapDropdown() {
  const location = useLocation();
  const { chainId } = useActiveWeb3React();
  const name = location.pathname;

  const useName = () => {
    console.log(name);
    if (name == '/swap' || name == '/auto-time' || name == '/set-price') {
      console.log(`Correct name is ${name}`);
      return name.substring(1);
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
        textTransform={'capitalize'}
      >
        {useName()}
      </MenuButton>
      <MenuList>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Straight Swap" to="/swap" />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Auto-Time" to={chainId === SupportedChainId.BINANCETEST ? '/auto-time' : '#'} />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Set Price" to={chainId === SupportedChainId.BINANCETEST ? '/set-price' : '#'} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SwapDropdown;
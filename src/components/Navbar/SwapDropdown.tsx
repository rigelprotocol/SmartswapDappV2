import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

function SwapDropdown() {
  return (
    <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        transition="all 0.2s"
        rightIcon={<ChevronDownIcon />}
        fontWeight={200}
        _focus={{color: "#319EF6"}}
      >
        Swap
      </MenuButton>
      <MenuList>
        <MenuItem _focus={{color: "#319EF6"}}>Straight Swap</MenuItem>
        <MenuItem _focus={{color: "#319EF6"}}>Auto-Time</MenuItem>
        <MenuItem _focus={{color: "#319EF6"}}>Set Price</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SwapDropdown;

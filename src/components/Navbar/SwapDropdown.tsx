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
      >
        Swap
      </MenuButton>
      <MenuList>
        <MenuItem>Straight Swap</MenuItem>
        <MenuItem>Auto-Time</MenuItem>
        <MenuItem>Set Price</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SwapDropdown;

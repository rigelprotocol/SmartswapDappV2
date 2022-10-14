import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { SupportedChainId } from "../../constants/chains";
export const Nav = ({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active?: boolean;
}) => {
  const mobileNavColor = useColorModeValue("#FFFFFF", "#15202B");
  const { chainId } = useActiveWeb3React();
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
      {label}
    </NavLink>
    </Tooltip>
  );
};

function EarnDropdown() {
  const location = useLocation();

 
  const name = location.pathname;
  const { search } = useLocation();

  const useName = () => {
    if (name == "/farm" || name == "/pool" || name == "/add") {
      return name === "/add" ? "pool" : name.substring(1).split("-")[0];
    } else {
      return "Farm";
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
        textTransform={"capitalize"}
      >
        {useName()}
      </MenuButton>
      <MenuList>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav
            label="Liquidity"
            to={`/pool${search}`}
            active={name === "/add" || name === "/remove"}
          />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Farm" to={`/farm${search}`} />
        </MenuItem>
        <MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="New LP Farm" to={`/farm/new-farm${search}`} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default EarnDropdown;

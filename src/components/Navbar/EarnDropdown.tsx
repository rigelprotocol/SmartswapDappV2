import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { SupportedChainId } from "../../constants/chains";
export const Nav = ({ to, label, active }: { to: string; label: string, active?:boolean }) => {
    const mobileNavColor = useColorModeValue("#FFFFFF", "#15202B");
    return (
  
    <NavLink
      to={to}
      activeStyle={{
        color: "#319EF6",
      }}
      color={active ? "#319EF6" : mobileNavColor}
      style={active ? {color:"#319EF6"}: {color:""}}
    >
      {label}
    </NavLink>
  )};
  

function EarnDropdown() {
  const location = useLocation();
  
  const { chainId } = useActiveWeb3React();
  const name = location.pathname;

  const useName = () => {
    console.log(name);
    if (name == '/farming-v2' || name == '/pool'  || name == '/add') {
      console.log(`Correct name is ${name}`);
      return name=== "/add" ? "pool" :name.substring(1).split("-")[0];
    } else {
      return 'Farming'
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
<Nav label="Liquidity" to="/pool" active={name === '/add' || name === '/remove' ? true : false} />
 </MenuItem>
<MenuItem _focus={{ color: "#319EF6" }}>
          <Nav label="Farming" to="/farming-v2"  />
 </MenuItem>

</MenuList>
    </Menu>
  );
}

export default EarnDropdown;
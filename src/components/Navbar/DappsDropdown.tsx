import React from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Button,
  IconButton,
  Link,
  Icon,
  useMediaQuery,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { AiOutlineAppstore } from 'react-icons/ai';

function DappsDropdown() {
  return (
    <>
      <>
        <Menu>
          <MenuButton
            mr={16}
            variant="ghost"
            as={Button}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            _hover={{ bg: 'gray.100' }}
            _focus={{ boxShadow: 'outline' }}
            rightIcon={<ChevronDownIcon />}
            leftIcon={<AiOutlineAppstore />}
          >
            DApps
          </MenuButton>
          <MenuList>
            <MenuItem>GiftDapp</MenuItem>
            <MenuItem>Smart Bid</MenuItem>
            <MenuDivider />
            <MenuItem>Margin Trading</MenuItem>
            <MenuItem>Smart swap</MenuItem>
          </MenuList>
        </Menu>
      </>
    </>
  );
}

export default DappsDropdown;
import React from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  IconButton,
} from '@chakra-ui/react';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';

const SocialMediaLinks = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="md"
        ml={4}
        variant="ghost"
        fontSize="lg"
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.100' }}
        _focus={{ boxShadow: 'outline' }}
        icon={<IoEllipsisHorizontalOutline />}
      />
      <MenuList>
        <a
          target="_blank"
          href="https://www.linkedin.com/company/rigelprotocol"
        >
          <MenuItem>Linkedin</MenuItem>
        </a>

        <a target="_blank" href="https://medium.com/rigelprotocol">
          <MenuItem>Medium</MenuItem>
        </a>
        <MenuDivider />
        <a target="_blank" href="https://www.t.me/rigelprotocol">
          <MenuItem>Telegram</MenuItem>
        </a>
        <a target="_blank" href="https://twitter.com/rigelprotocol">
          <MenuItem>Twitter</MenuItem>
        </a>
        <MenuDivider />
        <a target="_blank" href="https://github.com/rigelprotocol">
          <MenuItem>Github</MenuItem>
        </a>
        <a target="_blank" href="https://discord.gg/j86NH95GDD">
          <MenuItem>Discord</MenuItem>
        </a>
      </MenuList>
    </Menu>
  );
};

export default SocialMediaLinks;

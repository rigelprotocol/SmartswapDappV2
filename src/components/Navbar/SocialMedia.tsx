import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { GSocialMedia } from '../G-analytics/gIndex';

const SocialMediaLinks = () => {
  const [show, setShow] = useState(false);
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
          href="https://www.linkedin.com/company/rigelprotocol" rel="noreferrer"
        >
          <MenuItem>Linkedin</MenuItem>
        </a>

        <a target="_blank" href="https://medium.com/rigelprotocol" rel="noreferrer">
          <MenuItem onClick={()=>GSocialMedia("Medium")}>Medium</MenuItem>
        </a>
        <MenuDivider />
        <a target="_blank" href="https://www.t.me/rigelprotocol" rel="noreferrer">
          <MenuItem onClick={()=>GSocialMedia("Telegram")}>Telegram</MenuItem>
        </a>
        <a target="_blank" href="https://twitter.com/rigelprotocol" rel="noreferrer">
          <MenuItem onClick={()=>GSocialMedia("Twitter")}>Twitter</MenuItem>
        </a>
        <MenuDivider />
        <a target="_blank" href="https://github.com/rigelprotocol" rel="noreferrer">
          <MenuItem onClick={()=>GSocialMedia("Github")}>Github</MenuItem>
        </a>
        <a target="_blank" href="https://discord.gg/j86NH95GDD" rel="noreferrer">
          <MenuItem onClick={()=>GSocialMedia("Discord")}>Discord</MenuItem>
        </a>
      </MenuList>
    </Menu>
  );
};

export default SocialMediaLinks;

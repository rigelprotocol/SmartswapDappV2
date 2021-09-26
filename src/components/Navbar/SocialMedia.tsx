import { Box, Flex, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import Telegram from "../../assets/social/telegram.svg";
import Twitter from "../../assets/social/twitter.svg";
import Facebook from "../../assets/social/facebook.svg";
import LinkedIn from "../../assets/social/linkedin.svg";
import Github from "../../assets/social/github.svg";
import Medium from "../../assets/social/medium.svg";

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
        _hover={{ bg: "gray.100" }}
        _focus={{ boxShadow: "outline" }}
        icon={<IoEllipsisHorizontalOutline />}
      />
      <MenuList>
        <MenuItem>Facebook</MenuItem>
        <MenuItem>Medium</MenuItem>
        <MenuDivider />
        <MenuItem>Telegram</MenuItem>
        <MenuItem>Twitter</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SocialMediaLinks;

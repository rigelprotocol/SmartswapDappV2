import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Button,
  Badge,
  Text,
  Link,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { AiOutlineAppstore } from "react-icons/ai";

function DappsDropdown() {
  return (
    <>
      <>
        <Menu>
          <MenuButton
            mr={1}
            variant="ghost"
            as={Button}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            _hover={{ bg: "gray.100" }}
            _focus={{ boxShadow: "outline" }}
            rightIcon={<ChevronDownIcon />}
            leftIcon={<AiOutlineAppstore />}
            fontSize="14px"
          >
            DApps
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link href="https://gift.rigelprotocol.com/" isExternal>
                <Text>
                  GiftDapp
                  <ExternalLinkIcon mx="2px" />
                </Text>
              </Link>
            </MenuItem>
            <MenuItem>
              <Text>
                Smart Bid <Badge>Soon</Badge>
              </Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem>
              <Text>
                Margin Trading <Badge>Soon</Badge>
              </Text>
            </MenuItem>
            <MenuItem>
              <Text>
                Leverage EXchange <Badge>Soon</Badge>
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    </>
  );
}

export default DappsDropdown;

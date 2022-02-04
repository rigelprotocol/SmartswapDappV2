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
  Spacer,
  IconButton,
  Link,
  Icon,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { AiOutlineAppstore } from "react-icons/ai";

function DappsDropdown() {
  return (
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
          className='HeaderDApps'
        >
          DApps
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Stack direction={'column'} spacing={0} >
              <Text>SmartSwap</Text>
              <Text color={'gray.500'}>  Swap tokens directly.</Text>
            </Stack>

          </MenuItem>
          <MenuItem>
            <Link href="https://gift.rigelprotocol.com/" isExternal>
              <Stack direction={'column'} spacing={0} >
                <Text> GiftDApp</Text>
                <Text color={'gray.500'}>  Gift tokens in a fun way.</Text>
              </Stack>
            </Link>
          </MenuItem>
          <MenuItem>

            <Stack direction={'column'} spacing={0} >
              <Text>  Smart Bid </Text>
              <Text color={'gray.500'}>  Bid on tokens.</Text>
            </Stack>


          </MenuItem>
          <MenuItem>

            <Stack direction={'column'} spacing={0} >
              <Text>  Leverage Exchange </Text>
              <Text color={'gray.500'}>  Trade using decentralized tokens.</Text>
            </Stack>

          </MenuItem>
          <MenuItem>
            <Stack direction={'column'} spacing={0} >
              <Text>  LaunchPad </Text>
              <Text color={'gray.500'}>  Join projects hosted on RigelProtocol.</Text>
            </Stack>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default DappsDropdown;

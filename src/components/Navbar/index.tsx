import React from 'react';
import {
  Flex,
  Spacer,
  Box,
  Img,
  Text,
  Stack,
  Link,
  Button,
  Image,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import SocialMedia from './SocialMedia';
import DappsDropdown from './DappsDropdown';
import WalletConnection from './WalletConnection';
import SwapDropdown from './SwapDropdown';
import LightLogo from './../../assets/logo/logo-light.svg';
import DarkLogo from './../../assets/logo/logo-dark.svg';
import MetamaskLogo from './../../assets/metamaskLogo.png';
import MobileNavDrawer from './MobileNavDrawer';

const Nav = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    activeStyle={{
      color: '#319EF6',
    }}
  >
    {label}
  </NavLink>
);

const Index = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const Logo = useColorModeValue(LightLogo, DarkLogo);
  const mobileNavColor = useColorModeValue('#FFFFFF', '#15202B');
  const mobileNavBorderColor = useColorModeValue('#DEE5ED', '#324D68');
  return (
    <Flex px={6} py={2} boxShadow="sm">
      <Flex h="10">
        <Box mr={6}>
          <Img src={Logo} />
        </Box>
        <DappsDropdown />
        <MobileNavDrawer />

        <Flex
          display={isMobileDevice ? 'none' : undefined}
          w="350px"
          h="10"
          align="center"
          justify="space-between"
        >
          <SwapDropdown />
          <Nav label="Liquidity" to="/pool" />
          <Nav label="Farming" to="/farming" />
          <Link href="https://rigelprotocol.com" isExternal>
            Analytics <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
      </Flex>
      <Spacer />

      {isMobileDevice ? (
        <Flex
          h="70px"
          zIndex="2"
          position="fixed"
          left={0}
          bottom={0}
          justify="space-between"
          alignItems="center"
          borderTop="1px"
          borderColor={mobileNavBorderColor}
          w="100%"
          bgColor={mobileNavColor}
          mr={4}
        >
          <Flex ml={4}>
            <WalletConnection />
          </Flex>
          <Flex mr={4}>
            <ColorModeSwitcher />
            <SocialMedia />
          </Flex>
        </Flex>
      ) : (
        <Flex h="8" justify="flex-end">
          <WalletConnection />
          <SocialMedia />
          <ColorModeSwitcher />
        </Flex>
      )}
    </Flex>
  );
};

export default Index;

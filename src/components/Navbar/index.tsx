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
import { useLocation } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import SocialMedia from './SocialMedia';
import DappsDropdown from './DappsDropdown';
import WalletConnection from './WalletConnection';
import SwapDropdown from './SwapDropdown';
import LightLogo from './../../assets/logo/logo-light.svg';
import DarkLogo from './../../assets/logo/logo-dark.svg';
import MetamaskLogo from './../../assets/metamaskLogo.png';
import MobileNavDrawer from './MobileNavDrawer';
import NetworkConnector from '../NetworkConnector';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';

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
  const location = useLocation().pathname;
  console.log(location)
  const Logo = useColorModeValue(LightLogo, DarkLogo);
  const mobileNavColor = useColorModeValue('#FFFFFF', '#15202B');
  const mobileNavBorderColor = useColorModeValue('#DEE5ED', '#324D68');
  const { library } = useActiveWeb3React();
  return (
    <>
    {location==="/" ? null : 
      <Flex px={6} py={2} boxShadow="sm">
      {isMobileDevice ? (
        <>
          <Flex w="100%" justifyContent="space-between" h="10">
            <Box mr={6}>
              <Img src={Logo} />
            </Box>
            <MobileNavDrawer />
          </Flex>
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
              {library && library.provider.isMetaMask && <NetworkConnector />}
              <ColorModeSwitcher />
              <SocialMedia />
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Flex h="10">
            <Box mr={4}>
              <Img src={Logo} />
            </Box>
            <DappsDropdown />

            <Flex
              mr="4px"
              w="400px"
              h="10"
              align="center"
              justify="space-around"
              fontSize="14px"
            >
              <SwapDropdown />
              <Nav label="Liquidity" to="/pool" />
              <Nav label="Farming" to="/farming-v2" />
              <Link href="#">
                Analytics
              </Link>
            </Flex>
          </Flex>
          <Spacer />

          <Flex h="8" justify="flex-end">
            {library && library.provider.isMetaMask && <NetworkConnector />}
            <WalletConnection />
            <SocialMedia />
            <ColorModeSwitcher />
          </Flex>
        </>
      )}
    </Flex>
    }
    </>
    
    
  );
};

export default Index;

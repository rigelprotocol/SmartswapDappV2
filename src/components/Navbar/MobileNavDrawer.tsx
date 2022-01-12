import React from 'react';
import {
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  useColorModeValue,
  Text,
  Link,
  Collapse,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { CloseIcon } from '../../theme/components/Icons';
import { NavLink } from 'react-router-dom';
import useToggle from '../../utils/hooks/useToggle';

const MobileNavDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOn, toggleIsOn] = useToggle();
  const HamburgerIconBorderColor = useColorModeValue('#DEE5ED', '#213345');
  const HamburgerIconColor = useColorModeValue('#333333', '#F1F5F8');
  const SwapBgColor = useColorModeValue('#F2F5F8', '#213345');
  const closeButtonBorder = useColorModeValue('#666666', '#DCE5EF');
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');

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
  return (
    <>
      <Flex
        border="1px"
        borderColor={HamburgerIconBorderColor}
        alignItems="center"
        borderRadius="6px"
        w="40px"
        h="40px"
        justifyContent="center"
        p="18px"
      >
        <HamburgerIcon
          color={HamburgerIconColor}
          onClick={onOpen}
          w="24px"
          h="24px"
        />
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader mt={5}>
            <Flex
              onClick={onClose}
              alignItems="center"
              cursor="pointer"
              justifyContent="center"
              borderRadius="6px"
              w="24px"
              h="24px"
              border="1px"
              borderColor={closeButtonBorder}
            >
              <CloseIcon />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Flex ml={-6}>
              <Flex flexDirection="column">
                <Text ml={6} color="#999999" fontSize="12px" mb={2}>
                  MENU
                </Text>

                <NavLink
                  activeStyle={{
                    color: '#319EF6',
                  }}
                  to="/swap"
                >
                  <Flex
                    mb={2}
                    alignItems="center"
                    w="320px"
                    h="40px"
                    justifyContent="space-between"
                    onClick={toggleIsOn}
                    bgColor={isOn ? SwapBgColor : 'transparent'}
                  >
                    <Flex ml={6}>
                      <Nav label="Swap" to="/swap" />
                    </Flex>
                    {isOn ? (
                      <ChevronUpIcon mr={2} />
                    ) : (
                      <ChevronDownIcon mr={2} />
                    )}
                  </Flex>
                </NavLink>
                <Collapse animateOpacity in={isOn}>
                  <Flex
                    display={isOn ? '' : 'none'}
                    flexDirection="column"
                    ml={10}
                    mb={3}
                  >
                    <Text _hover={{ color: '#319EF6' }} mb={2}>
                      Straight
                    </Text>
                    <Text _focus={{ color: '#319EF6' }} mb={2}>
                      Set Price
                    </Text>
                    <Text _focus={{ color: '#319EF6' }} mb={2}>
                      Auto-Time
                    </Text>
                  </Flex>
                </Collapse>
                <Flex ml={6} mb={3}>
                  <Nav label="Liquidity" to="/pool" />
                </Flex>
                <Flex ml={6} mb={3}>
                  <Nav label="Farming" to="/farming-v2" />
                </Flex>
                <Flex ml={6} mb={3}>
                  <Link href="#" isExternal>
                    Analytics <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex>
                <Text ml={6} color="#999999" mt={5} fontSize="12px" mb={2}>
                  DAPPS
                </Text>
                <Flex mb={3} alignItems="center" ml={6}>
                  <Nav label="SmartSwap" to="/swap" />
                </Flex>
                <Flex ml={6} mb={3}>
                  <Link href="https://gift.rigelprotocol.com/" isExternal>
                    <Text>GiftDApp</Text>
                  </Link>
                </Flex>
                <Flex ml={6} mb={3}>
                  <Text>Smart Bid</Text>
                </Flex>
                <Flex ml={6} mb={3}>
                  <Text>Leverage Exchange</Text>
                </Flex>

                <Flex ml={6} mb={3}>
                  <Text>LaunchPad</Text>
                </Flex>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavDrawer;

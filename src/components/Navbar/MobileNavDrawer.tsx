import React from "react";
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
  MenuItem,
  Img,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import DappIcon from "../../assets/Dapps.svg";
import SwapIcon from "../../assets/swapIcon.svg";
import BridgeIcon from "../../assets/bridgeIcon.svg";
import FarmingIcon from "../../assets/farmingIcon.svg";
import NFTIcon from "../../assets/NFTIcon.svg";
import { CloseIcon } from "../../theme/components/Icons";
import { NavLink, useLocation } from "react-router-dom";
import {Nav} from "./index"
import useToggle from "../../utils/hooks/useToggle";
import { SupportedChainId } from "../../constants/chains";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";

const MobileNavDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOn, toggleIsOn] = useToggle();
  const [isOnFarm, toggleIsOnFarm] = useToggle();
  const [isOnBridge, toggleIsOnBridge] = useToggle();
  const HamburgerIconBorderColor = useColorModeValue("#DEE5ED", "#213345");
  const HamburgerIconColor = useColorModeValue("#333333", "#F1F5F8");
  const SwapBgColor = useColorModeValue("#F2F5F8", "#213345");
  const closeButtonBorder = useColorModeValue("#666666", "#DCE5EF");
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");

  const { chainId } = useActiveWeb3React();
  const location = useLocation().pathname;
  
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
          cursor={"pointer"}
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
                    color: "#319EF6",
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
                    bgColor={isOn ? SwapBgColor : "transparent"}
                  >
                    <Flex ml={6}>
                      <Nav label="Swap" to="/swap" img={<Img src={SwapIcon} />} />
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
                    display={isOn ? "" : "none"}
                    flexDirection="column"
                    ml={10}
                    mb={3}
                  >
                    <Text
                      _hover={{ color: "#319EF6" }}
                      mb={2}
                      onClick={onClose}
                    >
                      <Nav label="Straight Swap" to="/swap" />
                    </Text>
                    <Text
                      _hover={{ color: "#319EF6" }}
                      mb={2}
                      onClick={onClose}
                    >
                      <Nav
                        label="auto-period"
                        to={
                          chainId === SupportedChainId.BINANCETEST ? "/auto-period" : "#"
                        }
                      />
                    </Text>
                    <Text
                      _hover={{ color: "#319EF6" }}
                      mb={2}
                      onClick={onClose}
                    >
                      <Nav
                        label="Set Price"
                        to={
                          chainId === SupportedChainId.BINANCETEST ? "/set-price" : "#"
                        }
                      />
                    </Text>
                  </Flex>
                </Collapse>

                <NavLink
                  activeStyle={{
                    color: "#319EF6",
                  }}
                  to="/farming-v2"
                >
                  <Flex
                    mb={2}
                    alignItems="center"
                    w="320px"
                    h="40px"
                    justifyContent="space-between"
                    onClick={toggleIsOnFarm}
                    bgColor={isOnFarm ? SwapBgColor : "transparent"}
                  >
                    <Flex ml={6}>
                      <Nav label="Farming" to="/swap" img={<Img src={FarmingIcon} />} />
                    </Flex>
                    {isOnFarm ? (
                      <ChevronUpIcon mr={2} />
                    ) : (
                      <ChevronDownIcon mr={2} />
                    )}
                  </Flex>
                </NavLink>
                <Collapse animateOpacity in={isOnFarm}>
                  <Flex
                    display={isOnFarm ? "" : "none"}
                    flexDirection="column"
                    ml={10}
                    mb={3}
                  >
                          <Flex ml={6} mb={3} onClick={onClose}>
                  <Nav label="Liquidity" to="/pool" active={location === '/add' || location === '/remove' ? true : false} />
                </Flex>
                <Flex ml={6} mb={3} onClick={onClose}>
                  <Nav label="Farming" to="/farming-v2" />
                </Flex>
                  </Flex>
                </Collapse>

                <NavLink
                  activeStyle={{
                    color: "#319EF6",
                  }}
                  to="/bridge/spherium"
                >
                  <Flex
                    mb={2}
                    alignItems="center"
                    w="320px"
                    h="40px"
                    justifyContent="space-between"
                    onClick={toggleIsOnBridge}
                    bgColor={isOnBridge ? SwapBgColor : "transparent"}
                  >
                    <Flex ml={6}>
                      <Nav label="Bridge" to="/bridge/spherium" img={<Img src={BridgeIcon} />} />
                    </Flex>
                    {isOnBridge ? (
                      <ChevronUpIcon mr={2} />
                    ) : (
                      <ChevronDownIcon mr={2} />
                    )}
                  </Flex>
                </NavLink>
                <Collapse animateOpacity in={isOnBridge}>
                  <Flex
                    display={isOnBridge ? "" : "none"}
                    flexDirection="column"
                    ml={10}
                    mb={3}
                  >
                          <Flex ml={6} mb={3} onClick={onClose}>
                  <Nav label="Bridge RGPs on Spherium" to="/bridge/spherium" />
                </Flex>
                <Flex ml={6} mb={3} onClick={onClose}>
                  <Nav label="Bridge RGPs on Router" to="/bridge/router" />
                </Flex>
                  </Flex>
                </Collapse>


                <Flex ml={6} mb={3} onClick={onClose}>
                  <Nav label="NFTs" to="/nft" img={<Img src={NFTIcon} />} />
                </Flex>
                {/* <Flex ml={6} mb={3}>
                  <Link href="#" isExternal onClick={onClose}>
                    Analytics <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex> */}
                <Flex ml={6} color="#999999" mt={5} fontSize="16px" mb={2}>
                <Img src={DappIcon} mr={4}/>  DAPPS
                </Flex>
                <Flex ml={6} mb={3}>
                  <Link href="/swap">
                      <Text>SmartSwap</Text>
                  </Link>
                </Flex>
                <Flex ml={6} mb={3}>
                  <Link href="https://giftdapp.rigelprotocol.com/" isExternal>
                    <Text>GiftDApp</Text>
                  </Link>
                </Flex>
                <Flex ml={6} mb={3}>
                <Link href="https://smartswap.rigelprotocol.com/smartbid?chain=bsc_test">
                  <Text>Smart Bid</Text>
                  </Link>
                </Flex>
                {/* <Flex ml={6} mb={3}>
                  <Text> Leverage Exchange</Text>
                </Flex> */}

                <Flex ml={6} mb={3}>
                <Link href="https://launchpad.rigelprotocol.com/" isExternal>
                  <Text>LaunchPad</Text>
                  </Link>
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

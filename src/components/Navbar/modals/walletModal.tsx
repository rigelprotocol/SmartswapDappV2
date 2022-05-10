import React, { useState } from "react"
import {
  ModalOverlay,
  ModalContent,
  Modal,
  ModalCloseButton,
  ModalHeader,
  useColorModeValue,
  Box,
  Flex,
  Text,
  Button,
  useClipboard,
  Tooltip,
  IconButton,
  Link,
  Image,
} from "@chakra-ui/react"
import { shortenAddress } from "../../../utils";
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink'
import { CopyIcon } from "../../../theme/components/Icons";
import StatusIcon from "../StatusIcon";
import { useWeb3React } from "@web3-react/core";
import NetworkModal from "./networkModal";
import ROUTESQUARELIGHT from '../../../assets/routesquare-light.svg';
import ROUTESQUAREDARK from '../../../assets/routesquare-dark.svg';
import useAuth from "../../../utils/hooks/useAuth";
import { GDisconnectWallet, GSwitchWallet } from "../../G-analytics/gIndex";



export type IModal = {
  displayWallet: boolean,
  accounts: string,
  setDisplayWallet: React.Dispatch<React.SetStateAction<boolean>>
}

const WalletModal: React.FC<IModal> = ({
  displayWallet,
  accounts,
  setDisplayWallet
}) => {
  const bgColor = useColorModeValue("#FFF", "#15202B");
  const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
  const borderColor = useColorModeValue("#DEE6ED", "#324D68");
  const dashedColor = useColorModeValue("#DEE6ED", "#4A739B");
  const activeButtonColor = useColorModeValue("#319EF6", "#4CAFFF");
  const buttonColor = useColorModeValue("#666666", "#7599BD");
  const routeSquareIcon = useColorModeValue(ROUTESQUARELIGHT, ROUTESQUAREDARK);
  const { chainId, connector } = useWeb3React();
  const [displayNetwork, setDisplayNetwork] = useState(false);
  const { hasCopied, onCopy } = useClipboard(accounts);
  const { logout } = useAuth();

  const disconnectWallet = () => {
    GDisconnectWallet()
    logout();
  };
  return (
    <>
      <Modal isCentered isOpen={displayWallet} onClose={() => setDisplayWallet(false)}>
        <ModalOverlay />
        <ModalContent
          width="95vw"
          borderRadius="6px"
          paddingBottom="20px"
          bgColor={bgColor}
          minHeight="40vh"
        >
          <ModalHeader
            fontSize="24px"
            fontWeight="regular"
          >Wallet</ModalHeader>
          <ModalCloseButton
            bg="none"
            size={'sm'}
            mt={3}
            mr={3}
            cursor="pointer"
            _focus={{ outline: 'none' }}
            onClick={() => setDisplayWallet(false)}
            p={'7px'}
            border={'1px solid'}

          />
          <Box
            width="90%"
            margin="0 auto"
            fontSize="14px"
          >
            <Flex
              border={`1px solid ${borderColor}`}
              borderRadius="6px"
              padding="4px 0"
              justifyContent="space-between"
            >
              <Button
                variant={'ghost'}
                leftIcon={
                  <StatusIcon connector={connector} />
                }
              >
                {shortenAddress(accounts)}
              </Button>
              <Tooltip hasArrow label={hasCopied ? "Copied!" : "Copy"} bg="gray.300" color="black">
                <IconButton onClick={onCopy} aria-label="Copy address" icon={<CopyIcon />} colorScheme="ghost" />
              </Tooltip>
            </Flex>
            <Box mt="4" fontSize="16px" color={lightTextColor}>
              <Link href={getExplorerLink(chainId as number, accounts, ExplorerDataType.ADDRESS)} isExternal>
                <Box display="flex">
                  <Image mr={1} h="24px" w="24px" src={routeSquareIcon} />
                  <Text>
                    View on
                    {
                      chainId === 3 || chainId === 4 || chainId === 5 || chainId === 6
                        ? (" Etherscan")
                        : chainId === 56 || chainId === 97
                          ? (" Bscscan")
                          : chainId === 137 || chainId === 80001
                            ? (" Polygonscan")
                            : (" Explorer")
                    }
                  </Text>
                </Box>
              </Link>
            </Box>
            <Box>
              <Flex
                justifyContent="space-between"
                my="6">
                <Button
                  background="transparent"
                  border={`1px solid ${activeButtonColor}`}
                  box-sizing="border-box"
                  box-shadow="0px 1px 7px rgba(41, 45, 50, 0.08)"
                  border-radius="6px"
                  padding="23px 0"
                  color={activeButtonColor}
                  isFullWidth
                  _hover={{ background: `${activeButtonColor}`, color: "#fff" }}
                  onClick={() => {
                    GSwitchWallet()
                    setDisplayNetwork(state => !state)}}
                >
                  Switch Wallet
                </Button>
                <NetworkModal displayNetwork={displayNetwork} setDisplayNetwork={setDisplayNetwork} />
                <Button
                  border={`1px solid ${buttonColor}`}
                  box-sizing="border-box"
                  box-shadow="0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)"
                  border-radius="6px"
                  padding="23px 0"
                  color={buttonColor}
                  _hover={{ background: `${buttonColor}`, color: "#fff" }}
                  isFullWidth
                  ml="4"
                  background="transparent"
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </Button>
              </Flex>
            </Box>
            <Box padding="15px" border={`1px dashed ${dashedColor}`} borderRadius="6px" fontSize="16px" mt="9">
              <Text color={lightTextColor} mb="6" textAlign="center">Your recent transactions will appear here</Text>
            </Box>
          </Box>

        </ModalContent>
      </Modal>
    </>
  )
};

export default WalletModal

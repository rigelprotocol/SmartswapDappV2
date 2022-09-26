import React, { useState, useCallback, useMemo, useEffect } from "react";
// import { Token } from "@uniswap/sdk"
import {
  ModalOverlay,
  ModalContent,
  Modal,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  useColorModeValue,
  Box,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import ModalInput from "./input";
import Manage from "./Manage";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import CurrencyList from "./CurrencyList";
import { Token, Currency, NativeCurrency } from "@uniswap/sdk-core";
import useDebounce from "../../hooks/useDebounce";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import {
  useAllTokens,
  ExtendedEther,
  useToken,
  useIsUserAddedToken,
} from "../../hooks/Tokens";
import {
  DEFAULT_LIST_OF_LISTS,
  CMC,
  MAIN_LIST,
} from "../../utils/constants/lists";
import { isAddress } from "../../utils";
import { filterTokens } from "./filtering";
import ImportRow from "./ImportRow";
import NewToken from "./newToken";
import {
  useTokenBalance,
  useUpdateBalance,
} from "../../utils/hooks/useUpdateBalances";
import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { SupportedChainId } from "../../constants/chains";
import { connectorKey } from "../../connectors";

type IModal = {
  tokenModal: boolean;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCurrencySelect: (currency: Currency) => void;
  selectedCurrency?: Currency | null;
  otherSelectedCurrency?: Currency | null;
};

const SelectToken: React.FC<IModal> = ({
  tokenModal,
  setTokenModal,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
}) => {
  const { chainId, account, library } = useActiveWeb3React();
  const [openNewTokenModal, setOpenNewTokenModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const bgColor = useColorModeValue("#FFF", "#15202B");
  const boxShadow = useColorModeValue("#DEE6ED", "#324D68");
  const textColor = useColorModeValue("#319EF6", "#4CAFFF");
  const boxColor = useColorModeValue("#F2F5F8", "#213345");

  const [inactiveList, setInactiveList] = useState([]);
  const walletType = localStorage.getItem(connectorKey);

  useEffect(() => {
    setSearchQuery("");
  }, [tokenModal]);

  const bsc = Number(chainId) === Number(SupportedChainId.BINANCE);
  const polygon = Number(chainId) === Number(SupportedChainId.POLYGON);

  const [displayManageToken, setDisplayManageToken] = useState(false);
  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
    },
    [onCurrencySelect]
  );

  const getTokens = async () => {
    setInactiveList([]);
    if (bsc) {
      try {
        const tokenList = await fetch(CMC);
        const filtered = await tokenList.json();
        setInactiveList(filtered.tokens);
      } catch (e) {
        console.log("Wrong Network");
      }
    } else if (polygon) {
      try {
        const tokenList = await fetch(MAIN_LIST);
        const filtered = await tokenList.json();
        const poly = filtered.tokens.filter(
          (token) => token.chainId === SupportedChainId.POLYGON
        );
        setInactiveList(poly);
      } catch (e) {
        console.error("Polygon network not working");
      }
    }
  };

  useEffect(() => {
    getTokens();
  }, [chainId]);

  const allTokens = useAllTokens();
  // useUpdateBalance("");
  // useUpdateTokenList()
  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);
  const [Balance, Symbol, Name, Logo] = useNativeBalance();
  const ether = chainId && ExtendedEther(chainId, Symbol, Name, Logo);
  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);

  const searchNewTokens = useMemo(() => {
    return inactiveList
      .filter((token) => token.name.toLowerCase().includes(debouncedQuery))
      .slice(0, 10);
  }, [inactiveList, debouncedQuery]);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const filteredTokenListWithETH = useMemo((): Currency[] => {
    const s = debouncedQuery.toLowerCase().trim();
    if (s === "" || s === "e" || s === "et" || s === "eth") {
      return ether ? [ether, ...filteredTokens] : filteredTokens;
    }
    return filteredTokens;
  }, [debouncedQuery, ether, filteredTokens, ChainId]);
  const { onClose } = useDisclosure();
  const openManageToken = (): void => {
    setDisplayManageToken((state) => !state);
  };
  // refs for fixed size lists
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);
  const [isSearchingForToken, setIsSearchingForToken] = useState(false);
  useEffect(() => {
    if (!searchToken && !(filteredTokenListWithETH?.length > 0)) {
      setIsSearchingForToken(true);
    } else if (!chainId) {
      setIsSearchingForToken(false);
    } else {
      setIsSearchingForToken(false);
    }
  }, [searchToken, filteredTokenListWithETH, debouncedQuery]);

  const { sortedTokenList } = useUpdateBalance("");

  const newImportToken = useSelector<RootState>(
    (state) => state.lists.importedToken
  );

  return (
    <>
      <Modal
        isOpen={tokenModal}
        onClose={() => setTokenModal(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width="95vw"
          borderRadius="6px"
          bgColor={bgColor}
          minHeight="40vh"
        >
          <ModalHeader fontSize="18px" fontWeight="regular">
            Select a token
          </ModalHeader>
          <ModalCloseButton
            bg="none"
            size={"sm"}
            mt={3}
            mr={3}
            cursor="pointer"
            _focus={{ outline: "none" }}
            p={"7px"}
            border="1px solid"
          />

          <Box
            width="100%"
            fontSize="14px"
            boxShadow={`0px 1px 0px ${boxShadow}`}
          >
            <Box width="90%" margin="0 auto" pb="5">
              <ModalInput
                placeholder="Search name or paste address"
                searchQuery={searchQuery}
                changeInput={handleInput}
              />
            </Box>
          </Box>
          <ModalBody maxHeight="60vh" overflowY="scroll" p={0}>
            {!account || walletType === "bsc" ? (
              <Box>
                {filteredTokenListWithETH.map((currency, index) => (
                  <CurrencyList
                    onCurrencySelect={handleCurrencySelect}
                    key={index}
                    currency={currency}
                    selectedCurrency={selectedCurrency}
                    otherSelectedCurrency={otherSelectedCurrency}
                  />
                ))}
              </Box>
            ) : isSearchingForToken ? (
              <Box>
                <Text textAlign="center" py="7">
                  {inactiveList.length > 0
                    ? "Expanded from Inactive List"
                    : "No tokens found."}
                </Text>
                {searchNewTokens.map((token, index) => (
                  <ImportRow
                    key={index}
                    token={token}
                    openNewTokenModal={setOpenNewTokenModal}
                  />
                ))}
              </Box>
            ) : searchToken && !searchTokenIsAdded ? (
              <Box>
                <ImportRow
                  token={searchToken}
                  openNewTokenModal={setOpenNewTokenModal}
                />
              </Box>
            ) : searchQuery !== "" ? (
              <Box>
                {filteredTokenListWithETH.map((currency, index) => (
                  <CurrencyList
                    onCurrencySelect={handleCurrencySelect}
                    key={index}
                    currency={currency}
                    selectedCurrency={selectedCurrency}
                    otherSelectedCurrency={otherSelectedCurrency}
                  />
                ))}
                <Box>
                  {inactiveList.length > 0 && (
                    <Box>
                      <Text textAlign="center" py="7">
                        Expanded from Inactive List
                      </Text>
                      {searchNewTokens.map((token) => (
                        <ImportRow
                          token={token}
                          openNewTokenModal={setOpenNewTokenModal}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ) : sortedTokenList?.length === 0 ? (
              <Flex py={4} justifyContent={"center"} alignItems={"center"}>
                <Spinner color="#319EF6" size="md" />
              </Flex>
            ) : sortedTokenList?.length > 0 ? (
              sortedTokenList.map((currency, index) => {
                return (
                  <CurrencyList
                    onCurrencySelect={handleCurrencySelect}
                    key={index}
                    currency={currency[0]}
                    selectedCurrency={selectedCurrency}
                    otherSelectedCurrency={otherSelectedCurrency}
                  />
                );
              })
            ) : (
              <Text textAlign="center" py="7">
                No Result found...
              </Text>
            )}
          </ModalBody>

          <ModalFooter py="4" bg={boxColor} borderRadius="6px">
            <Box w="100%" textAlign="center">
              <Text
                fontSize="16px"
                color={textColor}
                cursor="pointer"
                onClick={() => openManageToken()}
              >
                Manage Tokens
              </Text>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Manage
        open={displayManageToken}
        setDisplayManageToken={setDisplayManageToken}
        setOpenNewTokenModal={setOpenNewTokenModal}
        openNewTokenModal={openNewTokenModal}
        handleCurrencySelect={handleCurrencySelect}
      />
      {(searchToken && openNewTokenModal) ||
      (searchNewTokens && openNewTokenModal) ? (
        <NewToken
          open={openNewTokenModal}
          handleCurrencySelect={handleCurrencySelect}
          setDisplayImportedToken={setOpenNewTokenModal}
          tokens={searchToken ? [searchToken] : [newImportToken]}
        />
      ) : null}
    </>
  );
};

export default SelectToken;

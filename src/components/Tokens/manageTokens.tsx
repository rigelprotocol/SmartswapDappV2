import React, { useState, Dispatch, useMemo, useCallback } from 'react';
import {
  useColorModeValue,
  Box,
  Flex,
  Text,
  Link
} from '@chakra-ui/react';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import ModalInput from './input';
import { useToken } from '../../hooks/Tokens';
import { useUserAddedTokens, useRemoveUserAddedToken } from '../../state/user/hooks';
import { Token } from '@uniswap/sdk-core';
import { isAddress } from '../../utils';
import ImportRow from './ImportRow';
import NewToken from './newToken';
import CurrencyLogo from '../currencyLogo';
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ExternalLinkIcon, CloseIcon } from "../../theme/components/Icons"
type IModal = {
  setOpenNewTokenModal: Dispatch<React.SetStateAction<boolean>>
  openNewTokenModal: boolean
  handleCurrencySelect?: (currency: Token) => void
};

const ManageToken: React.FC<IModal> = ({
  setOpenNewTokenModal,
  openNewTokenModal,
  handleCurrencySelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleInput = (e: any) => {
    const input = e.target.value;
    setSearchQuery(input);
  };
  const { chainId } = useActiveWeb3React()
  const isAddressValid = searchQuery === '' || isAddress(searchQuery)
  // if they input an address, use it
  const searchToken = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()


  const tokenList = useMemo(() => {
    return (
      chainId && userAddedTokens.map(token => (
        <Flex key={token.address} my="4" justifyContent="space-between">
          <Flex justifyContent="space-between">
            <CurrencyLogo currency={token} size={24} />
            <Link isExternal href={getExplorerLink(chainId as number, token.address, ExplorerDataType.ADDRESS)} ml="10px">
              {token.symbol}
            </Link>
          </Flex>
          <Flex>
            <Box ml={1} cursor="pointer" onClick={() => {
              setSearchQuery("")
              removeToken(chainId, token.address)
            }}>
              <CloseIcon />
            </Box>

            <Link href={getExplorerLink(chainId as number, token.address, ExplorerDataType.ADDRESS)} ml={3} isExternal>
              <ExternalLinkIcon size="21px" />
            </Link>
          </Flex>
        </Flex>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])


  return (
    <>
      <Box pb="2" pt="3">
        <ModalInput
          placeholder="0x0000"
          searchQuery={searchQuery}
          changeInput={handleInput}
        />
      </Box>
      {!isAddressValid && <Text color="red.400">Enter valid token address</Text>}
      {searchToken && (
        <ImportRow
          token={searchToken}
          openNewTokenModal={setOpenNewTokenModal}
        />
      )}

      {tokenList}
      <Box>
        <Text py="4">
          {userAddedTokens?.length} {userAddedTokens.length === 1 ? 'Custom Token' : 'Custom Tokens'}
        </Text>
      </Box>

      {searchToken && openNewTokenModal ?
        <NewToken
          open={openNewTokenModal}
          handleCurrencySelect={handleCurrencySelect}
          setDisplayImportedToken={setOpenNewTokenModal}
          tokens={[searchToken]}
        /> : null
      }
    </>
  );
};

export default ManageToken;

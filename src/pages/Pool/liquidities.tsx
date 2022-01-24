import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Img,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import BNBImage from '../../assets/BNB.svg';
import RGPImage from '../../assets/rgp.svg';
import ETHImage from '../../assets/eth.svg';
import NullImage from '../../assets/Null-24.svg';
import BUSDImage from '../../assets/busd.svg';
import LiquidityDetails from './liquidityDetails';
import CurrencyLogo from '../../components/currencyLogo';
import MATICIMAGE from '../../assets/Matic.svg';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import { isAddress } from '../../utils';
import { Token } from '@uniswap/sdk-core';

const Liquidities = (props: Liquidity) => {
  const [showDetails, setShowDetails] = useState(false);
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const liquidityPositionBgColor = useColorModeValue('#F2F5F8', '#213345');
  const textColor = useColorModeValue('#333333', '#F1F5F8');
  const manageColor = useColorModeValue('#666666', '#DCE5EF');
  const {chainId} = useActiveWeb3React()
  return (
    <>
      <Flex
        color={textColor}
        bg={liquidityPositionBgColor}
        border="1px"
        borderColor={borderColor}
        px={4}
        py={4}
        mx={5}
        borderRadius="6px"
        flexDirection="column"
        my={3}
        h={!showDetails ? '' : '300px'}
      >
        <Flex justifyContent="space-between">
          <Flex>
            {/* {
              console.log(props.pair.path[0])
            } */}
          <CurrencyLogo currency={{...props.pair.path[0],
          chainId,
          address:isAddress(props.pair.path[0].fromPath) ,
          isToken: isAddress(props.pair.path[0]?.fromPath) ? true: false,
          isNative: isAddress(props.pair.path[0]?.fromPath) ? false: true,
          symbol: props.pair.path[0]?.token
          }} size={24} squared={true}/>
          <CurrencyLogo currency={{...props.pair.path[1],
          chainId,
          address:isAddress(props.pair.path[1].toPath) ,
          isToken: isAddress(props.pair.path[1]?.toPath) ? true: false,
          isNative: isAddress(props.pair.path[1]?.toPath) ? false: true,
          symbol: props.pair.path[1]?.token
          }} size={24} squared={true}/>
            {/* <Box>
              {props.pair.path[0].token === 'RGP' ? (
                <Img src={RGPImage} />
              ) : props.pair.path[0].token === 'BUSD' ? (
                <Img src={BUSDImage} />
              ) : props.pair.path[0].token === 'WETH' ? (
                <Img src={ETHImage} />
              ) : props.pair.path[0].token === 'WBNB' ? (
                <Img src={BNBImage} />
              ) : props.pair.path[0].token === 'WMATIC' ? (
                <Img w="24px" h="24px" src={MATICIMAGE} />
              ) : (
                <Img src={NullImage} />
              )}{' '}
            </Box>
            <Box>
              {props.pair.path[1].token === 'RGP' ? (
                <Img src={RGPImage} />
              ) : props.pair.path[1].token === 'BUSD' ? (
                <Img src={BUSDImage} />
              ) : props.pair.path[1].token === 'WBNB' ? (
                <Img src={BNBImage} />
              ) : props.pair.path[1].token === 'WETH' ? (
                <Img src={ETHImage} />
              ) : props.pair.path[1].token === 'WMATIC' ? (
                <Img w="24px" h="24px" src={MATICIMAGE} />
              ) : (
                <Img src={NullImage} />
              )}{' '}
            </Box>*/}
            <Box ml={3}>
              {props.pair.path[0].token == 'WBNB'
                ? 'BNB'
                : props.pair.path[0].token == 'WETH'
                ? 'ETH'
                : props.pair.path[0].token == 'WMATIC'
                ? 'MATIC'
                : props.pair.path[0].token}{' '}
              /{' '}
              {props.pair.path[1].token == 'WBNB'
                ? 'BNB'
                : props.pair.path[1].token == 'WETH'
                ? 'ETH'
                : props.pair.path[1].token == 'WMATIC'
                ? 'MATIC'
                : props.pair.path[1].token}
            </Box> 
          </Flex>
          <Flex align="center" 
              onClick={() => {
                setShowDetails(!showDetails);
              }}
              cursor="pointer">
            <Text mr={1} color={manageColor} fontSize="14px">
              Manage
            </Text>
            <ChevronDownIcon
              h={4}
              w={4}
            />
          </Flex>
        </Flex>

        {showDetails ? (
          <Flex mt={3} justifyContent="center">
            <LiquidityDetails pair={props.pair} />
          </Flex>
        ) : (
          <div />
        )}
      </Flex>
    </>
  );
};

interface Liquidity {
  pair: any; //Pair
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: any; //CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export default Liquidities;

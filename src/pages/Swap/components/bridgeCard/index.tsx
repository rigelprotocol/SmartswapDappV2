import React, {useState, useCallback} from 'react';
import { Box, Flex, Text, Img, Link, useColorModeValue } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import MATICLOGO from '../../../../assets/Matic.svg';
import { useActiveWeb3React } from '../../../../utils/hooks/useActiveWeb3React';

const BridgeCard = () => {
  const backgroundColor = useColorModeValue('#DCD9FA', '#1F1933');
  const textColor = useColorModeValue('#8247E5', '#A479EC');
  const { chainId } = useActiveWeb3React();

  return (
    <>
      { chainId === 137 || chainId === 80001 ? (
      <Box
        mt={5}
        h="86px"
        pt={4}
        px={4}
        fontWeight="400"
        borderRadius="6px"
        backgroundColor={backgroundColor}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Img w="28px" h="28px" src={MATICLOGO} />
          <Box>
            <Text fontWeight="normal" fontSize="16px" color={textColor}>
              Polygon Token Bridge
            </Text>
            <Text fontWeight="normal" fontSize="14px" color={textColor}>
              Deposit tokens to the polygon network.
            </Text>
          </Box>
          <Link href='https://wallet.polygon.technology/bridge' isExternal>
            <ExternalLinkIcon w="28px" color={textColor} padding="2px" mb={3} h="28px" />
          </Link>
        </Flex>
      </Box>
    ):<Box/>}
  </>
  );
};

export default BridgeCard;

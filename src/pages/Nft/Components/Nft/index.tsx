import React, { useState } from 'react'
import {
    Box,
    Text,
    Button,
    useColorModeValue,
    Image,
    Flex, Spinner
  } from '@chakra-ui/react';
import ComfirmPurchase from '../../Modals/ComfirmPurchase';
import { Link } from 'react-router-dom';
import { useNft, useNftName} from "../../../../hooks/useNFT";

type NftProps = {
    nftName: string,
    image: string,
    isFeatured?: boolean,
    id: number,
    priceUSD?: number,
    priceRGP?: number,
    number?: string
};


export const Nft = function ({ nftName, image, number, id, priceUSD, priceRGP, isFeatured = false }: NftProps) {

  const textColor = useColorModeValue("#333333", "#F1F5F8");
  const lightTextColor = useColorModeValue("#666666", "grey");
  const [ purchaseModal,setOpenPerchaseModal] = useState(false);

  const { firstToken, secondToken ,prices, unsoldItems , nftId} = useNft(id);

  const {name, nftImage, loading} = useNftName(nftId[0]);
   
  return (
         <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          borderColor={'#DEE5ED'}
          position="relative"
          >
            <Box p={2.5} height={'300px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                {loading ? <Spinner speed="0.65s" color="#333333" /> :
                    <Image
                        src={nftImage}
                        alt={`Picture`}
                        roundedTop="lg"
                        boxSize={'100%'}
                        rounded="lg"
                    />
                }
            </Box>
          <Box p="3">
            <Box d="flex" alignItems="baseline">
            <Text
            py={2} 
            color={textColor}
              >
                {name}
              </Text>
            </Box>
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text textColor={lightTextColor}>Sold:</Text>
              <Text  color={textColor}>{unsoldItems - nftId[0]} of {nftId.length}</Text>
            </Flex>
  
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text textColor={lightTextColor}>Price:</Text>
              <Text  color={textColor}>{prices.secondTokenPrice} USD</Text>
            </Flex>
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text/>
              <Text textColor={lightTextColor} >≈ {(100.54 * parseFloat(prices.firstTokenPrice)).toFixed(2)} RGP</Text>
            </Flex>
            <Flex mt="2" pt={2} justifyContent="space-between" alignContent="center">
              <Button onClick={() => setOpenPerchaseModal(true) } width={40} variant={'brand'}>Buy NFT</Button>
              <Button 
                  ml={2}
                  textColor={'#319EF6'}
                  borderRadius="6px"
                  mb="1.5"
                  borderColor={'#319EF6'}
                  variant='outline'
                  width={40}
              >
                  <Link to={`/nfts/${id}`}>View NFT</Link>
              </Button>
            </Flex>
            
          </Box>
              <ComfirmPurchase isOpen={purchaseModal}
                               close={()=>setOpenPerchaseModal(false)}
                               id={id}
                               image={nftImage}
                               name={name}
              />
        </Box>
    )
};
export default Nft 

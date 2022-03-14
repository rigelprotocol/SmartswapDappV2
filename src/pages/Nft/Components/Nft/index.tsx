import React, { useState } from 'react'
import {
    Box,
    Text,
    Button,
    useColorModeValue,
    Image,
    Flex,
    Heading,
  } from '@chakra-ui/react';
import ComfirmPurchase from '../../Modals/ComfirmPurchase';
import { Link } from 'react-router-dom';

type NftProps = {
    nftName: string,
    image: string,
    isFeatured?: boolean,
    id: number,
    priceUSD?: number,
    priceRGP?: number,
    number?: string
}


export const Nft = function ({ nftName, image, number, id, priceUSD, priceRGP, isFeatured = false }: NftProps) {

 
  const [ purchaseModal,setOpenPerchaseModal] = useState(false)
   
  return (
         <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          borderColor={'#DEE5ED'}
          position="relative"
          >
            <Box p={2.5}>
          <Image
            src={image}
            alt={`Picture `}
            roundedTop="lg"
            //maxHeight={246}
            rounded="lg"
          />
  </Box>
          <Box p="3">
            <Box d="flex" alignItems="baseline">
            <Text
            py={2} 
              >
                {nftName}
              </Text>
            </Box>
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text textColor={'#666666'}>Number:</Text>
              <Text>#179 of 500</Text>
            </Flex>
  
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text textColor={'#666666'}>Price:</Text>
              <Text>250 USD</Text>
            </Flex>
            <Flex mt="2" justifyContent="space-between" alignContent="center">
              <Text></Text>
              <Text textColor={'#666666'} >≈ 5000.91 RGP</Text>
            </Flex>
            <Flex mt="2" pt={2} justifyContent="space-between" alignContent="center">
              <Button onClick={()=>setOpenPerchaseModal(true) } width={40} variant={'brand'}>Buy NFT</Button>
              <Button 
              ml={2}
              textColor={'#319EF6'}
              borderRadius="6px"
              mb="1.5"
              borderColor={'#319EF6'}
              variant='outline'
              width={40}
              >
                     <Link to="/nfts/123">View NFT</Link></Button>
            </Flex>
            
          </Box>
          <ComfirmPurchase isOpen={purchaseModal} close={()=>setOpenPerchaseModal(false) } />
     
        </Box>
    )
}
export default Nft 

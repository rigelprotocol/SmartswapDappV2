import React from 'react'
import Carousel from './Components/Carousel'
import FeaturedNft from './Components/FeaturedNft.tsx'
import Nft from './Components/Nft'
import { Container, Stack, Text } from '@chakra-ui/react'
import { feturedNFTsMockData } from './mockData'
import NftList from './Components/NftList'

const Index = () => {
  return (
    <>
      <Carousel />

      <Container maxW='container.xl'>
<Stack>
<Text pl={7} fontWeight={700} pt={10} fontSize={24}>
Featured NFT
            </Text>
        <FeaturedNft />

        
        <Text pl={7} fontWeight={700} fontSize={24}>
            NFTs
            </Text>

        <NftList/>
</Stack>
      </Container>

    </>
  )
}

export default Index
import React from 'react'
import Carousel from './Components/Carousel'
import FeaturedNft from './Components/FeaturedNft.tsx'
import Nft from './Components/Nft'
import { Container, Stack } from '@chakra-ui/react'
import { feturedNFTsMockData } from './mockData'
import NftList from './Components/NftList'

const Index = () => {
  return (
    <>
      <Carousel />

      <Container maxW='container.xl'>
<Stack>
        <FeaturedNft />

        

        <NftList/>
</Stack>
      </Container>

    </>
  )
}

export default Index
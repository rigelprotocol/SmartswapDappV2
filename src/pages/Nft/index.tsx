import React from 'react'
import Carousel from './Components/Carousel'
import FeaturedNft from './Components/FeaturedNft.tsx'
import { Container,  Text } from '@chakra-ui/react'
import NftList from './Components/NftList'

const Index = () => {
  return (
    <>
      <Container pt={5} maxW='container.xs'>
        <Carousel />
           <FeaturedNft />
          <NftList />
      </Container>
    </>
  )
}

export default Index
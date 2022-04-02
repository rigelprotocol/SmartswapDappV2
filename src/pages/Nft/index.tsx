import React from 'react'
import Carousel from './Components/Carousel'
import FeaturedNft from './Components/FeaturedNft.tsx'
import { Container } from '@chakra-ui/react'
import NftList from './Components/NftList'

const Index = () => {
  return (
    <>
      <Container pt={5} maxW='container.xs'>
        <Carousel />
        <FeaturedNft id={1} />
        <NftList />
      </Container>
    </>
  )
};

export default Index;
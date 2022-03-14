import React, { useState } from "react"
import {
    Badge,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ComfirmPurchase from "../../Modals/ComfirmPurchase";
import { Link } from "react-router-dom";

type NftProps = {
    nftName?: string,
    image?: string
    isFeatured?: boolean,
    id?: number,
    priceUSD?: number,
    priceRGP?: number,
    number?: string

}
export const FeaturedNft = function ({ nftName, image, number, id, priceUSD, priceRGP, isFeatured = false }: NftProps) {

    const [ purchaseModal,setOpenPerchaseModal] = useState(false)

    return (
        <>
            <Center py={8}>
                <Stack
                    borderRadius="lg"
                    w={{ sm: '100%', md: '540px', lg: '900px' }}
                    // height={{ sm: '476px', md: '20rem', lg: '900px' }}
                    // maxWidth={900}
                    direction={{ base: 'column', md: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                >
                    <Flex flex={1} bg="blue.200">
                        <Image
                            objectFit="cover"
                            boxSize="100%"
                            // 
                            src={
                                'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png'
                            }
                        />
                    </Flex>
                    <Stack
                        flex={1}
                        pl={10}
                    >
                        <Text fontSize={38} pt={'25%'}>
                            Featured NFT Name
                        </Text>
                        <Text align={'left'} pt={10} textColor={"grey"}>
                            Price
                        </Text>

                        <Text fontSize={28}>
                            7,500 USD
                        </Text>

                        <Text align={'left'} pt={10} textColor={"grey"}>
                            500.91 RGP
                        </Text>
                        <Flex t="1" pt={3} alignContent="center" pb={3}>
                            <Button  onClick={()=>setOpenPerchaseModal(true) } width={'45%'} variant={'brand'}>Buy NFT</Button>
                            <Button
                                ml={5}
                                textColor={'#319EF6'}
                                borderRadius="6px"
                                borderColor={'#319EF6'}
                                variant='outline'
                                width={'45%'}
                            >
                                <Link to="/nfts/123">View NFT</Link>
                                
                                
                                </Button>
                        </Flex>

                    </Stack>
                </Stack>
            </Center>
            <ComfirmPurchase isOpen={purchaseModal} close={()=>setOpenPerchaseModal(false) } />
        </>
    )
}
export default FeaturedNft


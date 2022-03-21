import React, { useState } from "react"
import {
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ComfirmPurchase from "./Modals/ComfirmPurchase";
import ClaimNFTModal from "./Modals/ClaimNFTModal";

import { Link, useParams } from 'react-router-dom';

type NftProps = {
    nftName?: string,
    image?: string
    isFeatured?: boolean,
    id?: number,
    priceUSD?: number,
    priceRGP?: number,
    number?: string
}



export const ViewNFT = function ({ nftName, image, number, id, priceUSD, priceRGP, isFeatured = false }: NftProps) {
    const [purchaseModal, setOpenPerchaseModal] = useState(false);
    const [clamModal, setOpenClamModal] = useState(false);

    const {nftId} = useParams();

    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    return (
        <>
            <Center py={8} marginBottom={8}>
                <Stack
                    w={{ sm: '100%', md: '540px', lg: '950px' }}
                    direction={{ base: 'column', md: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    p={2}
                >
                    <Flex flex={1} >
                        <Image
                            borderRadius="lg"
                            objectFit="cover"
                            boxSize="100%"
                            src={
                                'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png'
                            }
                        />
                    </Flex>
                    <Stack
                        flex={1}
                        pl={10}
                        paddingRight={5}
                    >
                        {/*<Text color={'#319EF6'}>You own 1 of these NFTs.</Text>*/}
                        <Text color={textColor} fontSize={30} fontWeight={700}>
                            NFT Name
                        </Text>
                        <Flex mt="1" justifyContent="space-between" alignContent="center">


                            <Grid
                                templateRows='repeat(1, 1fr)'
                                templateColumns='repeat(5, 1fr)'
                            >
                                <GridItem rowSpan={2}   ><Image mt={3} src="/images/cirlce.png" /> </GridItem>
                                <GridItem colSpan={2}  ><Text color={lightTextColor} >Creator</Text> </GridItem>
                                <GridItem colSpan={4}  ><Text color={textColor}  >Rigel Protocol</Text> </GridItem>
                            </Grid>
                            <Flex
                                flexDirection="column"
                                justifyContent="center"
                            >
                                <Text color={lightTextColor}>Number</Text>
                                <Text color={textColor}>{nftId}</Text>
                            </Flex>
                        </Flex>
                        <Text color={textColor} py={3}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sociis iuop ullamcorper morbi ut amet.</Text>

                        <Grid pt={4} templateColumns='repeat(5, 2fr)' gap={0}>
                            <GridItem colSpan={1}   >
                                <Text color={lightTextColor}>Blockchain</Text>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6}   >   <Text color={lightTextColor}>Investment to claim</Text>
                            </GridItem>
                            <GridItem colSpan={1} >
                                <Flex mt="1" alignContent="center">
                                    <Text fontWeight={400} color={textColor} >BSC</Text>
                                    <Image ml={2} alt="bsc" src="/images/binance.svg" />
                                </Flex>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6}>
                                <Text fontWeight={400} color={textColor} >2,500 USD</Text>
                            </GridItem>
                            <GridItem colSpan={2} pt={2} >
                                <Text color={lightTextColor}>Appraised Value</Text>
                            </GridItem>
                            <GridItem colStart={3} pt={2} colEnd={6}><Text color={lightTextColor}>Number in circulation</Text>
                            </GridItem>

                            <GridItem colSpan={2} >
                                <Text color={textColor} fontWeight={400}>750 USD</Text>
                            </GridItem>
                            <GridItem  color={textColor} colStart={3} colEnd={6}><Text fontWeight={400} >300</Text>
                            </GridItem>
                        </Grid>
                        <Flex pt={5} mt="1" justifyContent="space-between" alignContent="center">
                            <Text align={'left'} color={lightTextColor}>  Price    </Text>
                            <Text color={lightTextColor} >  ≈</Text>
                        </Flex>
                        <Flex mt="1" justifyContent="space-between" alignContent="center">
                            <Text color={textColor} fontWeight={700} fontSize={28}>
                                250 USD
                            </Text>
                            <Text color={lightTextColor}>
                                500.91 RGP
                            </Text>
                        </Flex>
                        <Flex t="1" pt={3} justifyContent="space-between" alignContent="center">
                            <Button onClick={() => setOpenPerchaseModal(true)} width={'45%'} variant={'brand'}>Buy NFT</Button>
                            <Button
                                textColor={'#319EF6'}
                                borderRadius="6px"
                                borderColor={'#319EF6'}
                                variant='outline'
                                width={'45%'}
                                onClick={() => setOpenClamModal(true)}
                            >
                                Claim NFT</Button>
                        </Flex>

                    </Stack>
                </Stack>
            </Center>
            <ComfirmPurchase isOpen={purchaseModal} close={() => setOpenPerchaseModal(false)} id={9} image={'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png'} />
            <ClaimNFTModal isOpen={clamModal} close={() => setOpenClamModal(false)} />

        </>
    )
};
export default ViewNFT


import React, { useState } from "react"
import {
    Badge,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ComfirmPurchase from "./Modals/ComfirmPurchase";
import ClaimNFTModal from "./Modals/ClaimNFTModal";

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
    const [purchaseModal, setOpenPerchaseModal] = useState(false)
    const [clamModal, setOpenClamModal] = useState(false)
    return (
        <>
            <Center py={8} marginBottom={8}>
                <Stack
                    borderRadius="lg"
                    w={{ sm: '100%', md: '540px', lg: '950px' }}
                    direction={{ base: 'column', md: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    >
                    <Flex flex={1} bg="blue.200">
                        <Image
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
                        <Text color={'#319EF6'}>You own 1 of these NFTs.</Text>
                        <Text fontSize={30} fontWeight={700}>
                            NFT Name
                        </Text>


                        <Flex mt="1" justifyContent="space-between" alignContent="center">


                            <Grid
                                templateRows='repeat(1, 1fr)'
                                templateColumns='repeat(5, 1fr)'
                            >
                                <GridItem rowSpan={2}   ><Image mt={3} src="/images/cirlce.png" /> </GridItem>
                                <GridItem colSpan={2}  ><Text color={'grey'} >Creator</Text> </GridItem>
                                <GridItem colSpan={4}  ><Text  >Rigel Protocol</Text> </GridItem>
                            </Grid>


                            <Flex
                                flexDirection="column"
                                justifyContent="center"
                            >
                                <Text color={'grey'}>Number</Text>
                                <Text>#31</Text>
                            </Flex>



                        </Flex>



                        <Text py={3}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sociis iuop ullamcorper morbi ut amet.</Text>

                        <Grid pt={4} templateColumns='repeat(5, 2fr)' gap={0}>
                            <GridItem colSpan={1} >
                                <Text color={'grey'}>Blockchain</Text>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6}   >   <Text color={'grey'}>Investment to claim</Text>
                            </GridItem>

                            <GridItem colSpan={1} >
                                <Flex mt="1" alignContent="center">

                                    <Text  fontWeight={400} >BSC</Text>
                                    <Image ml={2} alt="bsc" src="/images/binance.svg" />
                                </Flex>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6}>
                                <Text  fontWeight={400} >2,500 USD</Text>
                            </GridItem>


                            <GridItem colSpan={2} pt={2} >
                                <Text color={'grey'}>Appraised Value</Text>
                            </GridItem>
                            <GridItem colStart={3} pt={2} colEnd={6}><Text color={'grey'}>Number in circulation</Text>
                            </GridItem>

                            <GridItem colSpan={2} >
                                <Text  fontWeight={400}>750 USD</Text>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6}><Text  fontWeight={400} >300</Text>
                            </GridItem>

                        </Grid>



                        <Flex pt={5} mt="1" justifyContent="space-between" alignContent="center">
                            <Text align={'left'} textColor={"grey"}>  Price    </Text>
                            <Text color={'grey'} >  ≈</Text>
                        </Flex>


                        <Flex mt="1" justifyContent="space-between" alignContent="center">

                            <Text fontWeight={700} fontSize={28}>
                            250 USD
                            </Text>
                            <Text textColor={"grey"}>
                                500.91 RGP
                            </Text>
                        </Flex>
                        <Flex t="1"  pt={3} justifyContent="space-between" alignContent="center">
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
            <ComfirmPurchase isOpen={purchaseModal} close={() => setOpenPerchaseModal(false)} />
            <ClaimNFTModal isOpen={clamModal} close={() => setOpenClamModal(false)} />

        </>
    )
}
export default ViewNFT


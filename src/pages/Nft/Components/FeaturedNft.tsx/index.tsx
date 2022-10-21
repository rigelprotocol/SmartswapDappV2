import React, { useState } from "react"
import {
    Box,
    Button,
    Center,
    Flex,
    Image, Skeleton,
    Stack,
    Text,
    useColorModeValue, useMediaQuery,
} from '@chakra-ui/react';
import ComfirmPurchase from "../../Modals/ComfirmPurchase";
import { Link } from "react-router-dom";
import {useNft, useNftName} from "../../../../hooks/useNFT";
import {NftProps} from "../../ViewNFT";
import {useActiveWeb3React} from "../../../../utils/hooks/useActiveWeb3React";


export const FeaturedNft = function ({ id  }: {id: number}) {

    const [ purchaseModal,setOpenPerchaseModal] = useState(false);

    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const lightTextColor = useColorModeValue("#666666", "grey");
    const tabColor = useColorModeValue('white', 'gray.900');
    const { chainId, account } = useActiveWeb3React();
    const [isMobileDevice] = useMediaQuery("(max-width: 750px)");

    const { firstToken, secondToken ,prices, unsoldItems , nftId, loadData,mint,nftNameInfo} = useNft(id);

    const {name, nftImage, loading} = useNftName(id,nftNameInfo);

    const rgpPrice = (100.54 * parseFloat(prices.firstTokenPrice)).toFixed(2);

    const data : NftProps = {
        nftName: name,
        image: nftImage,
        priceUSD: prices.firstTokenPrice,
        id: id,
        priceRGP: rgpPrice,
        total: nftId.length,
        unsold: unsoldItems
    };

    return (
        <>

                <Box>
                    <Text color={textColor} fontWeight={700} py={6} fontSize={24}>
                        Featured NFT
                    </Text>
                    <Center py={5}>
                        <Stack
                            borderRadius="lg"
                            borderWidth="1px"
                            rounded="lg"
                            borderColor={'#DEE5ED'}
                            w={{ sm: '100%', md: '540px', lg: '900px' }}
                            direction={{ base: 'column', md: 'row' }}
                            bg={tabColor}
                            p={3}

                        >
                            <Flex flex={1} justifyContent={'center'} alignItems={'center'}>
                                {loading ? <Skeleton
                                        height='460px'
                                        w={isMobileDevice ? '90%': '408px'}
                                    /> :
                                    <Image
                                        objectFit="cover"
                                        boxSize="100%"
                                        borderRadius={6}
                                        src={nftImage}
                                    />
                                }
                            </Flex>
                            <Stack
                                flex={1}
                                pl={10}
                            >
                                <Text fontWeight={700} color={textColor}  fontSize={38} pt={'25%'}>
                                    {name}
                                </Text>

                                { account &&
                                (<>
                                        <Text align={'left'} pt={10} textColor={lightTextColor}>
                                            Price
                                        </Text>

                                        {loadData ? <Skeleton height={'30px'} w={'100px'}/> :
                                            <Text color={textColor}  fontWeight={700} fontSize={28}>
                                                {prices.secondTokenPrice} USD
                                            </Text>
                                        }

                                        {loadData ?  <Skeleton height={'30px'} w={'100px'}/> :
                                            <Text align={'left'}  textColor={lightTextColor}>
                                                {(100.54 * parseFloat(prices.firstTokenPrice)).toFixed(2)} RGP
                                            </Text>
                                        }

                                        <Flex  pt={20} alignContent="center" >
                                            <Button  onClick={()=>setOpenPerchaseModal(true) } width={'45%'} variant={'brand'}>Buy NFT</Button>
                                            <Button
                                                ml={5}
                                                textColor={'#319EF6'}
                                                borderRadius="6px"
                                                borderColor={'#319EF6'}
                                                variant='outline'
                                                width={'45%'}
                                            >
                                                <Link to={{
                                                    pathname: `/nfts/${id}`,
                                                    state: data
                                                }}>View NFT</Link>
                                            </Button>
                                        </Flex>
                                </>
                                )}

                            </Stack>
                        </Stack>
                    </Center>
                    <ComfirmPurchase isOpen={purchaseModal} close={()=>setOpenPerchaseModal(false)} id={1} image={nftImage} name={name} mint ={mint} />
                </Box>

        </>
    )
};
export default FeaturedNft


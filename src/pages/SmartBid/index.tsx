import React from "react";
import {
    Box, Text, Flex, useColorModeValue, VStack, Heading,
    Button, SimpleGrid, GridItem, useMediaQuery, Spinner
} from '@chakra-ui/react';
import {AddIcon} from "@chakra-ui/icons";
import SmartBidCard from "./Components/Card";
import BidCarousel from "./Components/BidCarousel";
import {SupportedChainId} from "../../constants/chains";
import {useBidInfo} from "../../state/smartbid/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../state";


const SmartBid = () => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const headerColor = useColorModeValue("#0760A8", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");
    const {loadBid, bidItemsNFT } = useBidInfo();
    const ChainId = useSelector<RootState>((state) => state.newfarm.chainId);

    return (
        <Box width={'95%'} margin={'30px auto'}>
         <BidCarousel/>
            <Box display={'flex'} flexDirection={isMobileDeviceSm ? 'column' : 'row'} justifyContent={'space-between'} my={'30px'} alignItems={'center'} width={'100%'} mx={'auto'}>
                <Text color={textColor} fontWeight={700} fontStyle={'bold'} fontSize={'40px'} my={2}>Events</Text>
                <Flex>
                    <Button
                        border={'1px solid #319EF6'} mx={2}
                        d='block'
                        _hover={{ bgColor: "transparent" }}
                        _active={{ bgColor: "transparent" }}
                        color='#319EF6'
                        fontSize='lg'
                        cursor='pointer'
                        lineHeight='24px'
                        borderRadius='6px'
                        bg='transparent'
                    >Rent NFT</Button>
                    <Button leftIcon={<AddIcon/>} variant={'brand'} mx={2}>Create Event</Button>
                </Flex>
            </Box>
            {
                loadBid ? <Flex justifyContent={'center'}>
                    <Spinner
                        thickness="3px"
                        speed="0.75s"
                        emptyColor="transparent"
                        color="#319EF6"
                        size="xl"
                        width="100px"
                        height="100px"
                        my={10}
                    />
                </Flex> : null }
            {
                ChainId !== SupportedChainId.POLYGONTEST ?

                    <SimpleGrid width={'100%'} p={'10px'} mx={'auto'} minChildWidth={'305px'} spacingX={'10px'}
                                spacingY={'20px'} alignItems={'start'}>

                        {bidItemsNFT.map((item, index) => !item.time ? (
                                <GridItem rowSpan={1} key={index} colSpan={1}>
                                    <SmartBidCard title={item.title} image={item.image}
                                                  exclusive={item.exclusive} tileColor={item.color} bgColor={item.bgColor}
                                                  id={item.id}/>
                                </GridItem>

                            ) : null
                        )}

                        {bidItemsNFT.map((item, index) => item.time ? (
                                <GridItem rowSpan={1} key={index} colSpan={1}>
                                    <SmartBidCard title={item.title} image={item.image}
                                                  exclusive={item.exclusive} tileColor={item.color} bgColor={item.bgColor}
                                                  id={item.id}/>
                                </GridItem>

                            ) : null
                        )}
                    </SimpleGrid>

                    :

                    <VStack minH="80vh" align="center" justify="center" width={'40%'} mx={'auto'}>
                        <Heading color={headerColor} fontFamily={'Cera Pro'} fontSize={'64px'}>Coming Soon...</Heading>
                        <Text color={textColor} fontSize={'20px'} textAlign={'center'}>We are going to launch creation of bid events by individual users very soon.</Text>
                    </VStack>

            }
        </Box>
    )
};

export default SmartBid;

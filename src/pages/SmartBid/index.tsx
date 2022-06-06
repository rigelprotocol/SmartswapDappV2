import React, {useEffect, useMemo, useState} from "react";
import {Box, Text, Flex, useColorModeValue, VStack, Heading,
    Button, SimpleGrid, GridItem, useMediaQuery} from '@chakra-ui/react';
import {AddIcon} from "@chakra-ui/icons";
import SmartBidCard from "./Components/Card";
import {SmartBidData, SmartBidNFTData} from "./Components/cardData";
import BidCarousel from "./Components/BidCarousel";
import {RigelSmartBidTwo, RigelSmartBid} from "../../utils/Contracts";
import {useActiveWeb3React} from "../../utils/hooks/useActiveWeb3React";
import {SMARTBID2, SMARTBID1} from "../../utils/addresses";
import {SupportedChainId} from "../../constants/chains";


const SmartBid = () => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const headerColor = useColorModeValue("#0760A8", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");
    const {chainId, library} = useActiveWeb3React();
    const [itemLength, setItemLength] = useState(3);
    const [itemTwoLength, setItemTwoLength] = useState(3);

    useMemo(() => {
        const getLength = async () => {
            try {
                const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                const item = await bidContract.bidLength();
                setItemLength(item);

                const bidContractTwo = await RigelSmartBid(SMARTBID1[chainId as number], library);
                const itemTwo = await bidContractTwo.bidLength();
                setItemTwoLength(itemTwo);

            } catch (e) {
                console.log(e)
            }
        };
        getLength();

    }, [chainId]);


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
                chainId === SupportedChainId.BINANCETEST ?

                    <SimpleGrid width={'100%'} p={'10px'} mx={'auto'} minChildWidth={'305px'} spacingX={'10px'}
                                spacingY={'20px'} alignItems={'start'}>
                        {SmartBidData.map((item, index) => item.id !== -1 && item.id < Number(itemTwoLength.toString()) ? (
                                <GridItem rowSpan={1} key={item.id} colSpan={1}>
                                    <SmartBidCard title={item.title} image={item.image}
                                                  exclusive={item.exclusive} tileColor={item.color} bgColor={item.bgColor}
                                                  id={item.id}/>
                                </GridItem>

                            ) : null
                        )}

                        {SmartBidNFTData.map((item, index) => item.id !== -1 && item.id < Number(itemLength.toString()) ? (
                                <GridItem rowSpan={1} key={item.id} colSpan={1}>
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

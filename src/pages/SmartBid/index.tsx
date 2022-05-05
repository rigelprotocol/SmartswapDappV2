import React from "react";
import {Box, Text, Flex, useColorModeValue, Button, SimpleGrid, GridItem, useMediaQuery} from '@chakra-ui/react';
import {AddIcon} from "@chakra-ui/icons";
import SmartBidCard from "./Components/Card";
import {SmartBidData} from "./Components/cardData";
import BidCarousel from "./Components/BidCarousel";


const SmartBid = () => {
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");


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
            <SimpleGrid width={'100%'} p={'10px'} mx={'auto'} minChildWidth={'305px'} spacingX={'10px'} spacingY={'20px'}  alignItems={'start'}>
                {SmartBidData.map((item) => (
                    <GridItem rowSpan={1} key={item.id} colSpan={1}>
                        <SmartBidCard key={item.id} title={item.title} image={item.image} exclusive={item.exclusive} tileColor={item.color} bgColor={item.bgColor} id={item.id}/>
                    </GridItem>

                ))}
            </SimpleGrid>

        </Box>
    )
};

export default SmartBid;

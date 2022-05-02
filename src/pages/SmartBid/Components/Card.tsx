import React from "react";
import {Box, Text, Flex, Image, HStack, Icon} from '@chakra-ui/react';
import {MdPeopleOutline, AiOutlineGift, RiMedalFill} from "react-icons/all";
import {Link} from 'react-router-dom';

export type CardDetails = {
    exclusive: boolean,
    title: string,
    image: string,
    tileColor?: string,
    bgColor: string,
    id: number
}


const SmartBidCard = ({exclusive, title, image, tileColor, bgColor, id} : CardDetails) => {
    return (
        <Link to={`/smartbid/${id}`}>
            <Box
                height={'300px'}
                width={'305px'}
                my={4}
                mx={'auto'}
                borderRadius={'30px'}
                background={bgColor}
            >
                <Flex justifyContent={'center'}>
                    <Image src={image} marginTop={'-30px'} zIndex={1}/>
                </Flex>
                <Box width={'90%'}
                     mx={'auto'}
                     position={'relative'}
                     mt={'-35px'}
                     mb={2}
                     zIndex={10}
                     boxShadow={'0px 20px 20px rgba(0, 0, 0, 0.08)'}
                     p={3}
                     borderRadius={'20px'} background={'#FDFCFF'}>
                    <HStack justifyContent={'space-between'}>
                        <Box fontWeight={700} my={2}>
                            <Text color={'#333333'} fontSize={'24px'}>08:41:29</Text>
                            <Text color={'#666666'} fontSize={'14px'}>50% RGP Token</Text>
                        </Box>
                        {
                            exclusive &&
                            <Flex background={tileColor} borderRadius={'4px'} padding={1} alignItems={'center'}>
                                <Icon as={RiMedalFill} color={'#fff'} pr={1} w={6} h={6}/>
                                <Text fontSize={'14px'} fontWieght={700}>Exclusive</Text>
                            </Flex>
                        }
                    </HStack>
                    <Text my={2} color={'#999999'} fontSize={'12px'} fontWeight={400}>Place your bid and stand a chance to...</Text>

                    <Box fontWeight={400} my={1}>
                        <Flex alignItems={'center'}>
                            <Icon as={MdPeopleOutline} color={'#333333'} pr={1} w={6} h={6}/>
                            <Text color={'#333333'} my={1} fontSize={'12px'} fontWeight={700} lineHeight={'16px'}>{title}</Text>
                        </Flex>

                        <Flex  alignItems={'center'}>
                            <Icon as={AiOutlineGift} color={'#333333'} pr={1} w={6} h={6}/>
                            {exclusive ?
                                <Text color={'#333333'} my={1} fontSize={'12px'} lineHeight={'16px'}>Participants get <span style={{color: tileColor}}>..</span> of their winnings.</Text>
                                :
                                <Text color={'#333333'} my={1} fontSize={'12px'} lineHeight={'16px'}>NFT Owners get <span style={{color: '#319EF6'}}>X2</span> of their winnings.</Text>
                            }
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Link>
    )
};

export default SmartBidCard;

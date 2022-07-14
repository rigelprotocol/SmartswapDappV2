import React, {useEffect, useState} from "react";
import {Box, Text, Flex, Image, HStack, Icon, Skeleton, useMediaQuery} from '@chakra-ui/react';
import {MdPeopleOutline, AiOutlineGift, RiMedalFill} from "react-icons/all";
import {Link} from 'react-router-dom';
import {useSmartBid} from "../../../hooks/useSmartBid";
import {NftProps} from "../../Nft/ViewNFT";

export type CardDetails = {
    exclusive: boolean,
    title: string,
    image: string,
    tileColor?: string,
    bgColor: string,
    id: number
}


export function timeConverter(UNIX_timestamp: any) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    const min = a.getMinutes()<10 ? `0${a.getMinutes()}` : a.getMinutes();
    const sec = a.getSeconds() < 10 ? `0${a.getSeconds()}` : a.getSeconds();
    return `${month} ${date}, ${year} ${hour}:${min}:${sec}`;
}

export const countDownDate = (time: number) => (timeConverter(time));


const SmartBidCard = ({exclusive, title, image, tileColor, bgColor, id} : CardDetails) => {

    const { loadData , bidTime } = useSmartBid(id, exclusive);


    const [currentClock, setCurrentClock] = useState('');
    const [timeDistance, setTimeDistance] = useState(1);
    const [isMobileDevice] = useMediaQuery("(max-width: 767px)");

    useEffect(() => {
        const timeFunction = setInterval(function() {

            const now = new Date().getTime();
            const bidDate = countDownDate(Number(bidTime));

            const bidDeadline = new Date(bidDate).getTime();
            const distance =  bidDeadline - now;
            setTimeDistance(distance);

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCurrentClock(`${days}d ${hours}h ${minutes}m ${seconds}s`);

            if (distance < 0) {
                clearInterval(timeFunction);
                setCurrentClock(`00:00:00`)
            }
        }, 1000);
    }, [bidTime]);

    const data = {
        id: id,
        exclusive: exclusive
    };


    return (
        <Link to={{
                pathname: `/smartbid/${id}/${exclusive}`,
                state: data
            }}>
                <Box
                    height={'300px'}
                    width={'305px'}
                    my={4}
                    mx={'auto'}
                    borderRadius={'30px'}
                    background={bgColor}
                    transition={'transform .2s'}
                    _hover={{transform: 'scale(1.03)'}}
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
                                {!loadData ?
                                    <Text color={'#333333'} fontSize={'24px'}>{currentClock}</Text>
                                    : <Skeleton
                                        height='30px'
                                        w={isMobileDevice ? "330px" : "100%"}
                                    />
                                }
                                <Text color={'#666666'} fontSize={'14px'}>90% RGP Token</Text>
                            </Box>
                            {
                                exclusive &&
                                <Flex background={tileColor} borderRadius={'4px'} padding={1} alignItems={'center'}>
                                    <Icon as={RiMedalFill} color={'#fff'} pr={1} w={6} h={6}/>
                                    <Text fontSize={'14px'} fontWeight={700}>Exclusive</Text>
                                </Flex>
                            }
                        </HStack>
                        <Text my={2} color={'#999999'} fontSize={'12px'} fontWeight={400}>Place your bid and stand a
                            chance to...</Text>

                        <Box fontWeight={400} my={1}>
                            <Flex alignItems={'center'}>
                                <Icon as={MdPeopleOutline} color={'#333333'} pr={1} w={6} h={6}/>
                                <Text color={'#333333'} my={1} fontSize={'12px'} fontWeight={700}
                                      lineHeight={'16px'}>{title}</Text>
                            </Flex>

                            <Flex alignItems={'center'}>
                                <Icon as={AiOutlineGift} color={'#333333'} pr={1} w={6} h={6}/>
                                {exclusive ?
                                    <Text color={'#333333'} my={1} fontSize={'12px'} lineHeight={'16px'}>Participants
                                        get <span style={{color: tileColor}}>X2</span> of their winnings.</Text>
                                    :
                                    <Text color={'#333333'} my={1} fontSize={'12px'} lineHeight={'16px'}>NFT Owners
                                        get <span style={{color: '#0760A8'}}>X2</span> of their winnings.</Text>
                                }
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Link>
    )
};

export default SmartBidCard;

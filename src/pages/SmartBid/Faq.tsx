import React, {useState} from "react";
import {Box, Text, Flex, useColorModeValue, Button, Menu, Heading} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {FaqText} from "./Components/cardData";
import FaqBox from "./Components/FaqBox";

const Faq = () => {
    const textColor = useColorModeValue("#171717", "#FFFFFF");
    return (
        <>
            <Box
                position="relative" backgroundPosition="center"
                backgroundSize="cover" background={'#F5F7FA'}
                height={'300px'}
            >
                <Flex
                    width={'80%'} margin={'30px'}
                    position={'absolute'} bottom={'0px'} alignItems={'end'}
                    height={'95px'}>
                    <Link to={'/faq'}>
                        <Text p={'20px'} fontWeight={700} fontSize={'48px'} color={"#16161A"}>How it works</Text>
                    </Link>
                </Flex>
            </Box>
            <Box width={'90%'} margin={'0 auto'} py={'50px'}>
                <Text fontWeight={400} fontSize={'18px'} lineHeight={'172%'} color={textColor} my={'25px'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu laoreet sed sit adipiscing id. Sapien,
                    nascetur nunc, vitae sed amet, hendrerit sagittis. At ultrices mattis lectus duis faucibus a
                    vitae aliquam arcu. Sed viverra lorem tincidunt lobortis viverra sed blandit. Mattis consectetur
                    hac integer faucibus consectetur.
                </Text>
                <Text fontWeight={400} fontSize={'18px'} lineHeight={'172%'} color={textColor} my={'25px'}>
                    Nec augue et eu pretium felis sed. Nisi dui eget donec nascetur cursus.
                    Aliquet faucibus viverra risus consequat non sapien arcu. Condimentum massa ornare eu orci quis.
                    In arcu nunc vitae cursus faucibus nisl platea. Nec nisl viverra sit bibendum amet, sodales amet.
                    Ipsum, posuere at viverra rhoncus. Tristique ac quis at massa orci. Tortor quis porttitor arcu
                    pellentesque consectetur arcu nunc, quam. In orci placerat eget varius. Posuere neque,
                    vestibulum fames turpis. Viverra ac tristique tellus condimentum.
                    Viverra imperdiet faucibus enim eget. Interdum diam urna posuere elit mauris a mi.
                </Text>
                <Text fontWeight={400} fontSize={'18px'} lineHeight={'172%'} color={textColor} my={'25px'}>
                    A risus sed nec, id enim. Fermentum pulvinar sit consequat quis ultrices.
                    Sed felis eros, aliquam ut. Sollicitudin tortor urna, faucibus diam sit.
                    Justo sit et volutpat, sed eu. Velit convallis in scelerisque pretium.
                </Text>
                <Text fontWeight={400} fontSize={'18px'} lineHeight={'172%'} color={textColor} my={'25px'}>
                    Nisl, ac nisi, sapien nisi, dui phasellus tortor. Tincidunt tempus nulla tempus,
                    eget et arcu est et ut. Egestas cursus nec tristique imperdiet.
                    Placerat eu egestas vitae ridiculus nunc sit cras donec et.
                    Ut orci cum sit ullamcorper massa sed orci diam vel. Enim pellentesque mi cursus libero ut.
                    Egestas egestas varius aliquet id integer donec congue aliquet. Mauris ipsum rhoncus,
                    eget mauris consequat arcu.
                </Text>
            </Box>
            <Box width={'90%'} margin={'0 auto'} py={'50px'}>
                <Heading as={'h3'} my={'30px'}>FAQs</Heading>
                <Box border={'1px solid #C2CFD6'}>
                    {FaqText.map((item, index) => (
                        <FaqBox key={index} title={item.header} body={item.text}/>
                    ))}
                </Box>
            </Box>

        </>
    )
};

export default Faq;
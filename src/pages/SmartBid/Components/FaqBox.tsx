import React, {useState} from "react";
import {Box, Flex, Text, useColorModeValue} from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";

const FaqBox = ({ title, body} : { title: string, body: string}) => {
    const [showText, setShowText] = useState(false);
    return (
        <Box>
            <Flex justifyContent={'space-between'}
                  alignItems={'center'} padding={'10px 20px'}
                  background={'#C2CFD6'}
            >
                <Text>{title}</Text>
                {showText ? <ChevronUpIcon
                        w={10} h={10}
                        color={'#95ABB7'}
                        onClick={() => setShowText(!showText)}
                        cursor={'pointer'}/>
                    :
                    <ChevronDownIcon
                        w={10} h={10}
                        cursor={'pointer'}
                        onClick={() => setShowText(!showText)}
                        color={'#95ABB7'}/>}

            </Flex>
            {showText &&
                <FaqDetails body={body}/>
            }
        </Box>

    )
};

export default FaqBox;

const FaqDetails = ({body} : {body: string}) => {
    const faqColor = useColorModeValue('#435D6B', '#FFFFFF');
    return (
        <>
            <Box padding={'30px'}>
                <Text fontWeight={400} fontSize={'18px'} textAlign={'justify'} color={faqColor} my={3}>
                    {body}
                </Text>
            </Box>
        </>
    )
};
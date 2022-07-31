import React from "react";
import {Box, HStack, Text, Image, Flex, useMediaQuery} from "@chakra-ui/react";
import Logo from '../../../../assets/logo2.svg';

export type SliderProps = {
    title: string,
    sideImage?: string,
    background?: string,
    smallText?: string,
    widthSize?: string
}


const SliderTab = ({title, sideImage, background, smallText, widthSize}: SliderProps) => {
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");

    return (
        <Box
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            rounded="xl"
            backgroundSize="cover"
            background={'#000C15'}
            backgroundImage={background}>

            <Box height="580px" position="relative" width={'100%'}>
                <HStack justifyContent={'space-between'}>
                    <Box width={widthSize ? widthSize : '50%'} position={'absolute'} top={'10%'} ml={'40px'}>
                        <Flex>
                            <Image src={Logo} m={'30px 50px'}/>
                        </Flex>
                        <Text
                            color={'#F7B53C'}
                            fontWeight={'800'}
                            fontSize={isMobileDevice ? '40px' : '72px'}
                            lineHeight={isMobileDevice ? '44px' : '88px'}
                            background={'linear-gradient(180deg, rgba(247, 181, 60, 0) 0%, #AA6E00 113.7%), #F7B53C'}
                            backgroundClip={'text'}
                            //textFillColor={'transparent'}
                            m={'30px 50px'}
                            zIndex={'100'}
                        >{title}</Text>
                        {smallText && !isMobileDevice &&
                            <Text m={'30px 50px'}
                                  color={'#F3F4F7'}
                                  fontWeight={'600'}
                                  fontSize={isMobileDevice ? '40px' : '72px'}
                                  lineHeight={isMobileDevice ? '44px' : '88px'}
                            >{smallText}</Text>
                        }
                    </Box>
                    {sideImage &&
                    <Box>
                        <Image boxSize={isMobileDevice && '350px'} position={'absolute'} right={'90px'} bottom={'10px'} src={sideImage}/>
                    </Box>
                    }
                </HStack>
            </Box>
        </Box>
    )
};

export default SliderTab;
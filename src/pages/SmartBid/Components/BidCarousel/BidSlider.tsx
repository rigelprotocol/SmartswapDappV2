import React from "react";
import {Box, HStack, Text, Image, useMediaQuery} from "@chakra-ui/react";
import {SliderProps} from "../../../Nft/Components/Carousel/Slider";


const BidSlider = ({title, sideImage, background, smallText, widthSize}: SliderProps) => {
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");

    return (
        <Box
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            rounded="xl"
            backgroundSize="cover"
            background={background}
            >

            <Box height="300px" position="relative" width={'100%'}>
                <HStack justifyContent={'space-between'}>
                    <Box width={widthSize ? widthSize : '50%'} position={'absolute'} top={'10%'} ml={'40px'}>
                        <Text
                            color={'#0760A8'}
                            fontWeight={'700'}
                            fontFamily={'Inter, sans-serif'}
                            fontSize={isMobileDevice ? '30px' : '56px'}
                            lineHeight={isMobileDevice ? '34px' : '68px'}
                            m={'30px 50px'}
                            px={'40px'}
                            zIndex={'100'}
                        >{title}</Text>
                    </Box>
                    {sideImage &&
                    <Box>
                        <Image boxSize={isMobileDevice && '350px'} position={'absolute'} top={'0px'} right={'2px'} src={sideImage}/>
                    </Box>
                    }
                </HStack>
            </Box>
        </Box>
    )
};

export default BidSlider;
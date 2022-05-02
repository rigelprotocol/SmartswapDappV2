import React from "react";
import {Box, HStack, Text, Image, useMediaQuery, Flex} from "@chakra-ui/react";
import {SliderProps} from "../../../Nft/Components/Carousel/Slider";


const BidSlider = ({title, sideImage, background, smallText, widthSize}: SliderProps) => {
    const [isMobileDevice] = useMediaQuery("(max-width: 950px)");
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");

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
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Flex width={widthSize ? widthSize : '50%'} position={'absolute'} top={'10%'} left={'8%'} alignItems={'center'}>
                        <Text
                            color={'#0760A8'}
                            fontWeight={'700'}
                            fontFamily={'Inter, sans-serif'}
                            fontSize={isMobileDevice ? '30px' : '56px'}
                            lineHeight={isMobileDevice ? '34px' : '68px'}
                            my={'30px'}
                            zIndex={'100'}
                        >Smart Token <br/> Price Capture</Text>
                    </Flex>
                    {sideImage && !isMobileDeviceSm ?
                        (<Box>
                        <Image boxSize={isMobileDevice && '350px'} position={'absolute'} top={'0px'} right={'2px'} src={sideImage}/>
                    </Box>) : null
                    }
                </Flex>
            </Box>
        </Box>
    )
};

export default BidSlider;
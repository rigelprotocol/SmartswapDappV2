import React from 'react';
import Slider from "react-slick";
import {
    Box,
    IconButton,
    useBreakpointValue,
    useMediaQuery,
} from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import BidSlider from "./BidSlider";
import BidImage from '../../../../assets/smartbid/bidslider.svg';


const settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
};


export default function BidCarousel() {

    const [slider, setSlider] = React.useState<Slider | null>(null);
    const top = useBreakpointValue({ base: '90%', md: '50%' });
    const side = useBreakpointValue({ base: '30%', md: '40px' });
    const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");

    return (
        <Box
            position={'relative'}
            height={'300px'}
            width={'full'}
            rounded="xl"
            overflow={'hidden'}
            display={isMobileDeviceSm ? 'none' : 'block'}
        >
            <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            {/* Left Icon */}
            <IconButton
                aria-label="left-arrow"
                isActive
                isRound
                position="absolute"
                left={side}
                top={top}
                cursor={'pointer'}
                transform={'translate(0%, -50%)'}
                zIndex={2}
                onClick={() => slider?.slickPrev()}>
                <BiLeftArrowAlt size="40px" />
            </IconButton>

            {/* Right Icon */}
            <IconButton
                isRound
                aria-label="right-arrow"
                isActive
                position="absolute"
                right={side}
                top={top}
                transform={'translate(0%, -50%)'}
                zIndex={2}
                onClick={() => slider?.slickNext()}>
                <BiRightArrowAlt size="40px" />
            </IconButton>

            <Slider {...settings} ref={(slider : any) => setSlider(slider)}>
                <BidSlider title={'Smart Token Price Capture'} sideImage={BidImage} background={'#EDE8FD'} widthSize={'45%'} />
            </Slider>
        </Box>
    );
}
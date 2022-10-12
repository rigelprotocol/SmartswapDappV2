import React from 'react';
import Slider from "react-slick";
import {
    Box,
    IconButton,
    useBreakpointValue,
    useMediaQuery,
} from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import SliderTab from "./Slider";
import CoverImg from '../../../../assets/SwapMagician.png';
import CryptoImg from '../../../../assets/rigel-crypto.svg';
import Gift from '../../../../assets/GiftBox.svg';
import BackImage from '../../../../assets/tiles.png';
import gamepad from '../../../../assets/gamescreen.png';
import apeKing from '../../../../assets/Ape-King.png';
import Exchange from '../../../../assets/exchange.svg';
import art from '../../../../assets/art-slider.png';
import rent from '../../../../assets/rent.png';
import woman from '../../../../assets/work.png';
import pool from '../../../../assets/pool.png';


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


export default function Carousel() {

  const [slider, setSlider] = React.useState<Slider | null>(null);
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });
  const [isMobileDeviceSm] = useMediaQuery("(max-width: 450px)");

  return (
    <Box
      position={'relative'}
      height={'580px'}
      width={'full'}
      rounded="xl"
      overflow={'hidden'}
      display={isMobileDeviceSm ? 'none' : 'block'}
      >
      {/* CSS files for react-slick */}
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
      {/* Slider */}
      <Slider {...settings} ref={(slider : any) => setSlider(slider)}>
          <SliderTab title={'BACKED BY PROOF OF WORK'} sideImage={CryptoImg} background={CoverImg}/>
          <SliderTab title={'USE NFTs TO WORK AT RIGEL JOBS.'} sideImage={woman}/>
          <SliderTab title={'EARN REWARDS ON NFTs.'} sideImage={Gift} background={BackImage}/>
          <SliderTab title={'NFTs WILL FEATURE IN OUR GAMES.'} background={gamepad} widthSize={'65%'}/>
          <SliderTab title={'AUTOMATED LIQUIDITY FOR NFTs'} sideImage={Exchange} background={apeKing} smallText={'Easy sell for cash'}  widthSize={'65%'}/>
          <SliderTab title={'ART GETTING FEATURES IN OUR METAVERSE WORLD.'} background={art} widthSize={'75%'}/>
          <SliderTab title={'RENT NFTs'} background={rent} />
          <SliderTab title={'FARM POOL AVAILABLE FOR NFTs'} background={pool} widthSize={'65%'}/>
      </Slider>
    </Box>
  );
}
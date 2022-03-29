import React from 'react';
import Slider from "react-slick";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { slides } from '../../mockData';

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

  return (
    <Box
      position={'relative'}
      height={'550px'}
      width={'full'}
      rounded="xl"
      overflow={'hidden'}
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
        {slides.map((card, index) => (
     
         <Box
            key={index}
            height={'6xl'}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            rounded="xl"
            backgroundSize="cover"
            backgroundImage={`url(${card.backgroundImage})`}>
        
            <Container size="container.lg" height="550px"  position="relative">
              <Stack
                mt={'30%'}
                spacing={6}
                rounded="xl"
                w={'full'}
                maxW={'lg'}
                padding={10}
                position="relative"
                top="50%"
                opacity={90}
                backgroundColor={'rgba(0, 0, 0, 0.9)'}
                transform="translate(0, -50%)">
                <Text color={'white'} fontSize={20} align={"center"}>
                  {card.tittle}
                </Text>
                
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
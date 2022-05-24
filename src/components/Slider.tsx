import { Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Tooltip } from "@chakra-ui/react"
import React from "react"

type SliderType ={
   setSliderValue: React.Dispatch<React.SetStateAction<number>>;
   setName: React.Dispatch<React.SetStateAction<string>>;
   setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
   showTooltip:boolean;
   sliderValue:number;
   start:number;
   stop:number;
   width:string;
   name:string;
}
const SliderComponent = ({setSliderValue,setShowTooltip,showTooltip,sliderValue,start,stop,width,setName,name}:SliderType) => {
    return (
        <Slider
id='slider'
defaultValue={start}
min={start}
max={stop}
colorScheme='teal'
onChange={(v) => {
    setName(name)
    setSliderValue(v)
}}
onMouseEnter={() => setShowTooltip(true)}
onMouseLeave={() => setShowTooltip(false)}
width={width}
my="3"
>
{/* <SliderMark value={start} mt='1' ml='-2.5' fontSize='sm'>
        {start}%
      </SliderMark>
      <SliderMark value={stop} mt='1' ml='-20px' fontSize='sm'>
        {stop}%
      </SliderMark> */}
<SliderTrack>
  <SliderFilledTrack />
</SliderTrack>
<Tooltip
        hasArrow
        bg='teal.500'
        color='white'
        placement='top'
        isOpen={showTooltip}
        label={`${sliderValue}%`}
      >
  <SliderThumb />
</Tooltip>
</Slider>
    )
} 

export default SliderComponent
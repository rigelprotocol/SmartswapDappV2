import { Image } from '@chakra-ui/image'
import React, { FC, useState } from 'react'
import {Img} from '@chakra-ui/react';

// import { IconProps } from 'react-feather'
// import Image from '../Image'
// import { classNames } from '../../functions'
// import { cloudinaryLoader } from '../../functions/cloudinary'

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export type LogoProps = {
  srcs: string[]
  width: string | number
  height: string | number
  alt?: string
  squared?:boolean
  mr? : number,
  mb? : number
} 

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, width, height,alt='',squared, mr, mb, ...rest }) => {
  const [, refresh] = useState<number>(0);
  const src = srcs.find((src) => !BAD_SRCS[src]);
  return (
    <div className="rounded" style={{ width, height, marginBottom: mb && `${mb}px` , marginRight: mr && `${mr}px`}}>
      <Img
      onError={() => {
        if (src) BAD_SRCS[src] = true;
        refresh((i) => i + 1)
      }}
      borderRadius={squared ? width : 0}   src={src || 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/unknown.png'} />
    </div>
  )
};

export default Logo

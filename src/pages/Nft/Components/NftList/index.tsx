import React, { Container, Grid, SimpleGrid, Text } from "@chakra-ui/react"
import { createBreakpoints } from '@chakra-ui/theme-tools'
import Masonry from "react-masonry-css"

import { NFTsMockData } from "../../mockData"
import Nft from "../Nft"

const NftList = () => {

    const breakpoints = createBreakpoints({
        sm: '30em',
        md: '48em',
        lg: '62em',
        xl: '80em',
        '2xl': '96em',
      })
      const breakPoint = {
        default: 4,
        1280: 3,
        960: 2,
        600: 1
    }
    return (
<>
            
            <Masonry
             breakpointCols={breakPoint}
             className="my-masonry-grid"
             columnClassName="my-masonry-grid_column"
            >
            {NFTsMockData.map((nft, i) => (
                <div key={i} >
                    <Nft {...nft}  />
                </div>
            ))}
           </Masonry>
           </>
    )
}

export default NftList
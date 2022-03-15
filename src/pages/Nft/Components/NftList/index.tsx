import React, { Container, Grid, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react"
import { createBreakpoints } from '@chakra-ui/theme-tools'
import Masonry from "react-masonry-css"

import { NFTsMockData } from "../../mockData"
import Nft from "../Nft"

const NftList = () => {

  
  const textColor = useColorModeValue("#333333", "#F1F5F8");
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
      };
    return (
<>
<Text color={textColor} fontWeight={700} py={10} fontSize={24}>
            NFTs
          </Text>
            
            <Masonry
               breakpointCols={breakpointColumnsObj}
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
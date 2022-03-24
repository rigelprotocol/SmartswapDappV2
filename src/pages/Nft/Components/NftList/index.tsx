import React, { Text, useColorModeValue } from "@chakra-ui/react"
import Masonry from "react-masonry-css"

import { NFTsMockData } from "../../mockData"
import Nft from "../Nft"
import {useActiveWeb3React} from "../../../../utils/hooks/useActiveWeb3React";
import {SupportedChainId} from "../../../../constants/chains";

const NftList = () => {
    const { chainId } = useActiveWeb3React();
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

                {Number(chainId) === Number(SupportedChainId.BINANCETEST)
                    ? NFTsMockData.map((nft: any, index: number) =>
                        Number(chainId) ===
                        Number(SupportedChainId.BINANCETEST) &&
                        index !== -1 &&
                        index < 15 ? (
                            <div key={index} >
                                <Nft {...nft}  />
                            </div>
                        ) : null
                    ) :
                    Number(chainId) === Number(SupportedChainId.POLYGONTEST)
                        ? NFTsMockData.map((nft: any, index: number) =>
                            Number(chainId) ===
                            Number(SupportedChainId.POLYGONTEST) &&
                            index !== -1 &&
                            index < 12 ? (
                                <div key={index} >
                                    <Nft {...nft}  />
                                </div>
                            ) : null
                        ) : null
                }
            </Masonry>
        </>
    )
};

export default NftList
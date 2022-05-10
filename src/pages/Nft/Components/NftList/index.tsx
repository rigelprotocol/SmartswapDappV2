import React, {Text, useColorModeValue, Box, useMediaQuery} from "@chakra-ui/react"
import Masonry from "react-masonry-css"

import { NFTsMockData } from "../../mockData"
import Nft from "../Nft"
import {useActiveWeb3React} from "../../../../utils/hooks/useActiveWeb3React";
import {SupportedChainId} from "../../../../constants/chains";

const NftList = () => {
    const { chainId, account } = useActiveWeb3React();
    const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
    const textColor = useColorModeValue("#333333", "#F1F5F8");
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
      };
    return (
        <>
            {
                !account ? null :
                    <Box>
                        <Text color={textColor} fontWeight={700} py={10} fontSize={24}>
                            NFTs
                        </Text>
                        <Box mb={isMobileDevice ? '80px': '40px'}>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >

                                {Number(chainId) === Number(SupportedChainId.BINANCETEST) || Number(chainId) === Number(SupportedChainId.BINANCE)
                                    ? NFTsMockData.map((nft: any, index: number) =>
                                        index !== -1 &&
                                        index < 15 ? (
                                            <Box key={index}>
                                                <Nft {...nft}  />
                                            </Box>
                                        ) : null
                                    ) :
                                    Number(chainId) === Number(SupportedChainId.POLYGONTEST) || chainId === Number(SupportedChainId.POLYGON)
                                        ? NFTsMockData.map((nft: any, index: number) =>
                                            index !== -1 &&
                                            index < 12 ? (
                                                <Box key={index}>
                                                    <Nft {...nft}  />
                                                </Box>
                                            ) : null
                                        ) : null
                                }
                            </Masonry>
                        </Box>
                    </Box>
            }
        </>
    )
};

export default NftList
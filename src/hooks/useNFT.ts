import {useEffect} from "react";
import {RigelNFT, RigelNFTTwo} from "../utils/Contracts";
import { IPFS, SMARTSWAPNFTSALES, SMARTSWAPNFTTWO} from "../utils/addresses";
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {getERC20Token, useProvider} from "../utils/utilsFunctions";
import {useSelector} from "react-redux";
import {RootState} from "../state";
import {formatAmount} from "../utils/hooks/useAccountHistory";
import {ethers} from "ethers";
import {getNftToken, getNftTokenPolygon} from "../state/nft/hooks";
import {SupportedChainId} from "../constants/chains";
import useState from "react-usestateref";

export interface TokenProps {
    symbol: string,
    balance: string,
    address: string
}

export const useNft = (id: number) => {
    const { chainId, library, account } = useActiveWeb3React();

    const [firstToken, setFirstToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [secondToken, setSecondToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [prices, setPrices] = useState({firstTokenPrice: '', secondTokenPrice: ''});
    const [unsoldItems, setUnsoldItems] = useState<number>(0);
    const [nftId, setNftId, nftIdRef] = useState<number[]>([]);
    const [nftClass, setNftClass, nftClassRef] = useState<number>();
    const [loadData, setLoadData] = useState(false);


    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    let validSmartAddress: string;
    if (SMARTSWAPNFTSALES[chainId as number] !== "0x") {
        validSmartAddress = SMARTSWAPNFTSALES[chainId as number];
    }


    useEffect(() => {

        setLoadData(true);

        if (chainId === SupportedChainId.POLYGONTEST || chainId === Number(SupportedChainId.POLYGON)) {
            const nftArray = getNftTokenPolygon(id);
            setNftClass(id);
            setNftId(nftArray);
            console.log({nftArray,id},"123")
        } else if (chainId === SupportedChainId.BINANCETEST || chainId === Number(SupportedChainId.BINANCE)) {
            const nftArray = getNftToken(id);
            setNftId(nftArray)
            console.log("456")
            setNftClass(id);
        }
        const fetchNftData = async () => {
            if (chainId !== undefined) {
                // try {
                    const nftContract = await RigelNFT(validSmartAddress, library);
                    console.log({nftContract})
                    const purchaseData = await nftContract.nftsPurchaseData(nftClassRef.current);
                    const tokenA = await nftContract.tokenA();
                    const tokenB = await nftContract.tokenB();
                    console.log({validSmartAddress, purchaseData, tokenA, tokenB}, "123")
                    const tokenOne = await getERC20Token(tokenA, library);
                    const [tokenOneSymbol, tokenOneBalance, tokenOneDecimals] = await Promise.all(
                        [tokenOne.symbol(), tokenOne.balanceOf(account), tokenOne.decimals()]);
                        console.log({tokenOneSymbol, tokenOneBalance, tokenOneDecimals}, "123")
                    setFirstToken({symbol: tokenOneSymbol,
                        balance: parseFloat(ethers.utils.formatUnits(tokenOneBalance, tokenOneDecimals)).toFixed(4),
                        address: tokenA});
                       console.log({symbol: tokenOneSymbol,
                        balance: parseFloat(ethers.utils.formatUnits(tokenOneBalance, tokenOneDecimals)).toFixed(4),
                        address: tokenA})

                    const tokenTwo = await getERC20Token(tokenB, library);
                    const [tokenTwoSymbol, tokenTwoBalance, tokenTwoDecimals] = await Promise.all(
                        [tokenTwo.symbol(), tokenTwo.balanceOf(account), tokenTwo.decimals()]);
                 
                    setSecondToken({symbol: tokenTwoSymbol,
                        balance: parseFloat(ethers.utils.formatUnits(tokenTwoBalance, tokenTwoDecimals)).toFixed(4),
                        address: tokenB});
                    setPrices({firstTokenPrice: formatAmount(purchaseData.tokenPrice, tokenOneDecimals),
                        secondTokenPrice: formatAmount(purchaseData.tokenPrice, tokenTwoDecimals)});

                    const views = await nftContract.getAllNFTsSoldFromClass(id);
                    console.log({views}, "123")
                    if (views) {
                                setUnsoldItems(views.all.toString());
                        //         break;
                            }
                    setLoadData(false);
                    console.log({firstToken, secondToken, prices, unsoldItems, nftId, loadData})
            }
        };
        fetchNftData();
    }, [account, chainId, stateChanged]);
   
    return {firstToken, secondToken, prices, unsoldItems, nftId, loadData}
};

export const useNFTAllowance = (
    checkTokenApproval: number,
    tokenPrice: string,
    currency: string,
    id: number,
    tokenA:string,
    tokenB:string
) => {
    const { account, chainId, library } = useActiveWeb3React();
    const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
    const [hasTokenBBeenApproved, setHasTokenBBeenApproved] = useState(false);
    const [loadInfo, setLoadInfo] = useState(false);

    useEffect( () => {
        const getAllowance = async () => {
            if (account && tokenPrice) {
                    // 
                // try {
                    setLoadInfo(true);
                    const nftContract = await RigelNFT(SMARTSWAPNFTSALES[chainId as number], library);
                    
                    if (tokenA && tokenB) {
                        const [tokenAData, tokenBData] = await Promise.all([
                            getERC20Token(tokenA as string, library),
                            getERC20Token(tokenB as string, library),
                        ]);
                        const [allowanceA, allowanceB, decimalsA, decimalsB] = await Promise.all([
                            tokenAData.allowance(account, SMARTSWAPNFTSALES[chainId as number]),
                            tokenBData.allowance(account, SMARTSWAPNFTSALES[chainId as number]),
                            tokenAData.decimals(),
                            tokenBData.decimals()
                        ]);
                        const isTokenAApproved = allowanceA.toString() > parseFloat(ethers.utils.parseUnits(tokenPrice, decimalsA).toString());
                        const isTokenBApproved = allowanceB.toString() > parseFloat(ethers.utils.parseUnits(tokenPrice, decimalsB).toString());
                        setHasTokenABeenApproved(isTokenAApproved);
                        setHasTokenBBeenApproved(isTokenBApproved);
                        setLoadInfo(false);
                        console.log(18393939)
                    }
                // } catch (e) {
                //     console.log(e)
                // }
            }
        };
        getAllowance();
    }, [checkTokenApproval, currency, id, account,tokenPrice]);

    return { hasTokenABeenApproved, hasTokenBBeenApproved, loadInfo };
};


export const useNftName =  (id: number) => {
    const { chainId, library } = useActiveWeb3React();
    const [name, setName] = useState('');
    const [nftImage, setNftImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [nftId, setNftId, nftIdRef] = useState<number[]>([]);

    const ChainId = useSelector<RootState>((state) => state.newfarm.chainId);
    const {prov} = useProvider();
    const lib = library ? library : prov;

    let validSmartAddress: string;
    if (SMARTSWAPNFTSALES[ChainId as number] !== "0x") {
        validSmartAddress = SMARTSWAPNFTSALES[ChainId as number];
    }
    

    useEffect(() => {
        setLoading(true);
        console.log({ChainId,id})
        const fetchDetails = async () => {
            let nftArray
            if (chainId === SupportedChainId.POLYGONTEST || chainId === Number(SupportedChainId.POLYGON)) {
                nftArray = getNftTokenPolygon(id);
                setNftId(nftArray);

            } else if (chainId === SupportedChainId.BINANCETEST || chainId === Number(SupportedChainId.BINANCE)) {
                nftArray = getNftToken(id);
                setNftId(nftArray);
            }
    console.log({nftArray})
                    try {
                        const chain = chainId ?? ChainId
                        let url=`https://ipfs.io/ipfs/${IPFS[chain]}/${nftArray[0]}.json`
                        const data = await fetch(url);
                        const jsonData = await data.json();
                        const nftName = jsonData.name;
                        setName(nftName);

                        const imageArr = jsonData.image.split('/');
                        console.log({jsonData,nftName,chain})
                        let imageUrl;

                        if (ChainId === SupportedChainId.BINANCETEST) {
                            imageUrl = `https://ipfs.io/ipfs/${imageArr[2]}`;
                            // imageUrl = `https://ipfs.io/ipfs/Qmc52oSqkRbJi5w7et2JJaKzAMgkYFuveb7opiLxbDXnsr`
                        } else {
                            imageUrl = `https://ipfs.io/ipfs/${imageArr[2]}`;
                        }
                        setNftImage(imageUrl);
                        setLoading(false);

                    } catch (e) {
                        console.log(e);
                        setLoading(false);
                    }
        };
        fetchDetails();

    }, [ChainId, library,id]);

    return {name, nftImage, loading}

};
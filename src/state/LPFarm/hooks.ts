import { State } from "../types";
import { farmDataInterface } from "./reducer";
import { useSelector } from "react-redux";
import { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
    MasterChefNEWLPContract,
    LiquidityPairInstance,
    smartFactory,
    productStakingContract, smartSwapLPTokenPoolThree,
} from "../../utils/Contracts";
import {
    MASTERCHEFNEWLPADDRESSES,
    SMARTSWAPFACTORYADDRESSES,
    RGPADDRESSES,
    BUSD,
    USDT,
    USDC,
    PRODUCTSTAKINGADDRESSES, SMARTSWAPLP_TOKEN3ADDRESSES, SYMBOLS,
} from "../../utils/addresses";
import { getERC20Token } from "../../utils/utilsFunctions";
import { ethers } from "ethers";
import {
    updateYieldFarmDetails,
    updateNewFilterResult,
    updateNewSearchResult,
    updateProductFarmDetails,
} from "../newFarming/action";
import Web3 from "web3";
import {RootState} from "../index";
import {farmSection} from "../../pages/FarmingV2";

export const useNewLPData = (): farmDataInterface => {
    const farms = useSelector((state: State) => state.lpfarm);
    return farms;
};

interface updateFarmInterface {
    reload: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
    content: {
        id: number | undefined;
        img: string;
        deposit: string;
        symbol0: string;
        symbol1: string;
        earn: string;
        type: string;
        totalLiquidity: number;
        APY: number;
        address: string;
    };
    contractID: number;
    section: string;

}

const getBNBPrice = async (address: string, library: any) => {
    try {
        let BNBPrice;
        const pair = await smartSwapLPTokenPoolThree(
            address,
            library
        );
        const reserves = await pair.getReserves();
        const testNetPair = SMARTSWAPLP_TOKEN3ADDRESSES[97];

        // BUSD is token0 on testnet but token1 on mainnet, thus the reason to check
        // before calculating the price based on BUSD

        if (pair.address === testNetPair) {
            BNBPrice = ethers.utils.formatUnits(
                reserves[0].mul(1000).div(reserves[1]),
                3
            );
        } else {
            BNBPrice = ethers.utils.formatUnits(
                reserves[1].mul(1000).div(reserves[0]),
                3
            );
        }
        return Number(BNBPrice);

    } catch (e) {
        console.log('Could not fetch BNB Price.')
    }
};

export const useUpdateNewFarm = ({
                                  reload,
                                  setReload,
                                  content, contractID, section
                              }: updateFarmInterface) => {
    const data = useNewLPData();
    const searchSection = useSelector((state) => state.newFarming);

    const selectedField = useSelector((state: State) => state.farming.selectedField);
    const selected = selectedField === farmSection.SECOND_NEW_LP;
    const mainLP = selectedField === farmSection.NEW_LP;

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    const { account, chainId, library } = useWeb3React();
    const [loadingFarm, setLoadingState] = useState(false);

    const dispatch = useDispatch();

    const handleUpdateFarms = useCallback(
        (value) => {
            dispatch(
                section === "filter"
                    ? updateNewFilterResult({ farmData: value })
                    : section === "search"
                    ? updateNewSearchResult({ farmData: value })
                    : updateYieldFarmDetails({ value })
            );
        },
        [dispatch]
    );

    const calculateRigelPrice = async () => {
        try {
            let rgpPrice;
            const pair = await smartFactory(
                SMARTSWAPFACTORYADDRESSES[chainId as number],
                library
            );

            if (chainId === 56 || chainId === 97) {
                const pairAddress = await pair.getPair(
                    RGPADDRESSES[chainId as number],
                    BUSD[chainId as number]
                );
                const LpTokenContract = await LiquidityPairInstance(
                    pairAddress,
                    library
                );
                const token0Address = await LpTokenContract.token0();
                const token1Address = await LpTokenContract.token1();

                const [token0Contract, token1Contract] = await Promise.all([
                    getERC20Token(token0Address, library),
                    getERC20Token(token1Address, library),
                ]);

                const [decimal0, decimal1] = await Promise.all([
                    token0Contract.decimals(),
                    token1Contract.decimals(),
                ]);

                const reserves = await LpTokenContract.getReserves();
                const totalBUSD: number | any = ethers.utils.formatUnits(
                    token0Address === BUSD[chainId as number] ? reserves[0] : reserves[1],
                    token0Address === BUSD[chainId as number] ? decimal0 : decimal1
                );

                const totalRGP: number | any = ethers.utils.formatUnits(
                    token0Address === BUSD[chainId as number] ? reserves[1] : reserves[0],
                    token0Address === BUSD[chainId as number] ? decimal1 : decimal0
                );

                rgpPrice = totalBUSD / totalRGP;
            } else {
                const pairAddress = await pair.getPair(
                    RGPADDRESSES[chainId as number],
                    USDT[chainId as number]
                );
                const LpTokenContract = await LiquidityPairInstance(
                    pairAddress,
                    library
                );
                const token0Address = await LpTokenContract.token0();
                const token1Address = await LpTokenContract.token1();
                const [token0Contract, token1Contract] = await Promise.all([
                    getERC20Token(token0Address, library),
                    getERC20Token(token1Address, library),
                ]);
                const [symbol0, symbol1] = await Promise.all([
                    token0Contract.symbol(),
                    token1Contract.symbol(),
                ]);

                const [decimal0, decimal1] = await Promise.all([
                    token0Contract.decimals(),
                    token1Contract.decimals(),
                ]);
                const reserves = await LpTokenContract.getReserves();
                const totalUSDT: number | any = ethers.utils.formatUnits(
                    token0Address === USDT[chainId as number] ? reserves[0] : reserves[1],
                    token0Address === USDT[chainId as number] ? decimal0 : decimal1
                );
                const totalRGP: number | any = ethers.utils.formatUnits(
                    token0Address === USDT[chainId as number] ? reserves[1] : reserves[0],
                    token0Address === USDT[chainId as number] ? decimal1 : decimal0
                );
                rgpPrice = totalUSDT / totalRGP;
            }

            return rgpPrice;
        } catch (err) {
            console.log(err);
        }
    };

    const getLpTokenReserve = async (address: string) => {
        //this function gets the reserves of an LP token, it takes the LP token address as an argument
        try {
            const LpTokenContract = await LiquidityPairInstance(address, library);
            const [totalReserves, token0, token1, LPLockedPair, LPTotalSupply] = await Promise.all([
                LpTokenContract.getReserves(),
                LpTokenContract.token0(),
                LpTokenContract.token1(),
                LpTokenContract.balanceOf(MASTERCHEFNEWLPADDRESSES[chainId as number][contractID]),
                LpTokenContract.totalSupply()
            ]);

            const [token0Contract, token1Contract] = await Promise.all([
                getERC20Token(token0, library),
                getERC20Token(token1, library),
            ]);
            const [symbol0, decimals0, symbol1, decimals1] = await Promise.all([
                token0Contract.symbol(),
                token0Contract.decimals(),
                token1Contract.symbol(),
                token1Contract.decimals(),
            ]);
            return {
                reserves0: totalReserves[0],
                reserves1: totalReserves[1],
                tokenAddress0: token0,
                tokenAddress1: token1,
                symbol0,
                symbol1,
                decimals0,
                decimals1,
                LPSupply: LPLockedPair,
                LPTotalSupply
            };
        } catch (err) {
            console.log(err);
        }
    };

    const calculateLiquidityAndApy = async (reward: number | undefined) => {
        try {
            const masterchef = await MasterChefNEWLPContract(
                MASTERCHEFNEWLPADDRESSES[chainId as number][contractID],
                library
            );
            const LPInstance = await LiquidityPairInstance(content.address, library);
            const reserves = await getLpTokenReserve(content.address);
            const totalStable = reserves
                ? BUSD[chainId as number] === reserves.tokenAddress0 ||
                USDT[chainId as number] === reserves.tokenAddress0 ||
                USDC[chainId as number] === reserves.tokenAddress0
                    ? ethers.utils.formatUnits(
                        reserves.reserves0.toString(),
                        reserves.decimals0
                    )
                    : ethers.utils.formatUnits(
                        reserves.reserves1.toString(),
                        reserves.decimals1
                    )
                : "1";

            const totalBNB = reserves
                ? SYMBOLS['BNB'][chainId as number] === reserves.tokenAddress0
                    ? reserves.reserves0.toString()
                    : reserves.reserves1.toString()
                : "1";

            const rgpPrice = await calculateRigelPrice();
            const BNBPrice = await getBNBPrice(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number], library);

            const [token0, token1] = await Promise.all([
                getERC20Token(reserves && reserves.tokenAddress0, library),
                getERC20Token(reserves && reserves.tokenAddress1, library),
            ]);

            const [symbol0, symbol1] = await Promise.all([
                token0.symbol(),
                token1.symbol(),
            ]);

            const totalRGP = reserves
                ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
                    ? reserves.reserves0.toString()
                    : reserves.reserves1.toString()
                : "1";

            const totalLiquidity =
                symbol0 === "BUSD" ||
                symbol1 === "BUSD" ||
                symbol0 === "USDT" ||
                symbol1 === "USDT" ||
                symbol0 === "USDC" ||
                symbol1 === "USDC"
                    ? parseFloat(totalStable) * 2 :
                    symbol0 === "WBNB" || symbol1 === "WBNB"
                        ? parseFloat(ethers.utils.formatEther(totalBNB)) * BNBPrice * 2
                        : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;

            const LiquidityLocked = parseFloat(ethers.utils.formatEther(reserves.LPSupply)) / parseFloat(ethers.utils.formatEther(reserves.LPTotalSupply));

            const newLiquidity = (LiquidityLocked * totalLiquidity);

            const [poolInfo, totalAllocPoint] = await Promise.all([
                masterchef.poolInfo(content.id),
                masterchef.totalAllocPoint(),
            ]);
            const allocPoint = await poolInfo.allocPoint;
            const poolReward =
                (parseFloat(allocPoint.toString()) /
                    parseFloat(totalAllocPoint.toString())) *
                reward;
            const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;
            const newAPY = (rgpPrice * poolReward * 365 * 100) / newLiquidity;

            const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
                await Promise.all([
                    masterchef.pendingRigel(content.id, account),
                    masterchef.userInfo(content.id, account),
                    LPInstance.balanceOf(account),
                    LPInstance.allowance(
                        account,
                        MASTERCHEFNEWLPADDRESSES[chainId as number][contractID]
                    ),
                ]);
            const tokenStaked = await userInfo.amount;

            return {
                id: content.id,
                img: "rgp.svg",
                deposit: content.deposit,
                earn: "RGP",
                type: "LP",
                totalLiquidity,
                APY: newAPY,
                tokenStaked: [
                    `${content.symbol0}-${content.symbol1}`,
                    ethers.utils.formatEther(tokenStaked.toString()),
                ],
                RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
                availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
                poolAllowance: ethers.utils.formatEther(allowance.toString()),
                address: content.address,
                LPLocked: newLiquidity.toFixed(2),
            };
        } catch (err) {
            console.log(err);
        }
    };

    useMemo(async () => {
        if (data !== undefined && account) {
            if (reload) {
                setLoadingState(true);
                let newArray =
                    section === "search"
                        ? searchSection.newSearchResult !== undefined
                        ? [...searchSection.newSearchResult]
                        : [...searchSection.searchResult]
                        : section === "filter"
                        ? searchSection.newFilterResult !== undefined
                            ? [...searchSection.newFilterResult]
                            : [...searchSection.filterResult]
                        : searchSection.content !== undefined
                            ? [...searchSection.content]
                            : [...data.contents];

                const updatedFarm = await calculateLiquidityAndApy(
                    chainId === 137 || chainId === 80001
                        ? 2014.83125
                        : chainId === 56 || chainId === 97
                        ? 4300
                        : chainId === 42262 || chainId === 42261
                            ? 1343.220833
                            : undefined
                );
                const index = newArray.findIndex((item) => item.id === content.id);
                newArray[index] = updatedFarm;
                handleUpdateFarms(newArray);

                setLoadingState(false);
                setReload(false);
            }
        }
    }, [reload, stateChanged, chainId, selected, mainLP]);
    return { loadingFarm };
};

interface FetchYieldFarmDetails {
    content: {
        id: number | undefined;
        img: string;
        deposit: string;
        symbol0: string;
        symbol1: string;
        earn: string;
        type: string;
        totalLiquidity: number;
        APY: number;
        address: string;
    };
    section: string;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    contractID: number
}

export const useNewYieldFarmDetails = ({content, section, loading, setLoading, contractID}: FetchYieldFarmDetails) => {
    const data = useNewLPData();
    const searchSection = useSelector((state) => state.newFarming);
    const { account, chainId, library } = useWeb3React();
    // const [loading, setLoading] = useState(true);

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    const selectedField = useSelector((state: State) => state.farming.selectedField);
    const selected = selectedField === farmSection.SECOND_NEW_LP;
    const mainLP = selectedField === farmSection.NEW_LP;

    const dispatch = useDispatch();

    const handleUpdateFarms = useCallback(
        (value) => {
            dispatch(
                section === "filter"
                    ? updateNewFilterResult({ farmData: value })
                    : section === "search"
                    ? updateNewSearchResult({ farmData: value })
                    : updateYieldFarmDetails({ value })
            );
        },
        [dispatch]
    );

    const calculateRigelPrice = async () => {
        try {
            let rgpPrice;
            const pair = await smartFactory(
                SMARTSWAPFACTORYADDRESSES[chainId as number],
                library
            );

            if (chainId === 56 || chainId === 97) {
                const pairAddress = await pair.getPair(
                    RGPADDRESSES[chainId as number],
                    BUSD[chainId as number]
                );
                const LpTokenContract = await LiquidityPairInstance(
                    pairAddress,
                    library
                );
                const token0Address = await LpTokenContract.token0();
                const token1Address = await LpTokenContract.token1();

                const [token0Contract, token1Contract] = await Promise.all([
                    getERC20Token(token0Address, library),
                    getERC20Token(token1Address, library),
                ]);

                const [decimal0, decimal1] = await Promise.all([
                    token0Contract.decimals(),
                    token1Contract.decimals(),
                ]);

                const reserves = await LpTokenContract.getReserves();
                const totalBUSD: number | any = ethers.utils.formatUnits(
                    token0Address === BUSD[chainId as number] ? reserves[0] : reserves[1],
                    token0Address === BUSD[chainId as number] ? decimal0 : decimal1
                );

                const totalRGP: number | any = ethers.utils.formatUnits(
                    token0Address === BUSD[chainId as number] ? reserves[1] : reserves[0],
                    token0Address === BUSD[chainId as number] ? decimal1 : decimal0
                );

                rgpPrice = totalBUSD / totalRGP;
            } else {
                const pairAddress = await pair.getPair(
                    RGPADDRESSES[chainId as number],
                    USDT[chainId as number]
                );
                const LpTokenContract = await LiquidityPairInstance(
                    pairAddress,
                    library
                );
                const token0Address = await LpTokenContract.token0();
                const token1Address = await LpTokenContract.token1();
                const [token0Contract, token1Contract] = await Promise.all([
                    getERC20Token(token0Address, library),
                    getERC20Token(token1Address, library),
                ]);
                const [symbol0, symbol1] = await Promise.all([
                    token0Contract.symbol(),
                    token1Contract.symbol(),
                ]);

                const [decimal0, decimal1] = await Promise.all([
                    token0Contract.decimals(),
                    token1Contract.decimals(),
                ]);
                const reserves = await LpTokenContract.getReserves();
                const totalUSDT: number | any = ethers.utils.formatUnits(
                    token0Address === USDT[chainId as number] ? reserves[0] : reserves[1],
                    token0Address === USDT[chainId as number] ? decimal0 : decimal1
                );
                const totalRGP: number | any = ethers.utils.formatUnits(
                    token0Address === USDT[chainId as number] ? reserves[1] : reserves[0],
                    token0Address === USDT[chainId as number] ? decimal1 : decimal0
                );
                rgpPrice = totalUSDT / totalRGP;
            }

            return rgpPrice;
        } catch (err) {
            console.log(err);
        }
    };

    const getLpTokenReserve = async (address: string) => {
        //this function gets the reserves of an LP token, it takes the LP token address as an argument
        try {
            const LpTokenContract = await LiquidityPairInstance(address, library);
            const [totalReserves, token0, token1, LPLockedPair, LPTotalSupply] = await Promise.all([
                LpTokenContract.getReserves(),
                LpTokenContract.token0(),
                LpTokenContract.token1(),
                LpTokenContract.balanceOf(MASTERCHEFNEWLPADDRESSES[chainId as number][contractID]),
                LpTokenContract.totalSupply()
            ]);

            const [token0Contract, token1Contract] = await Promise.all([
                getERC20Token(token0, library),
                getERC20Token(token1, library),
            ]);
            const [symbol0, decimals0, symbol1, decimals1] = await Promise.all([
                token0Contract.symbol(),
                token0Contract.decimals(),
                token1Contract.symbol(),
                token1Contract.decimals(),
            ]);
            return {
                reserves0: totalReserves[0],
                reserves1: totalReserves[1],
                tokenAddress0: token0,
                tokenAddress1: token1,
                symbol0,
                symbol1,
                decimals0,
                decimals1,
                LPSupply: LPLockedPair,
                LPTotalSupply
            };
        } catch (err) {
            console.log(err);
        }
    };

    const calculateLiquidityAndApy = async (reward: number | undefined) => {
        try {
            const masterchef = await MasterChefNEWLPContract(
                MASTERCHEFNEWLPADDRESSES[chainId as number][contractID],
                library
            );
            const LPInstance = await LiquidityPairInstance(content.address, library);
            const reserves = await getLpTokenReserve(content.address);
            const totalStable = reserves
                ? BUSD[chainId as number] === reserves.tokenAddress0 ||
                USDT[chainId as number] === reserves.tokenAddress0 ||
                USDC[chainId as number] === reserves.tokenAddress0
                    ? ethers.utils.formatUnits(
                        reserves.reserves0.toString(),
                        reserves.decimals0
                    )
                    : ethers.utils.formatUnits(
                        reserves.reserves1.toString(),
                        reserves.decimals1
                    )
                : "1";

            const rgpPrice = await calculateRigelPrice();
            const BNBPrice = await getBNBPrice(SMARTSWAPLP_TOKEN3ADDRESSES[chainId as number], library);

            const [token0, token1] = await Promise.all([
                getERC20Token(reserves && reserves.tokenAddress0, library),
                getERC20Token(reserves && reserves.tokenAddress1, library),
            ]);

            const [symbol0, symbol1] = await Promise.all([
                token0.symbol(),
                token1.symbol(),
            ]);

            const totalRGP = reserves
                ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
                    ? reserves.reserves0.toString()
                    : reserves.reserves1.toString()
                : "1";

            const totalBNB = reserves
                ? SYMBOLS['BNB'][chainId as number] === reserves.tokenAddress0
                    ? reserves.reserves0.toString()
                    : reserves.reserves1.toString()
                : "1";

            const totalLiquidity =
                symbol0 === "BUSD" ||
                symbol1 === "BUSD" ||
                symbol0 === "USDT" ||
                symbol1 === "USDT" ||
                symbol0 === "USDC" ||
                symbol1 === "USDC"
                    ? parseFloat(totalStable) * 2 :
                    symbol0 === "WBNB" || symbol1 === "WBNB"
                        ? parseFloat(ethers.utils.formatEther(totalBNB)) * BNBPrice * 2
                        : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;

            const LiquidityLocked = parseFloat(ethers.utils.formatEther(reserves.LPSupply)) / parseFloat(ethers.utils.formatEther(reserves.LPTotalSupply));
            const newLiquidity = (LiquidityLocked * totalLiquidity);

            const [poolInfo, totalAllocPoint] = await Promise.all([
                masterchef.poolInfo(content.id),
                masterchef.totalAllocPoint(),
            ]);
            const allocPoint = await poolInfo.allocPoint;
            const poolReward =
                (parseFloat(allocPoint.toString()) /
                    parseFloat(totalAllocPoint.toString())) *
                reward;
            const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;
            const newAPY = (rgpPrice * poolReward * 365 * 100) / newLiquidity;


            const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
                await Promise.all([
                    masterchef.pendingRigel(content.id, account),
                    masterchef.userInfo(content.id, account),
                    LPInstance.balanceOf(account),
                    LPInstance.allowance(
                        account,
                        MASTERCHEFNEWLPADDRESSES[chainId as number][contractID]
                    ),
                ]);
            const tokenStaked = await userInfo.amount;

            return {
                id: content.id,
                img: "rgp.svg",
                deposit: content.deposit,
                earn: "RGP",
                type: "LP",
                totalLiquidity,
                APY: newAPY,
                tokenStaked: [
                    `${content.symbol0}-${content.symbol1}`,
                    ethers.utils.formatEther(tokenStaked.toString()),
                ],
                RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
                availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
                poolAllowance: ethers.utils.formatEther(allowance.toString()),
                address: content.address,
                LPLocked: newLiquidity.toFixed(2)
            };
        } catch (err) {
            console.log(err);
        }
    };

    useMemo(async () => {
        if (data !== undefined && account) {
            setLoading(true);
            let newArray =
                section === "search"
                    ? searchSection.newSearchResult !== undefined
                    ? [...searchSection.newSearchResult]
                    : [...searchSection.searchResult]
                    : section === "filter"
                    ? searchSection.newFilterResult !== undefined
                        ? [...searchSection.newFilterResult]
                        : [...searchSection.filterResult]
                    : searchSection.content !== undefined
                        ? [...searchSection.content]
                        : [...data.contents];

            const updatedFarm = await calculateLiquidityAndApy(
                chainId === 137 || chainId === 80001
                    ? 2014.83125
                    : chainId === 56 || chainId === 97
                    ? 4300
                    : chainId === 42262 || chainId === 42261
                        ? 1343.220833
                        : undefined
            );
            const index = newArray.findIndex((item) => item.id === content.id);

            newArray[index] = updatedFarm;

            console.log("updated", newArray);

            handleUpdateFarms(newArray);

            setLoading(false);
        }
    }, [account, stateChanged, chainId, selected, mainLP]);
    return { loading };
};

interface productFarmState {
    content: {
        feature:string,
        percentageProfitShare:string,
        profitTimeLine:string,
        totalLiquidity:string,
        estimatedTotalProfit:string,
        pid:number,
        deposit:string,
        poolAllowance: "",
        type:string
    };
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const useProductFarmDetails = ({
                                          content,
                                          loading,
                                          setLoading
                                      }:productFarmState) =>{
    const { account, chainId, library } = useWeb3React();
    const getUserValue = async ()=> {
        const productFarm = await productStakingContract(
            PRODUCTSTAKINGADDRESSES[chainId as number],
            library
        );
        const [ userInfo, FarmTokenBalance] =
            await Promise.all([
                productFarm.userInfo(account),
                productFarm.userData(account),
            ]);
        const tokenStaked = await FarmTokenBalance.tokenQuantity;

        return {
            feature:"AutoTrade",
            percentageProfitShare:"25%",
            profitTimeLine:"6 months",
            totalLiquidity:"188839",
            estimatedTotalProfit:"929020003",
            deposit: "RGP",
            pid:93903,
            poolAllowance: "",
            type:"AT",
            tokenStaked: Web3.utils.fromWei(tokenStaked.toString())
        };
    }

    useMemo(async ()=>{
        let response =await getUserValue()

        updateProductFarmDetails({value:[response]})

        setLoading(false)
    },[])
    return {loading}

}

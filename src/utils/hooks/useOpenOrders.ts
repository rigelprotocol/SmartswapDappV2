import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { timeConverter, getTokenSymbol, formatAmount,  } from "./useAccountHistory";
import {  MARKETAUTOSWAPADDRESSES, SMARTSWAPROUTER, WNATIVEADDRESSES } from "../addresses";
import { getERC20Token } from '../utilsFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { useLocation } from 'react-router-dom';
import { useNativeBalance } from './useBalances';import { SupportedChainName, SupportedChainSymbols } from '../constants/chains';
;


const abiDecoder = require('abi-decoder');

interface DataIncoming {
    inputAmount: string,
    outputAmount: string,
    tokenIn: string,
    tokenOut: string,
    time: string,
    name: string,
    frequency: string,
    id: string,
    transactionHash: string,
    error: [],
    status: number,
    currentToPrice?: string,
    chainID?:string,
    situation?:string,
    expectedUserPrice?:string
    market?:string
}

const useOpenOrders = (socket:any) => {
    const { account, chainId, library } = useWeb3React();
    const [loadOpenOrders, setloadOpenOrders] = useState(false);
    const [openOrderData, setopenOrderData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState("swap")
    const [URL, setURL] = useState("https://autoswap-server.herokuapp.com")
    const [contractAddress, setContractAddress] = useState(SMARTSWAPROUTER[chainId as number])
    const refreshPage = useSelector((state: RootState) => state.transactions.refresh);
    const location = useLocation().pathname;
    const [, Symbol, Name,] = useNativeBalance()
    function decodeInput(input: string, ABI: any) {
        abiDecoder.addABI(ABI);
        let decoder = abiDecoder.decodeMethod(input);
        return decoder
    }
    useEffect(() => {
       
        if (location.includes("autotrade")) {
            setLocationData("auto")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
             let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : "Pancakeswap" 
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        } else if (location.includes("set-price")) {
            setLocationData("price")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85") 
            let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : "Pancakeswap" 
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        } else {
       
        }
    }, [location, chainId])
    useEffect(() => {
        if (location.includes("autotrade")) {
            setLocationData("auto")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : chainId ===43114? "Tradejoe" :  "Pancakeswap" 
            console.log({market})
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        } else if (location.includes("set-price")) {
            setLocationData("price")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85") 
            let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : chainId ===43114? "Tradejoe" :  "Pancakeswap" 
            console.log({market})
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        }else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
    }, [chainId, account,location, contractAddress,refreshPage,locationData]);
   
    useEffect(() => {
        getOpenOrders();
    }, [chainId, account, contractAddress,refreshPage,locationData]);
    useEffect(() => {
        socket?.on("success",()=>{
            getOpenOrders();
        })
        
    }, [socket,account]);

    const tokenList = async (addressName: string) => {
        const token = await getERC20Token(addressName, library);
        const name = token.name();
        const symbol = token.symbol();
        const { address } = token;
        const decimals = token.decimals();
        const standardToken = await Promise.all([name, symbol, address, decimals]);
        const resolveToken = {
            name: standardToken[0],
            symbol: standardToken[1],
            address: standardToken[2],
            decimals: standardToken[3]
        };
        return address !== '0x' ? resolveToken : null;
    };
    
    const getTransactionFromDatabase = async (address: string) => {
        const data = await fetch(`${URL}/auto/data/all/${address}`)
        const transaction = await data.json()
        const transactions = transaction[0].transaction.filter((item:any)=>item.status===2 || item.status===3)
        return transactions
    }



        const getOpenOrders = async () => {
            if ((account && locationData)) {
                setloadOpenOrders(true);
                try {
                    let dataToUse =[]
                    const transaction = await getTransactionFromDatabase(account)
                    if (transaction.length > 0) {
                        let data = []
                        if (locationData === "auto") {
                            data = transaction.filter((data: any) => data.typeOfTransaction === "Auto Time")
                        }else if (locationData === "price") {
                            data = transaction.filter((data: any) => data.typeOfTransaction === "Set Price")
                            
                        }
                        const result = data.filter((item:any)=>item.errorArray.length===0 && item.transactionHash === "" && parseInt(item.chainID) === chainId)
                        dataToUse = await Promise.all(result.map(async (data: any) => {
                            return {
                                inputAmount: data.amountToSwap,
                                outputAmount: data.userExpectedPrice,
                                tokenIn: data.swapFromToken,
                                tokenOut: data.swapToToken,
                                time: data.time && timeConverter(parseInt(data.time)),
                                name: data ? data.typeOfTransaction : "",
                                frequency: data ? data.frequency : "--",
                                id: data ? data.id : "",
                                transactionHash: data.transactionHash,
                                error: data.errorArray,
                                status: data.status,
                                currentToPrice: data.typeOfTransaction === "Set Price" ? data.currentToPrice : data.percentageChange,
                                chainID:data.chainID ,
                                rate:`${data.currentNumber} / ${data.totalNumberOfTransaction}`,
                                initialFromPrice:data.initialFromPrice,
                                initialToPrice:data.initialToPrice,
                                situation:data.situation,
                                _id:data._id,
                                pathSymbol:data.pathSymbol,
                                market:data.market,
                                orderID:data.orderID,
                                totalTransaction:data.totalNumberOfTransaction
                            }
                        })
                        )
                    
                }
                const marketSwap = await Promise.all(
                    dataToUse.map(async (data: any) => ({
                        tokenIn: data.tokenIn === "native" ? {
                            name: SupportedChainName[data.chainID],
                            symbol: SupportedChainSymbols[data.chainID],
                            address: WNATIVEADDRESSES[chainId as number],
                            decimals: 18
                        } : await tokenList(data.tokenIn),
                        tokenOut: data.tokenOut === "native" ? {
                            name: SupportedChainName[data.chainID],
                            symbol: SupportedChainSymbols[data.chainID],
                            address: WNATIVEADDRESSES[chainId as number],
                            decimals: 18
                        } : await tokenList(data.tokenOut),
                        amountIn: data.inputAmount,
                        amountOut: data.outputAmount,
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID,
                        rate:data.rate,
                        situation:data.situation,
                        initialFromPrice:data.initialFromPrice,
                        initialToPrice:data.initialToPrice,
                        _id:data._id,
                        pathSymbol:data.pathSymbol,
                        market:data.market,
                        orderID:data.orderID,
                        totalTransaction:data.totalTransaction
                    })),
                );
                console.log({marketSwap})
                    const marketHistory = marketSwap.map((data) => ({
                        token1Icon:data.tokenIn &&
                            getTokenSymbol(data.tokenIn.symbol),
                        token2Icon:
                            data.tokenOut && getTokenSymbol(data.tokenOut.symbol),
                        token1: data.tokenIn,
                        token2: data.tokenOut,
                        amountIn: data.tokenIn &&  data.tokenIn?.name === SupportedChainName[data.chainID as number]  ? parseFloat(formatAmount(data.amountIn, data.tokenIn.decimals)) / data.totalTransaction : data.tokenIn &&  formatAmount(data.amountIn, data.tokenIn.decimals),
                        amountOut:  parseFloat(data.amountOut).toFixed(4),
        
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID,
                        rate:data.rate,
                        situation:data.situation,
                        initialFromPrice:data.initialFromPrice,
                        initialToPrice:data.initialToPrice,
                        _id:data._id,
                        pathSymbol:data.pathSymbol,
                        market:data.market,
                        orderID:data.orderID,
                    }));
                    setopenOrderData(marketHistory);
                    setloadOpenOrders(false);

                } catch (e) {
                    console.log(e);
                    setopenOrderData({});
                    setloadOpenOrders(false);
                }
            } else {
                console.log('Connect your wallet')
            }

        };
    return { openOrderData, loadOpenOrders };

};

export default useOpenOrders;
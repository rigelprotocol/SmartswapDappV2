import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import { timeConverter, getTokenSymbol, formatAmount, APIENDPOINT, APIKEY } from "./useAccountHistory";
import {  MARKETAUTOSWAPADDRESSES, SMARTSWAPROUTER, WNATIVEADDRESSES } from "../addresses";
import { getERC20Token } from '../utilsFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { useLocation } from 'react-router-dom';
import { useNativeBalance } from './useBalances';
import { SmartSwapRouter } from '../Contracts';
import { SupportedChainName, SupportedChainSymbols } from '../constants/chains';



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
    chainID:string,
    market:string
}

const useMarketHistory = (socket:any) => {
    const { account, chainId, library } = useWeb3React();
    const [loadMarketData, setLoadMarketData] = useState(false);
    const [marketHistoryData, setMarketHistoryData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState("swap")
    const [URL, setURL] = useState("https://autoswap-server.herokuapp.com")//
    const [contractAddress, setContractAddress] = useState(SMARTSWAPROUTER[chainId as number])

    const api = APIENDPOINT[chainId as number];
    const apikey = APIKEY[chainId as number];
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
            let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : "Pancakeswap" 
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        } else if (location.includes("set-price")) {
            setLocationData("price")
            let market =location.split("/").length >= 3 ?  location.split("/")[2].charAt(0).toUpperCase() + location.split("/")[2].slice(1) : "Pancakeswap" 
            setContractAddress(MARKETAUTOSWAPADDRESSES[market][chainId as number])
        } else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
    }, [location, chainId])
    useEffect(() => {
        getMarketData();
    }, [chainId, account, contractAddress,refreshPage,locationData]);

    useEffect(() => {
        socket?.on("success",()=>{
            getMarketData();
        })
        
    }, [socket]);

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
    const getTransactionFromDatabase = async () => {
        const data = await fetch(`${URL}/auto/transactions`)

        const transaction = await data.json()
       const transactions = transaction.reduce((array:any,item:any)=>{
            const successfullyTransaction = item.transaction.filter((x:any) => x.transactionHash !== "" && x.status===1)
            return [...array,...successfullyTransaction]
       },[]).reverse()
        return transactions
    }



        const getMarketData = async () => {
            if ((account && contractAddress && locationData)) {
                setLoadMarketData(true);
                try {
                    let dataToUse = []
                    if( location.includes("/swap")){
                    const uri = `https://${api}?module=account&action=txlist&address=${contractAddress}&startblock=0
                    &endblock=latest&sort=desc&apikey=${apikey}`;

                    const data = await fetch(uri);
                    const jsonData = await data.json();


                    const filteredData = jsonData.result
                        .filter((items: any) => decodeInput(items.input,SmartSwapRouter02) !== undefined && items.isError !== "1")
                        .map((items: any) => ({
                            transactionObj: decodeInput(items.input,SmartSwapRouter02).params,
                            timestamp: items.timeStamp,
                            value: items.value,
                            from: items.from,
                            to: items.to,
                            transactionHash: items.transactionHash,
                        status: 10,
                        chainID:items.chainID,
                        market:"",
                        orderID:""
                        }));


                    const marketData = filteredData.map((data: any) => ({
                        inputAmount:
                            Number(data.value) > 0 ? data.value : data.transactionObj[0].value,
                        outputAmount:
                            Number(data.value) > 0
                                ? data.transactionObj[0].value
                                : data.transactionObj[1].value,
                        tokenIn:
                            Number(data.value) > 0
                                ? data.transactionObj[1].value[0]

                                : data.transactionObj[2].value[0],
                        tokenOut:
                            Number(data.value) > 0
                                ? data.transactionObj[1].value[data.transactionObj[1].value.length - 1]
                                : data.transactionObj[2].value[data.transactionObj[2].value.length - 1],
                        time: timeConverter(data.timestamp),
                        from: data.from,
                        to: data.to,
                        chainID:chainId,
                        market:"",
                        orderID:""
                    }));

                    dataToUse = marketData.length > 5 ? marketData.splice(0, 5) : marketData;

                   
    
                }else if ( location.includes("autotrade") || location.includes("set-price")){
                    const transaction = await getTransactionFromDatabase()
                    if (transaction.length > 0) {
                        let result = []
                        if (locationData === "auto") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Auto Time")
                            .sort((a: any, b: any) => b.time - a.time)
                            result = data.filter((item:any)=>item.status===1 && parseInt(item.chainID) === chainId)
                        }else if (locationData === "price") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Set Price")
                            .sort((a: any, b: any) => b.time - a.time)
                            result = data.filter((item:any)=>item.status===1 && parseInt(item.chainID) === chainId)
                        }
                        dataToUse = await Promise.all(result.map(async (data: any) => {
                            // try{
                                
    
                                let dataBase = {
                                    inputAmount: data.amountToSwap,
                                    outputAmount:data.actualToPrice,
                                    tokenIn: data.swapFromToken,
                                    tokenOut: data.swapToToken,
                                    time: data.time && timeConverter(parseInt(data.time)),
                                    name: data ? data.typeOfTransaction : "",
                                    frequency: data ? data.frequency : "--",
                                    id: data ? data.id : "",
                                    transactionHash: data.transactionHash,
                                    error: data.errorArray,
                                    status: data.status,
                                    orderID:data.orderID,
                                    currentToPrice: data.typeOfTransaction === "Set Price" ? data.currentToPrice : data.percentageChange,
                                    chainID:data.chainID ,
                                    pathSymbol:data.pathSymbol,
                                    market:data.market,
                                    totalTransaction:data.totalNumberOfTransaction
                                    
                                }
                                return dataBase
                            // }catch(e){
                            //     console.log(e)
                            // }
                            
                        })
                        )
                    }
                }
                const marketSwap = await Promise.all(
                    dataToUse.map(async (data: any) => {
                        let item ={
                            tokenIn: data?.tokenIn === "native" ? {
                                name: SupportedChainName[data.chainID as number],
                                symbol: SupportedChainSymbols[data.chainID as number],
                                address: WNATIVEADDRESSES[data.chainID as number],
                                decimals: 18
                            } : await tokenList(data?.tokenIn),
                            tokenOut: data.tokenOut === "native" ? {
                                name: SupportedChainName[data.chainID as number],
                                symbol: SupportedChainSymbols[data.chainID as number],
                                address: WNATIVEADDRESSES[data.chainID as number],
                                decimals: 18
                            } : await tokenList(data.tokenOut),
                            amountIn: data.inputAmount,
                            amountOut: data.outputAmount,
                            time: data.time,
                            name: data.name,
                            frequency: data.frequency,
                            id: data.id,
                            orderID:data.orderID,
                            transactionHash: data.transactionHash,
                            error: data.error,
                            status: data.status,
                            currentToPrice: data.currentToPrice,
                            chainID:data.chainID,
                            pathSymbol:data.pathSymbol,
                            market:data.market,
                            totalTransaction:data.totalTransaction
                        }
                        return item
                        
                    }),
                );
                    const marketHistory = marketSwap.map((data) => ({
                        token1Icon:
                            getTokenSymbol(data.tokenIn.symbol),
                        token2Icon:
                            getTokenSymbol(data.tokenOut.symbol),
                        token1: data.tokenIn,
                        token2: data.tokenOut,
                        amountIn: data.tokenIn.name === SupportedChainName[data.chainID as number] ? parseInt(formatAmount(data.amountIn, data.tokenIn.decimals)) /data.totalTransaction  : formatAmount(data.amountIn, data.tokenIn.decimals),
                        amountOut: data.name ==="Set Price" || data.name==="Auto Time" ? parseFloat(data.amountOut).toFixed(4) : formatAmount(data.amountOut, data.tokenOut.decimals),
        
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID,
                        pathSymbol:data.pathSymbol,
                        market:data.market,
                        orderID:data.orderID,
                    }));

                    setMarketHistoryData(marketHistory);
                    setLoadMarketData(false);

                } catch (e) {
                    console.log(e);
                    setMarketHistoryData({});
                    setLoadMarketData(false);
                }
            } else {
                console.log('Connect your wallet')
            }

        };
    return { marketHistoryData, loadMarketData };

};

export default useMarketHistory;
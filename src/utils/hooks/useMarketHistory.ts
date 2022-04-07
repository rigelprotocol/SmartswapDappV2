import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import { timeConverter, getTokenSymbol, formatAmount, APIENDPOINT, APIKEY } from "./useAccountHistory";
import { AUTOSWAPV2ADDRESSES, SMARTSWAPROUTER, WNATIVEADDRESSES } from "../addresses";
import { getERC20Token } from '../utilsFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { useLocation } from 'react-router-dom';
import { useNativeBalance } from './useBalances';
import { SmartSwapRouter } from '../Contracts';
import { ethers } from 'ethers';


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
    chainID?:string
}

const useMarketHistory = () => {
    const { account, chainId, library } = useWeb3React();
    const [loadMarketData, setLoadMarketData] = useState(false);
    const [marketHistoryData, setMarketHistoryData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState("swap")
    const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
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
        if (location === "/auto-time") {
            setLocationData("auto")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else if (location === "/set-price") {
            setLocationData("price")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
    }, [location, chainId])
    useEffect(() => {
        // setURL("http://localhost:7000")
        getMarketData();
    }, [chainId, account, contractAddress,refreshPage,locationData]);

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
        console.log({URL})
        const data = await fetch(`${URL}/auto/transactions`)

        const transaction = await data.json()
       const transactions = transaction.reduce((array:any,item:any)=>{
            const successfullyTransaction = item.transaction.filter((x:any) => x.transactionHash !== "" && x.status===1)
            return [...array,...successfullyTransaction]
       },[]).reverse()
       console.log({transactions})
        return transactions
    }



        const getMarketData = async () => {
            if ((account && contractAddress && locationData)) {
                setLoadMarketData(true);
                try {
                    let dataToUse = []
                    if( location === "/swap"){
                    
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
                        chainID:items.chainID 
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
                        to: data.to
                    }));

                    dataToUse = marketData.length > 5 ? marketData.splice(0, 5) : marketData;

                   
    
                }else if ( location === "/auto-time" || location === "/set-price"){
                    const transaction = await getTransactionFromDatabase()
                    console.log({transaction})
                    if (transaction.length > 0) {
                        let result = []
                        if (locationData === "auto") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Auto Time")
                            result = data.filter((item:any)=>item.status===1)
                        }else if (locationData === "price") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Set Price")
                            // .sort((a: any, b: any) => new Date(b.time * 1000) - new Date(a.time * 1000))
                            result = data.filter((item:any)=>item.status===1)
                        }
                        console.log({result})
                        dataToUse = await Promise.all(result.map(async (data: any) => {
                            let fromAddress = data.swapFromToken === "native" ? WNATIVEADDRESSES[chainId as number] : data.swapFromToken
                            let toAddress = data.swapToToken === "native" ? WNATIVEADDRESSES[chainId as number] : data.swapToToken
                            const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number], library);
                            const toPriceOut = await rout.getAmountsOut(
                                data.amountToSwap,
                                [fromAddress, toAddress]
                            );
                            return {
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
                                currentToPrice: data.typeOfTransaction === "Set Price" ? data.currentToPrice : data.percentageChange,
                                chainID:data.chainID 
                                
                            }
                        })
                        )
                    }
                }
                console.log({dataToUse})
                const marketSwap = await Promise.all(
                    dataToUse.map(async (data: any) => ({
                        tokenIn: data.tokenIn === "native" ? {
                            name: Name,
                            symbol: Symbol,
                            address: WNATIVEADDRESSES[chainId as number],
                            decimals: 18
                        } : await tokenList(data.tokenIn),
                        tokenOut: data.tokenOut === "native" ? {
                            name: Name,
                            symbol: Symbol,
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
                        chainID:data.chainID 
                    })),
                );
                    const marketHistory = marketSwap.map((data) => ({
                        token1Icon:
                            getTokenSymbol(data.tokenIn.symbol),
                        token2Icon:
                            getTokenSymbol(data.tokenOut.symbol),
                        token1: data.tokenIn,
                        token2: data.tokenOut,
                        amountIn: formatAmount(data.amountIn, data.tokenIn.decimals),
                        amountOut: data.name ==="Set Price" || data.name==="Auto Time" ? parseFloat(data.amountOut).toFixed(4) : formatAmount(data.amountOut, data.tokenOut.decimals),
        
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID 
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
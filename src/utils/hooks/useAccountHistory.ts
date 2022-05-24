import { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import mainToken from '../../utils/main-token.json';
import TokenLogo from '../../assets/Null-24.svg';
import { getERC20Token } from "../utilsFunctions";
import { ethers } from 'ethers';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state";
import { useLocation } from 'react-router-dom';
import { SMARTSWAPROUTER, AUTOSWAPV2ADDRESSES, RGPADDRESSES, WNATIVEADDRESSES, AUTOSWAPSTATEADDRESSES } from "../addresses";
import Web3 from 'web3';
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { ParseFloat } from '..';
import { notificationTab } from '../../state/transaction/actions';
import { ZERO_ADDRESS } from '../../constants';

const abiDecoder = require('abi-decoder');

export function timeConverter(UNIX_timestamp: any) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    const min = a.getMinutes()<10 ? `0${a.getMinutes()}` : a.getMinutes();
    const sec = a.getSeconds() < 10 ? `0${a.getSeconds()}` : a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}

export const APIENDPOINT: { [key: string]: string } = {
    "1": "",
    "3": "",
    "56": "api.bscscan.com/api",
    "97": "api-testnet.bscscan.com/api",
    "137": "api.polygonscan.com/api",
    "80001": "api-testnet.polygonscan.com/api",
    "42261": "testnet.explorer.emerald.oasis.dev/api",
    "42262": "explorer.emerald.oasis.dev/api",
};

export const APIKEY: { [key: string]: string } = {
    "1": "",
    "3": "",
    "56": "AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD",
    "97": "AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD",
    "137": "89B4F6NVVEVGC8EMDCJVRJMVGSCVHHZTR7",
    "80001": "89B4F6NVVEVGC8EMDCJVRJMVGSCVHHZTR7",
    "42261": "",
    "42262": "",
};

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
    initialFromPrice?:string,
    initialToPrice?:string,
    situation?:string,
    pathSymbol?:string,
    market?:string
}
let web3 = new Web3(Web3.givenProvider);
export const formatAmount = (number: string, decimals: any) => {
    const num = ethers.BigNumber.from(number).toString();
    let res = ethers.utils.formatUnits(num, decimals)
    res = ParseFloat(res, 3)
    return res;
};

export const getTokenSymbol = (symbol: string) => {
    const tokenList = mainToken;
    let tokenIcon = tokenList.find(token => token.symbol === symbol);

    if (!tokenIcon) {
        return TokenLogo
    }

    return tokenIcon.logoURI
};




const useAccountHistory = (socket:any) => {
    const { account, chainId, library } = useWeb3React();
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState("swap")
    const [URL, setURL] = useState("https://autoperiod.rigelprotocol.com")//
    const dispatch =useDispatch()
    const [contractAddress, setContractAddress] = useState(SMARTSWAPROUTER[chainId as number])
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
        console.log({resolveToken})
        return address !== '0x' ? resolveToken : null;
    };




    function decodeInput(input: string, ABI: any) {
        abiDecoder.addABI(ABI);
        let decoder = abiDecoder.decodeMethod(input);
        return decoder
    }
   const refreshPage = useSelector((state: RootState) => state.transactions.refresh);
    const location = useLocation().pathname;
    const [, Symbol, Name,] = useNativeBalance()
    useEffect(() => {
        if (location.includes("auto-period")) {
            setLocationData("auto")
            setStateAccount(AUTOSWAPSTATEADDRESSES[chainId as number])
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else if (location.includes("set-price")) {
            setLocationData("price")
            setStateAccount(AUTOSWAPSTATEADDRESSES[chainId as number])
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
        loadAccountHistory();
    }, [chainId, account,location, contractAddress,refreshPage,locationData]);
   
    useEffect(() => {
        socket?.on("success",()=>{
            loadAccountHistory();
        })
        socket?.on("cleared",(page:string)=>{
            if(page==="auto"){
               dispatch(notificationTab({ autoTimeNotification:0})) 
            }else{
                dispatch(notificationTab({ setPriceNotification:0})) 
            }
            
        })
        
    }, [socket]);

    const getTransactionFromDatabase = async (address: string) => {
        const data = await fetch(`${URL}/auto/data/all/${address}`)
        const trans = await fetch(`${URL}/auto`)
        const transaction = await data.json()
        const database = await trans.json()
        return { transaction, database }
    }
    const api = APIENDPOINT[chainId as number];
    const apikey = APIKEY[chainId as number];
    const loadAccountHistory = async () => {
        if (account && contractAddress && locationData) {
            setLoading(true);
            try {
            let userData = []
            if (location.includes("swap")) {
                const uri = `https://${api}?module=account&action=txlist&address=${account}&startblock=0
                &endblock=latest&sort=desc&apikey=${apikey}`;

                const data = await fetch(uri);
                const jsondata = await data.json();
                const SwapTrx = jsondata.result.filter((item: any) => item.to == contractAddress);
                
                const dataFiltered = SwapTrx
                    .filter((items: any) => decodeInput(items.input, SmartSwapRouter02) !== undefined) // && items.transactionHash !== "1"
                    .map((items: any) => (
                        {
                        value: items.value,
                        transactionObj: decodeInput(items.input, SmartSwapRouter02).params,
                        timestamp: items.timeStamp,
                        transactionFee: items.gasPrice * items.gasUsed,
                        // name: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).name,
                        transactionHash: items.hash,
                        status: 10,
                        chainID:items.chainID 
                    }));

                const dataToUse = dataFiltered.length > 5 ? dataFiltered.splice(0, 5) : dataFiltered;
                userData = dataToUse.map((data: any) => ({
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
                    // name: data.name,
                    frequency: "--",
                    id: "",
                    transactionHash: data.transactionHash,
                    error: [],
                    status: "10",
                    situation:"",
                    chainID:chainId
                }));
            } else if ( location.includes("auto-period") || location.includes("set-price")) {
                const { transaction, database } = await getTransactionFromDatabase(account)
                if (transaction.length > 0) {
                    
                    dispatch(notificationTab({ 
                    autoTimeNotification:transaction[0].autoTimeNotification,
                    setPriceNotification:transaction[0].setPriceNotification,
                    address:transaction[0].address }))
                    const collapsedTransaction = transaction[0].transaction
                    let result = []
                    if (locationData === "auto") {
                        result = collapsedTransaction.filter((data: any) => data.typeOfTransaction === "Auto Time")
                        result = result.filter((item:any)=> item.status === 1 || item.status === 0).reverse()
                        
                        // result = newArray
                    } else if (locationData === "price") {
                        result = collapsedTransaction.filter((data: any) => data.typeOfTransaction === "Set Price")
                        result = result.filter((item:any)=> item.status === 1 || item.status === 0).reverse()
                    }
                    userData = await Promise.all(result.map(async (data: any) => {
                        return {
                            inputAmount: data.amountToSwap,
                            outputAmount: data.typeOfTransaction==="Set Price" && data.status!==1 ?
                            parseFloat(data.percentageChange).toFixed(4) :
                            data.typeOfTransaction==="Auto Time" && data.status!==1 ?
                            parseFloat(data.currentToPrice).toFixed(4) :
                            parseFloat(data.actualToPrice).toFixed(4),
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
                            initialFromPrice:data.initialFromPrice,
                            initialToPrice:data.initialToPrice,
                            situation:data.situation,
                            pathSymbol:data.pathSymbol,
                            market:data.market
                        }
                    })
                    )
                }



            }
            console.log({userData})
            const swapDataForWallet = await Promise.all(
                userData.map(async (data: DataIncoming) => ({
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
                    chainID:data.chainID,initialFromPrice:data.initialFromPrice,
                    initialToPrice:data.initialToPrice,
                    situation:data.situation,
                    pathSymbol:data.pathSymbol,
                    market:data.market                       
                })),
            );
            const userSwapHistory = swapDataForWallet.map((data: any) => ({
                token1Icon:
                    getTokenSymbol(data.tokenIn.symbol),
                token2Icon:
                    getTokenSymbol(data.tokenOut.symbol),
                token1: data.tokenIn,
                token2: data.tokenOut,
                amountIn: formatAmount(data.amountIn, data.tokenIn.decimals),
                amountOut:  data.name==="Set Price" || data.name==="Auto Time" ? data.amountOut : 
                formatAmount(data.amountOut, data.tokenOut.decimals),

                time: data.time,
                name: data.name,
                frequency: data.frequency,
                id: data.id,
                transactionHash: data.transactionHash,
                error: data.error,
                status: data.status,
                currentToPrice: data.currentToPrice,
                chainID:data.chainID,
                initialFromPrice:data.initialFromPrice,
                initialToPrice:data.initialToPrice,
                situation:data.situation,
                pathSymbol:data.pathSymbol,
                market:data.market
          
            }));
            setHistoryData(userSwapHistory);

            setLoading(false);


            } catch (e) {
                console.log(e);
                setLoading(false);
                setHistoryData({})
            }
        } else {
            console.log('Wallet disconnected')
        }
    };
    return { historyData, loading, locationData }
};

export default useAccountHistory;

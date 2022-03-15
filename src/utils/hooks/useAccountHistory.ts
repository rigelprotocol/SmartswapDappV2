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
import { SMARTSWAPROUTER, AUTOSWAPV2ADDRESSES, RGPADDRESSES, WNATIVEADDRESSES } from "../addresses";
import Web3 from 'web3';
import { autoSwapV2, SmartSwapRouter, rigelToken } from '../Contracts';
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { ParseFloat } from '..';

const abiDecoder = require('abi-decoder');

export function timeConverter(UNIX_timestamp: any) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
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
    chainID?:string
}
let web3 = new Web3(Web3.givenProvider);
export const formatAmount = (number: string, decimals: any) => {
    console.log(number)
    const num = ethers.BigNumber.from(number).toString();
    let res = ethers.utils.formatUnits(num, decimals)
    res = ParseFloat(res, 5)
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




const useAccountHistory = () => {
    const { account, chainId, library } = useWeb3React();
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState(account)
    const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
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
        return address !== '0x' ? resolveToken : null;
    };




    function decodeInput(input: string, ABI: any) {
        abiDecoder.addABI(ABI);
        let decoder = abiDecoder.decodeMethod(input);
        return decoder
    }

    const testNetwork = chainId === 97;
    // setContractAddress(SMARTSWAPROUTER[chainId as number]);
    const api = APIENDPOINT[chainId as number];
    const apikey = APIKEY[chainId as number];
    const refreshPage = useSelector((state: RootState) => state.transactions.refresh);
    const location = useLocation().pathname;
    const [, Symbol, Name,] = useNativeBalance()
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
        setURL("http://localhost:7000")
        loadAccountHistory();
    }, [chainId, account, contractAddress,refreshPage]);

    const getTransactionFromDatabase = async (address: string) => {
        const data = await fetch(`${URL}/auto/data/all/${address}`)
        const trans = await fetch(`${URL}/auto`)
        const transaction = await data.json()
        const database = await trans.json()

        return { transaction, database }
    }
    const loadAccountHistory = async () => {
        if (account && contractAddress && locationData) {
            setLoading(true);
            // try {
            let userData = []
            if (locationData === "swap") {
                const uri = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${stateAccount}&startblock=0
                        &endblock=latest&sort=desc&apikey=AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD`;

                const data = await fetch(uri);
                const jsondata = await data.json();
                const SwapTrx = jsondata.result.filter((item: any) => item.to == contractAddress);
                const dataFiltered = SwapTrx
                    .filter((items: any) => decodeInput(items.input, SmartSwapRouter02) !== undefined) // && items.transactionHash !== "1"
                    .map((items: any) => ({
                        value: items.value,
                        transactionObj: decodeInput(items.input, SmartSwapRouter02).params,
                        timestamp: items.timeStamp,
                        transactionFee: items.gasPrice * items.gasUsed,
                        // name: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).name,
                        transactionHash: items.transactionHash,
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
                    status: data.status
                }));
            } else if ((AUTOSWAPV2ADDRESSES[chainId as number] && locationData === "price") || AUTOSWAPV2ADDRESSES[chainId as number] && locationData === "auto") {
                const { transaction, database } = await getTransactionFromDatabase(account)
                if (transaction.length > 0) {
                    const collapsedTransaction = transaction[0].transaction
                    let result = []
                    if (locationData === "auto") {
                        result = collapsedTransaction.filter((data: any) => data.typeOfTransaction === "auto time").sort((a: any, b: any) => new Date(b.time * 1000) - new Date(a.time * 1000))
                        let newArray: any = []
                        result.forEach((val: any) => {
                            if (database.every((e: any) => e._id !== val.id)) {
                                val.status = 4
                                newArray.push(val)
                            } else newArray.push(val)
                        })

                        result = newArray
                    } else if (locationData === "price") {
                        result = collapsedTransaction.filter((data: any) => data.typeOfTransaction === "Set Price").sort((a: any, b: any) => new Date(b.time * 1000) - new Date(a.time * 1000))
                    }
                    userData = await Promise.all(result.map(async (data: any) => {
                        let fromAddress = data.swapFromToken === "native" ? WNATIVEADDRESSES[chainId as number] : data.swapFromToken
                        let toAddress = data.swapToToken === "native" ? WNATIVEADDRESSES[chainId as number] : data.swapToToken
                        const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number], library);
                        const toPriceOut = await rout.getAmountsOut(
                            data.amountToSwap,
                            [fromAddress, toAddress]
                        );
                        return {
                            inputAmount: data.amountToSwap,
                            outputAmount: data.typeOfTransaction === "Set Price" && (data.status === 1 || data.status === 0) ? ethers.utils.parseEther(data.currentToPrice).toString() : data.typeOfTransaction === "Set Price" ? ethers.utils.parseEther(data.percentageChange).toString() : toPriceOut[1].toString(),
                            tokenIn: data.swapFromToken,
                            tokenOut: data.swapToToken,
                            time: timeConverter(parseInt(data.time)),
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
                    chainID:data.chainID 
                    
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
                amountOut: formatAmount(data.amountOut, data.tokenOut.decimals),

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
            setHistoryData(userSwapHistory);





            // console.log("dataToUse000 : ", userSwapHistory)

            setLoading(false);


            // } catch (e) {
            //     console.log(e);
            //     setLoading(false);
            //     setHistoryData({})
            // }
        } else {
            console.log('Wallet disconnected')
        }
    };
    return { historyData, loading }
};

export default useAccountHistory;

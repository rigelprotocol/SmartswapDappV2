import { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import mainToken from '../../utils/main-token.json';
import TokenLogo from '../../assets/Null-24.svg';
import { getERC20Token } from "../utilsFunctions";
import { ethers } from 'ethers';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import AUTOSWAP from '../abis/autoswap.json';
import { useLocation } from 'react-router-dom';
import { SMARTSWAPROUTER, AUTOSWAPV2ADDRESSES, RGPADDRESSES } from "../addresses";
import Web3 from 'web3';
import { SupportedChainName } from '../constants/chains';
import { autoSwapV2, SmartSwapRouter, rigelToken } from '../Contracts';
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
    isError: string,
    error: []
}
let web3 = new Web3(Web3.givenProvider);
export const formatAmount = (number: string, decimals: any) => {
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

    const location = useLocation().pathname;
    useMemo(() => {
        if (location === "/auto-time") {
            setLocationData("auto")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
    }, [location, chainId])

    const getFrequencyFromDatabase = async (from: string, to: string, id: string) => {
        const data = await fetch(`${URL}/auto`)
        const res = await data.json()
        console.log({ from, to, id })
        let hash = res.filter((dat: any) => dat.orderID === Number(id))
        return hash[0]
    }

    useEffect(() => {
        // setURL("http://localhost:7000")
        const loadAccountHistory = async () => {
            if (account && contractAddress && locationData) {
                setLoading(true);

                // try {
                const uri = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${stateAccount}&startblock=0
                        &endblock=latest&sort=desc&apikey=AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD`;

                const data = await fetch(uri);
                const jsondata = await data.json();
                const SwapTrx = jsondata.result.filter((item: any) => item.to == contractAddress);
                console.log(SwapTrx)
                const dataFiltered = SwapTrx
                    .filter((items: any) => decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02) !== undefined) // && items.isError !== "1"
                    .map((items: any) => ({
                        value: items.value,
                        transactionObj: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).params,
                        timestamp: items.timeStamp,
                        transactionFee: items.gasPrice * items.gasUsed,
                        // name: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).name,
                        isError: items.isError
                    }));
                const dataToUse = dataFiltered.length > 5 ? dataFiltered.splice(0, 5) : dataFiltered;
                console.log({ dataToUse })
                let userData
                if (locationData === "swap") {
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
                        frequency: "",
                        id: "",
                        isError: data.isError
                    }));
                } else if (locationData === "auto" && AUTOSWAPV2ADDRESSES[chainId as number]) {
                    const autoswapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
                    const rigelContract = await rigelToken(RGPADDRESSES[chainId as number], library);

                    let useDataLooped: any = []

                    dataToUse.forEach((data: any) => {
                        let id = data.transactionObj[0].value
                        console.log({ id })
                        if (id === "0") {
                            return
                        } else {
                            useDataLooped.push(data)
                        }


                    }
                    )

                    console.log({ dataToUse, useDataLooped })
                    userData = await Promise.all(
                        useDataLooped.map(async (data: any) => {
                            const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number], library);
                            let id = data.transactionObj[0].value
                            console.log({ id })
                            let dataReturned = await autoswapV2Contract.getUserData(account, id)
                            let database = await getFrequencyFromDatabase(dataReturned.swapFromToken, dataReturned.swapToToken, dataReturned.id.toString())
                            const toPriceOut = await rout.getAmountsOut(
                                dataReturned.amountIn.toString(),
                                dataReturned.path
                            );
                            console.log({ dataReturned, database })
                            const error = []
                            if (parseInt(data.isError) > 0) {
                                const rgpBalance = await rigelContract.balanceOf(account)
                                const ERC20Token = database && database.fromAddress === "native" ? "native" : await getERC20Token(dataReturned.swapFromToken, library)
                                const rgp = Web3.utils.fromWei(rgpBalance.toString(), 'ether')
                                const amountToApprove = await autoswapV2Contract.fee()
                                const fee = Web3.utils.fromWei(amountToApprove.toString(), "ether")
                                const fromBalance = ERC20Token === "native" ? await library?.getBalance(account as string) : await ERC20Token.balanceOf(account)
                                const fromName = ERC20Token === "native" ? SupportedChainName[chainId as number] : await ERC20Token.name()
                                const fromAddressBal = Web3.utils.fromWei(fromBalance.toString(), "ether")
                                console.log({ rgp, fee, fromAddressBal })
                                if (rgp < fee) {
                                    error.push("insufficient RGP for gas fee")
                                }
                                if (database && database.fromPrice) {
                                    if (database.fromPrice > fromAddressBal) {
                                        error.push(`insufficient ${fromName} balance`)
                                    }
                                }
                                if (error.length === 0) {
                                    error.push("error")
                                }
                            }
                            return {
                                inputAmount: dataReturned.amountIn.toString(),
                                outputAmount: toPriceOut[1].toString(),
                                tokenIn: dataReturned.swapFromToken,
                                tokenOut: dataReturned.swapToToken,
                                time: timeConverter(dataReturned.time.toString()),
                                name: database ? database.type : "",
                                frequency: database ? database.frequency : "",
                                id: database ? database._id : "",
                                isError: data.isError,
                                error
                            }
                        }
                        )
                    )

                }
                console.log({ userData })

                const swapDataForWallet = await Promise.all(
                    userData.map(async (data: DataIncoming) => ({
                        tokenIn: await tokenList(data.tokenIn),
                        tokenOut: await tokenList(data.tokenOut),
                        amountIn: data.inputAmount,
                        amountOut: data.outputAmount,
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        isError: data.isError,
                        error: data.error
                    })),
                );

                const userSwapHistory = swapDataForWallet.map((data: any) => ({
                    token1Icon:
                        getTokenSymbol(data.tokenIn.symbol),
                    token2Icon:
                        getTokenSymbol(data.tokenOut.symbol),
                    token1: data.tokenIn,
                    token2: data.tokenOut,
                    amountIn: formatAmount(data.amountIn),
                    amountOut: formatAmount(data.amountOut),
                    time: data.time,
                    name: data.name,
                    frequency: data.frequency,
                    id: data.id,
                    isError: data.isError,
                    error: data.error
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
        loadAccountHistory();
    }, [chainId, account, contractAddress]);

    return { historyData, loading }
};

export default useAccountHistory;

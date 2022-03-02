import { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import mainToken from '../../utils/main-token.json';
import TokenLogo from '../../assets/Null-24.svg';
import { getERC20Token } from "../utilsFunctions";
import { ethers } from 'ethers';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import AUTOSWAP from '../abis/autoswap.json';
import { useLocation } from 'react-router-dom';
import { SMARTSWAPROUTER, AUTOSWAPV2ADDRESSES } from "../addresses";
import Web3 from 'web3';
import { autoSwapV2, SmartSwapRouter } from '../Contracts';


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

interface DataIncoming {
    inputAmount: string,
    outputAmount: string,
    tokenIn: string,
    tokenOut: string,
    time: string,
    name: string,
    frequency: string,
    id: string
}
let web3 = new Web3(Web3.givenProvider);
export const formatAmount = (number: string) => {
    const num = ethers.BigNumber.from(number).toString();
    let res = ethers.utils.formatEther(num);
    res = (+res).toFixed(4);
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
        const data = await fetch("https://rigelprotocol-autoswap.herokuapp.com/auto")
        const res = await data.json()
        let hash = res.filter((dat: any) => dat.fromAddress === from && dat.toAddress === to && dat.orderID === Number(id))
        return hash[0]
    }

    useEffect(() => {

        const loadAccountHistory = async () => {
            if (account && contractAddress && locationData) {
                setLoading(true);

                // try {
                const uri = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${stateAccount}&startblock=0
                        &endblock=latest&sort=desc&apikey=AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD`;

                const data = await fetch(uri);
                const jsondata = await data.json();
                console.log({ contractAddress })
                const SwapTrx = jsondata.result.filter((item: any) => item.to == contractAddress);
                const dataFiltered = SwapTrx
                    .filter((items: any) => decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02) !== undefined && items.isError !== "1")
                    .map((items: any) => ({
                        value: items.value,
                        transactionObj: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).params,
                        timestamp: items.timeStamp,
                        transactionFee: items.gasPrice * items.gasUsed,
                        name: decodeInput(items.input, locationData === "auto" ? AUTOSWAP : SmartSwapRouter02).name
                    }));

                const dataToUse = dataFiltered.length > 5 ? dataFiltered.splice(0, 5) : dataFiltered;
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
                        name: data.name,
                        frequency: "",
                        id: ""
                    }));
                } else if (locationData === "auto" && AUTOSWAPV2ADDRESSES[chainId as number]) {
                    const smartSwapV2Contract = await autoSwapV2(AUTOSWAPV2ADDRESSES[chainId as number], library);
                    userData = await Promise.all(
                        dataToUse.map(async (data: any) => {
                            const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number], library);
                            let id = data.transactionObj[0].value
                            let dataReturned = await smartSwapV2Contract.getUserData(account, id)
                            let database = await getFrequencyFromDatabase(dataReturned.swapFromToken, dataReturned.swapToToken, dataReturned.id.toString())
                            console.log(dataReturned.path)
                            console.log(Web3.utils.toWei(dataReturned.amountIn.toString(), "ether"), dataReturned.amountIn.toString())
                            const toPriceOut = await rout.getAmountsOut(
                                dataReturned.amountIn.toString(),
                                dataReturned.path
                            );
                            console.log(toPriceOut)
                            return {
                                inputAmount: dataReturned.amountIn.toString(),
                                outputAmount: toPriceOut[1].toString(),
                                tokenIn: dataReturned.swapFromToken,
                                tokenOut: dataReturned.swapToToken,
                                time: timeConverter(dataReturned.time.toString()),
                                name: data.name,
                                frequency: database ? database.frequency : "",
                                id: database ? database._id : ""
                            }
                        }
                        )
                    )

                }


                const swapDataForWallet = await Promise.all(
                    userData.map(async (data: DataIncoming) => ({
                        tokenIn: await tokenList(data.tokenIn),
                        tokenOut: await tokenList(data.tokenOut),
                        amountIn: data.inputAmount,
                        amountOut: data.outputAmount,
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id
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
                    id: data.id
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

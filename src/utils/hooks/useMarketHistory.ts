import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import { timeConverter, getTokenSymbol, formatAmount, APIENDPOINT, APIKEY } from "./useAccountHistory";
import { SMARTSWAPROUTER } from "../addresses";
import { getERC20Token } from '../utilsFunctions';


const abiDecoder = require('abi-decoder');

const useMarketHistory = () => {
    const { account, chainId, library } = useWeb3React();
    const [loadMarketData, setLoadMarketData] = useState(false);
    const [marketHistoryData, setMarketHistoryData] = useState({} as any);



    const contractAddress = SMARTSWAPROUTER[chainId as number];
    const api = APIENDPOINT[chainId as number];
    const apikey = APIKEY[chainId as number];

    abiDecoder.addABI(SmartSwapRouter02);

    const decodeInput = (input: string) => {
        return abiDecoder.decodeMethod(input);
    };

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




    useEffect(() => {
        const getMarketData = async () => {
            if (account) {
                setLoadMarketData(true);
                try {

                    const uri = `https://${api}?module=account&action=txlist&address=${contractAddress}&startblock=0
                    &endblock=latest&sort=desc&apikey=${apikey}`;

                    const data = await fetch(uri);
                    const jsonData = await data.json();


                    const filteredData = jsonData.result
                        .filter((items: any) => decodeInput(items.input) !== undefined && items.isError !== "1")
                        .map((items: any) => ({
                            transactionObj: decodeInput(items.input).params,
                            timestamp: items.timeStamp,
                            value: items.value,
                            from: items.from,
                            to: items.to
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

                    const dataToUse = marketData.length > 5 ? marketData.splice(0, 5) : marketData;

                    const marketSwap = await Promise.all(
                        dataToUse.map(async (data: any) => ({
                            tokenIn: await tokenList(data.tokenIn),
                            tokenOut: await tokenList(data.tokenOut),
                            amountIn: data.inputAmount,
                            amountOut: data.outputAmount,
                            time: data.time,
                            hash: data.hash,
                            to: data.to,
                            from: data.from
                        })),
                    );

                    const marketHistory = marketSwap.map((data: any) => ({
                        token1Icon:
                            getTokenSymbol(data.tokenIn.symbol),
                        token2Icon:
                            getTokenSymbol(data.tokenOut.symbol),
                        token1: data.tokenIn,
                        token2: data.tokenOut,
                        amountIn: formatAmount(data.amountIn),
                        amountOut: formatAmount(data.amountOut),
                        time: data.time
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
        getMarketData();
    }, [chainId, account]);
    return { marketHistoryData, loadMarketData };

};

export default useMarketHistory;
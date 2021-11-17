import  {useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import mainToken from '../../utils/main-token.json';
import TokenLogo from '../../assets/Null-24.svg';
import {getERC20Token} from "../utilsFunctions";
import {ethers} from 'ethers';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import {SMARTSWAPROUTER} from "../addresses";

const abiDecoder = require('abi-decoder');

export const convertTime = (trxTime: any) => {
    const date = new Date(trxTime * 1000);
    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`;
    const seconds = `0${date.getSeconds()}`;
    // Displays time in 10:30:23 format
    return `${hours}:${minutes.substr(-2)}:${seconds.substr(
        -2,
    )}`;
};

interface DataIncoming {
    inputAmount: string,
    outputAmount: string,
    tokenIn: string,
    tokenOut: string,
    time: string
}

export const formatAmount = (number: string) => {
    const num = ethers.BigNumber.from(number);
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

export const tokenList = async (addressName: string) => {
    const token = await getERC20Token(addressName);
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


const useAccountHistory = () => {
    const { account, chainId } = useWeb3React();
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState({} as any);



    abiDecoder.addABI(SmartSwapRouter02);
    function decodeInput(input: string) {
        return abiDecoder.decodeMethod(input);
    }

    const testNetwork = chainId === 97;
    const contractAddress = SMARTSWAPROUTER[chainId as number];


    useEffect(() => {

        const loadAccountHistory = async () => {
            if (account) {
                setLoading(true);

                try {
                    const uri = `https://api${testNetwork ? '-testnet.bscscan.com' : '.bscscan.com'
                    }/api?module=account&action=txlist&address=${account}&startblock=0
                        &endblock=latest&sort=desc&apikey=AATZWFQ47VX3Y1DN7M97BJ5FEJR6MGRQSD`;

                    const data = await fetch(uri);
                    const jsondata = await data.json();

                    const SwapTrx = jsondata.result.filter((item: any) => item.to === contractAddress);


                    const dataFiltered = SwapTrx
                        .filter((items: any) => decodeInput(items.input) !== undefined && items.isError !== "1")
                        .map((items: any) => ({
                            value: items.value,
                            transactionObj: decodeInput(items.input).params,
                            timestamp: items.timeStamp,
                            transactionFee: items.gasPrice * items.gasUsed,
                        }));

                    const dataToUse = dataFiltered.length > 5 ? dataFiltered.splice(0, 5) : dataFiltered;

                    const userData = dataToUse.map((data: any) => ({
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
                        time: convertTime(data.timestamp)
                    }));

                    const swapDataForWallet = await Promise.all(
                        userData.map( async ( data: DataIncoming) => ({
                            tokenIn: await tokenList(data.tokenIn),
                            tokenOut: await tokenList(data.tokenOut),
                            amountIn: data.inputAmount,
                            amountOut: data.outputAmount,
                            time: data.time
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
        loadAccountHistory();
    }, [chainId, account]);

    return {historyData, loading}
};

export default useAccountHistory;

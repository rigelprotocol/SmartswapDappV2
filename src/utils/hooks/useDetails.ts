import { useMemo,useState } from "react";
import { useWeb3React } from "@web3-react/core";
import bsctestnet from '../token-details/bsc-testnet.json'
import bsc from '../token-details/bsc.json'
import mainnet from '../token-details/mainnet.json'
import matic from '../token-details/matic.json'
import ropsten from '../token-details/ropsten.json'
import matictestnet from '../token-details/matic-testnet.json'
import { getAddress } from "./usePools";
import { SwapState } from "../../state/swap/reducer";
import { ISNATIVE } from "../utilsFunctions";


export const useDetails = (swapDetails:SwapState) => {
    const [inputdetails,setinputdetails] = useState<any[]>([])
    const [outputdetails,setoutputdetails] = useState<any[]>([])
    const {chainId} = useWeb3React()
    const input = ISNATIVE(swapDetails.INPUT.currencyId as string,chainId as number)
    const output = ISNATIVE(swapDetails.OUTPUT.currencyId as string,chainId as number)
 

    useMemo(()=>{
        if(chainId === 1){
            const inputtoken = mainnet.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
            const outputtoken = mainnet.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
            setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }else if(chainId === 3){
            const inputtoken = ropsten.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
            const outputtoken = ropsten.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
            setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }else if(chainId === 56){
            const inputtoken = bsc.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
            const outputtoken = bsc.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
            setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }else if(chainId === 97){
            const inputtoken = bsctestnet.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
            const outputtoken = bsctestnet.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
            setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }else if(chainId === 80001){
            const inputtoken = matictestnet.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
            const outputtoken = matictestnet.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
            setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }else if(chainId === 137){
           const inputtoken = matic.filter(token => input ? swapDetails.INPUT.currencyId === token.symbol : swapDetails.INPUT.currencyId === token.address)
           const outputtoken = matic.filter(token => output ? swapDetails.OUTPUT.currencyId === token.symbol : swapDetails.OUTPUT.currencyId === token.address)
           setinputdetails(inputtoken)
            setoutputdetails(outputtoken)
        }
    },[swapDetails,chainId])
    return {inputdetails,outputdetails}
}
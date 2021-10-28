import React,{ useEffect, useState} from "react"
import { getERC20Token } from "../utils/utilsFunctions"
import { useWeb3React } from '@web3-react/core'
import { defaultTokenList } from "../utils/constants/tokens";
import { ethers } from "ethers";
import { Currency } from "../components/Tokens/SelectToken";
import { useNativeBalance } from "../utils/hooks/useBalances";
import { checkSupportedIds } from "../connectors";

export type Token = {
  chainId: number,
  address?:string | undefined,
  name: string,
  symbol: string,
  decimals: number,
  logoURI?: string,
  isNative?:boolean,
  isToken?:boolean,
  isImported?:boolean
}



export const GetAddressTokenBalance = (currency :Currency) => {
  const { chainId, account } = useWeb3React();
  const [balance, setBalance] = useState<string | number | void>('');
  const [Balance] = useNativeBalance();
  useEffect(() => {
    const getBalance = async (currency:Currency) => {
      
      if (account) {
        try {
          if(currency.isNative){
            setBalance(Balance)
          }else{
            const token = await getERC20Token(currency.address ? currency.address : "");
            console.log({token})
          const balance = await token.balanceOf(account);
              console.log(currency.name,parseFloat(ethers.utils.formatEther(balance)).toFixed(4))
          setBalance(
            parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4)
          );
          }
        } catch (err) {
          setBalance('');
          console.log(err);
        }
      } else {
        console.log('Connect wallet');
      }
    };

    getBalance(currency)
  }, [account, chainId,currency,Balance]);

  return [balance];
};
export const UseTokens = () => {
  const { chainId, account } = useWeb3React();
  const [tokenList,setTokenList] = useState(defaultTokenList[chainId as number ?? 56])
   useEffect(()=>{
    if(checkSupportedIds(chainId || 56)){
      setTokenList(defaultTokenList[chainId as number ?? 56])
    }

},[chainId,account])

return [tokenList]
}

export const ExtendedEther = (chainId:number  = 56,symbol:string,name:string,logo:string) =>{
    let native = {
      chainId: chainId,
      decimals: 18,
      isNative: true,
      isToken: false,
      name,
      symbol,
    logoURI:logo}
      return native
  
}


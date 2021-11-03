import {useMemo,useState,useEffect} from "react"
import { isAddress,getERC20Token } from "../../utils/utilsFunctions";
import { useWeb3React } from "@web3-react/core"
import { Currency, Token} from '@uniswap/sdk-core'
import { ethers } from "ethers";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { checkSupportedIds } from "../../connectors";




  export const GetAddressTokenBalance = (currency :Currency) => {
    const { chainId, account } = useWeb3React();
    const [balance, setBalance] = useState<string | number | void>('');
    const [Balance] = useNativeBalance();
    useEffect(() => {
      const getBalance = async (currency:Currency) => {
        if (account && checkSupportedIds(chainId || 56)) {
            
          try {
            if(currency.isNative){
              setBalance(Balance)
            }else{
              if(isAddress(currency.address)){
  const token = await getERC20Token(currency.address ? currency.address : "");
            const balance = await token.balanceOf(account);
            setBalance(
              parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
            );
            }
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
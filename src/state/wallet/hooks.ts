import {useMemo,useState,useEffect} from "react"
import { isAddress,getERC20Token } from "../../utils/utilsFunctions";
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import { Currency, Token,NativeCurrency} from '@uniswap/sdk-core'
import { ethers } from "ethers";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { checkSupportedIds } from "../../connectors";




  export const GetAddressTokenBalance = (currency :Currency | undefined) => {
    const { chainId, account } = useActiveWeb3React();
    const [balance, setBalance] = useState<string | number | void>('');
    const [Balance] = useNativeBalance();
    useEffect(() => {
      const getBalance = async (currency:Currency) => {
        if (account && checkSupportedIds(chainId || 56)) {
            
          try {
            if(currency.isNative){
              Balance === "0.0000" ? setBalance("0") :  setBalance(Balance)
             
            }else if(isAddress(currency.address)){
              const token = await getERC20Token(currency.address ? currency.address : "");
            const balance = await token.balanceOf(account);
            const amount =ethers.utils.formatEther(balance)
            amount ===  "0.0" ? setBalance("0") :  setBalance(
              parseFloat(amount).toFixed(4)
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
    }, [account, chainId,currency, Balance]);
  
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

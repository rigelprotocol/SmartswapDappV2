import {useMemo,useState,useEffect} from "react"
import { useAllTokens } from "../../hooks/Tokens";
import { isAddress,getERC20Token } from "../../utils/utilsFunctions";
import { useWeb3React } from "@web3-react/core"
import { Currency, Token, CurrencyAmount, Ether, } from '@uniswap/sdk-core'
import { Interface } from '@ethersproject/abi'
import JSBI from "jsbi";
import ERC20ABI from '../../utils/abis/erc20.json';
import { ethers } from "ethers";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { checkSupportedIds } from "../../connectors";

export const getAddressTokenBalance = async (
  token: Token,
  account:string
) =>
  token.balanceOf(account)
  ;

export const useTokenBalancesWithLoadingIndicator = async (
    address?: string,
    tokens?: (Token | undefined)[]
  ):Promise<string | undefined | 0> =>{
    const { account } = useWeb3React()
    console.log({tokens})
    const validatedTokens: Token[] = useMemo(
      () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
      [tokens]
    )
    // const ERC20INTERFACE = new Interface(ERC20ABI)
  
    const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
    console.log({validatedTokenAddresses})
  
        let tokenAddress = validatedTokenAddresses[0]
      const Atoken = await getERC20Token(tokenAddress)
        const balances =await getAddressTokenBalance(Atoken,account)
    if(validatedTokens.length > 0 && address){
      const amount = JSBI.BigInt(balances.toString())
      if (amount) {
        const decimals = await Atoken.decimals()
      console.log({amount},ethers.utils.formatUnits(balances.toString(),decimals),decimals)
       const memo = ethers.utils.formatUnits(balances.toString(),decimals)
      //  const memo = CurrencyAmount.fromRawAmount(validatedTokens[0], amount)
       return memo
     
      }
    }
  }



export const useTokenBalances =  async(
    address?: string,
    tokens?: (Token | undefined)[]
  ): Promise<string | 0 | undefined> => {
   let data =await useTokenBalancesWithLoadingIndicator(address, tokens)
   return data
  }
// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = allTokensArray.map(()=>{
    const 
  })
  return balances ?? {}
}



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
              const token = await getERC20Token(currency.address ? currency.address : "");
            const balance = await token.balanceOf(account);
            setBalance(
              parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
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
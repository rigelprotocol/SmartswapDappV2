import React,{useMemo, useEffect, useState} from "react"
import { isAddress,provider, getERC20Token } from "../utils/utilsFunctions"
import { useWeb3React } from '@web3-react/core'
// import { provider } from "../utils/utilsFunctions";
import { ethers } from "ethers";
export const GetAddressTokenBalance = (address:string) => {
  const { chainId, account } = useWeb3React();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    alert("balance")
    const getBalance = async (address:any) => {
      
      if (account) {
        try {
          const token = await getERC20Token(address);
          const balance = await token.balanceOf(account);
          setBalance(
            parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
          );
          console.log(parseFloat(ethers.utils.formatEther(balance)).toFixed(4))
        } catch (err) {
          setBalance('');
          console.log(err);
        }
      } else {
        console.log('Connect wallet');
      }
    };

    getBalance(address);
  }, [account, chainId]);

  return [balance];
};


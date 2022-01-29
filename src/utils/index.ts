import { getAddress } from '@ethersproject/address'
import { Token } from '@uniswap/sdk-core'
import { TokenAddressMap } from '../state/lists/hooks'
import  Web3 from 'web3';
import { ethers } from 'ethers';

// returns the checksummed address if the address for valid address or returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch(e) {
        return false
    }
}

// shortens the address to the format: 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
    return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address])
}

export function convertToNumber(hex : string, decimals?: number) {
    const balance =  Web3.utils.toBN(hex);

    let balanceDecimal = balance;
    if (decimals && (balance.toLocaleString() === '0' && decimals < 20)) {
      balanceDecimal = balance.div(Web3.utils.toBN(10 ** decimals));
    }
    return balanceDecimal.toLocaleString();
  };

  export function convertFromWei (balance:string , decimals?:number) {
    const decimalValue = decimals || 18;
    const { unitMap } = Web3.utils;
    const unit = Object.keys(unitMap).find(
      unit => unitMap[unit] === Math.pow(10, decimalValue).toString(),
    );
    return Web3.utils.fromWei(balance.toString(), unit);
  };

  export const clearInputInfo = (setInput : any, setButton: any = false, value: any) => {
    setInput('');
    if (setButton) {
      setButton(value);
    }
  };

  export const  formatBigNumber = (bigNumber : any) => {
    const amount = ethers.utils.formatEther(bigNumber);
    if (Number(amount)  === 0 || !amount?.includes('.')) {
      return amount
    }
    console.log(amount)
    const splitAmount = amount.toString().split('.');
    const [whole, decimal] = splitAmount;
    const deci = decimal
      .split('')
      .slice(0, 18)
      .join('');
    const output = [whole, deci];
    return output.join('.');
  };

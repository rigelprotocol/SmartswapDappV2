import { SmartSwapRouter } from './Contracts';
import { Currency } from '@uniswap/sdk-core';
import { SMARTSWAPROUTER } from './addresses';

export const GetAmountsOut = async (
  chainId: number,
  value: string,
  CurrencyA: any,
  CurrencyB: Currency | undefined
) => {
  console.log(CurrencyA);
  // const RouterContract = await SmartSwapRouter(SMARTSWAPROUTER[chainId]);
  if (CurrencyA && CurrencyB) {
    console.log(CurrencyA);
    // console.log(RouterContract);
    console.log(CurrencyA);
    console.log(CurrencyB);
  }
};

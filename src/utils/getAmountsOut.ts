import { SmartSwapRouter } from './Contracts';
import { Currency } from '@uniswap/sdk-core';
import { SMARTSWAPROUTER } from './addresses';

export const GetAmountsOut = async (
  chainId: number,
  value: string,
  CurrencyA: any,
  CurrencyB: Currency | undefined
) => {
  // const RouterContract = await SmartSwapRouter(SMARTSWAPROUTER[chainId]);
  if (CurrencyA && CurrencyB) {
  }
};

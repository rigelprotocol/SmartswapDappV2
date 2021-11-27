import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  Token,
} from '@uniswap/sdk-core';
import JSBI from 'jsbi';

const ONE = new Fraction(1, 1);

export function calculateSlippageAmount(value: any, slippage: number): string {
  let percentForCheck = new Percent(slippage, 100);
  if (percentForCheck.lessThan(0) || percentForCheck.greaterThan(ONE))
    throw new Error('Unexpected slippage');

  console.log(slippage);

  const fraction = new Fraction(slippage, 100)
    .multiply(new Fraction(value, 1))
    .divide(new Fraction(100, 1))
    .subtract(new Fraction(value, 1));

  console.log(fraction.toSignificant(18));

  return fraction.toSignificant(18);
}

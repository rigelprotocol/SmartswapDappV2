import { Fraction, Percent } from '@uniswap/sdk-core';

const ONE = new Fraction(1, 1);

export function calculateSlippageAmount(value: any, slippage: number): string {
  let percentForCheck = new Percent(slippage, 100);
  if (percentForCheck.lessThan(0) || percentForCheck.greaterThan(ONE))
    throw new Error('Unexpected slippage');

  const fraction = new Fraction(slippage, 100)
    .multiply(new Fraction(value, 1))
    .divide(new Fraction(100, 1))
    .subtract(new Fraction(value, 1));

  const removeSign = Math.abs(parseFloat(fraction.toFixed(0).toString()));

  return removeSign.toString();
}

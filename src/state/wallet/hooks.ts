import { useState, useEffect } from "react";
import { getERC20Token } from "../../utils/utilsFunctions";
import { isAddress } from "@ethersproject/address";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { Currency, Token, CurrencyAmount } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { checkSupportedIds } from "../../connectors";
import JSBI from "jsbi";
import { ParseFloat } from "../../utils";

export const GetAddressTokenBalance = (currency: Currency | undefined) => {
  const { chainId, account, library } = useActiveWeb3React();
  const [balance, setBalance] = useState<
    string | number | void | CurrencyAmount<Token>
  >("");
  const [Balance] = useNativeBalance();
  useEffect(() => {
    const getBalance = async (currency: Currency) => {
      if (account && chainId && checkSupportedIds(chainId)) {
        try {
          if (currency?.isNative) {
            Balance === "0.0000" ? setBalance("0") : setBalance(Balance);
          } else if (isAddress(currency?.address)) {
            const token = await getERC20Token(
              currency.address ? currency.address : "",
              library
            );
            const value = await token.balanceOf(account);

            const amount = value ? JSBI.BigInt(value.toString()) : undefined;
            if (amount && chainId) {
              const amountValue = parseFloat(
                ethers.utils.formatUnits(amount.toString(), currency.decimals)
              );

              amountValue === 0
                ? setBalance("0")
                : setBalance(ParseFloat(amountValue, 4));
            }
          }
        } catch (err) {
          setBalance("");
          console.log(err);
        }
      } else {
        console.log("Connect wallet");
      }
    };

    getBalance(currency);
  }, [account, chainId, currency, Balance]);

  return [balance];
};

export const ExtendedEther = (
  chainId: number = 56,
  symbol: string,
  name: string,
  logo: string
) => {
  let native = {
    chainId: chainId,
    decimals: 18,
    isNative: true,
    isToken: false,
    name,
    symbol,
    logoURI: logo,
  };
  return native;
};

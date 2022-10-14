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
import { useSelector } from "react-redux";
import { RootState } from "..";

export const GetAddressTokenBalance = (currency: Currency | undefined) => {
  const { chainId, account, library } = useActiveWeb3React();
  const [balance, setBalance] = useState<
    string | number | void | CurrencyAmount<Token>
  >("");
  const [Balance] = useNativeBalance();
  const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
  const refresh = useSelector<RootState>((state) => state.application.refresh);
  const stateChanged : boolean = trxState === 2;
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
                console.log({amountValue})
              amountValue === 0
                ? setBalance("0")
                : setBalance(ParseFloat(amountValue, 4));
            }
          }
        } catch (err) {
          setBalance("");
          console.log(err);
        }
      }
    };

    getBalance(currency);
  }, [account, chainId, currency, stateChanged,Balance,refresh]);

  return [balance];
};

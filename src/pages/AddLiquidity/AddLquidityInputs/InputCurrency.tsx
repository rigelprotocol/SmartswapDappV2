import React, { useCallback, useState, useEffect } from "react";
import { Field } from "../../../state/mint/actions";
import { RouteComponentProps } from "react-router-dom";
import InputSelector from "../../Swap/components/sendToken/InputSelector";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { GetAddressTokenBalance } from "../../../state/wallet/hooks";
import { useWeb3React } from "@web3-react/core";
import {
  useMintActionHandlers,
  useDerivedMintInfo,
  useMintState,
} from "../../../state/mint/hooks";
import { maxAmountSpend } from "../../../utils/maxAmountSpend";
import { GetAmountsOut } from "../../../utils/getAmountsOut";
import { SmartSwapRouter } from "../../../utils/Contracts";
import { SMARTSWAPROUTER } from "../../../utils/addresses";
import { getAddress } from "../../../utils/hooks/usePools";
import { ethers } from "ethers";

interface InputCurrencyProps {
  onUserInput: (value: string) => void;
  onCurrencySelection: Function;
  currency: Currency | undefined;
  otherCurrency: Currency | undefined;
  onMax: () => void;
  value: string;
  setBalanceA: React.Dispatch<React.SetStateAction<string>>;
}

const InputCurrency = ({
  onUserInput,
  onCurrencySelection,
  currency,
  otherCurrency,
  onMax,
  value,
  setBalanceA,
}: InputCurrencyProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const [balance] = GetAddressTokenBalance(currency ?? undefined);
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
  );

  useEffect(() => {
    setBalanceA(balance as string);
  }, [currency, balance, setBalanceA]);
  return (
    <InputSelector
      onUserInput={onUserInput}
      onCurrencySelect={handleInputSelect}
      currency={currency}
      otherCurrency={otherCurrency}
      tokenModal={tokenModal}
      onMax={onMax}
      setToken={() => setTokenModal((state) => !state)}
      value={value}
      max
    />
  );
};

export default React.memo(InputCurrency);

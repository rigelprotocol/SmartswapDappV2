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
import { ethers } from "ethers";
import { SmartSwapRouter } from "../../../utils/Contracts";
import { SMARTSWAPROUTER } from "../../../utils/addresses";
import { getAddress } from "../../../utils/hooks/usePools";

interface OutputCurrencyProps {
  onUserOutput: (value: string) => void;
  onCurrencySelection: Function;
  currency: Currency | undefined;
  otherCurrency: Currency | undefined;
  value: string;
  setBalanceB: React.Dispatch<React.SetStateAction<string>>;
}

const OutputCurrecy = ({
  onCurrencySelection,
  currency,
  otherCurrency,
  onUserOutput,
  value,
  setBalanceB,
}: OutputCurrencyProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const [balance] = GetAddressTokenBalance(currency ?? undefined);
  const handleInputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
    // [],
  );

  useEffect(() => {
    setBalanceB(balance as string);
  }, [currency, balance, setBalanceB]);

  return (
    <InputSelector
      onCurrencySelect={handleInputSelect}
      currency={currency}
      otherCurrency={otherCurrency}
      tokenModal={tokenModal}
      setToken={() => setTokenModal((state) => !state)}
      onUserInput={onUserOutput}
      value={value}
      max={false}
    />
  );
};

export default React.memo(OutputCurrecy);

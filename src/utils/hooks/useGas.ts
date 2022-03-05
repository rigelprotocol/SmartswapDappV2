import { useState, useMemo } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Percent } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import JSBI from "jsbi";

export const useGas = () => {
  const [maxPriority, setMaxPriority] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [maxPriority2, setMaxPriority2] = useState("");
  const [maxFee2, setMaxFee2] = useState("");
  useMemo(async () => {
    const web3 = createAlchemyWeb3("https://polygon-rpc.com");
    const maxPriorityPerGas = await web3.eth.getMaxPriorityFeePerGas();
    const baseFee = await web3.eth.getBlock("pending");
    const baseFeeFormatted = web3.utils.hexToNumberString(
      baseFee.baseFeePerGas
    );
    const maxPriorityPerGasFormatted =
      web3.utils.hexToNumberString(maxPriorityPerGas);

    const baseFeeThirtyPercent = new Percent("30", "100")
      .multiply(maxPriorityPerGasFormatted)
      .quotient.toString();

    const addPriorityFee = JSBI.add(
      JSBI.BigInt(maxPriorityPerGasFormatted),
      JSBI.BigInt(baseFeeThirtyPercent)
    );

    const maxFee = JSBI.add(
      JSBI.BigInt(baseFeeFormatted),
      JSBI.BigInt(addPriorityFee.toString())
    );

    setMaxPriority(ethers.utils.formatUnits(addPriorityFee.toString(), 9));
    setMaxFee(ethers.utils.formatUnits(maxFee.toString(), 9));
  }, []);
  return { maxPriority, maxFee, maxPriority2, maxFee2 };
};

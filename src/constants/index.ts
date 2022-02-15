export const NetworkContextName = "NETWORK";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const approveAbi = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const allowanceAbi = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const getDeadline = (deadlineInMinutes: number) =>
  Math.floor(new Date().getTime() + Number(deadlineInMinutes));

export const getOutPutDataFromEvent = async (
  tokenAddress: string | undefined,
  eventsArray: any[],
  decimals?: number
) => {
  const duplicateArray: any[] = [];
  const decimal = decimals ? decimals : 16;
  const seconddecimal = decimals ? decimals : 18;
  eventsArray.map((event) => {
    if (event.address.toLowerCase() === tokenAddress?.toLowerCase()) {
      duplicateArray.push(event);
    }
  });

  if (duplicateArray.length != 0) {
    console.log("duplicate data", duplicateArray[0].data.toString());
    const convertedInput = (
      parseInt(duplicateArray[0].data, 16) /
      10 ** seconddecimal
    ).toFixed(7);
    return convertedInput;
  }
};

export const getInPutDataFromEvent = (
  tokenAddress: string | undefined,
  eventsArray: any[],
  fromAmount: string | undefined,
  decimals?: number
) => {
  const duplicateArray: any[] = [];
  const decimal = decimals ? decimals : 16;
  const seconddecimal = decimals ? decimals : 18;
  eventsArray.map((event) => {
    if (event.address.toLowerCase() === tokenAddress?.toLowerCase()) {
      duplicateArray.push(event);
    }
  });

  if (duplicateArray.length !== 0) {
    const convertedInput =
      parseInt(duplicateArray[0].data, 16) / 10 ** seconddecimal;

    if (parseFloat(convertedInput) !== parseFloat(fromAmount)) {
      return convertedInput.toFixed(7);
    }
    return fromAmount;
  }
};

export interface SerializedFarmConfig extends FarmConfigBaseProps {
    token: SerializedToken
    quoteToken: SerializedToken
  }

  interface FarmConfigBaseProps {
    pid: number
    lpSymbol: string
    lpAddresses: Address
    multiplier?: string
    isCommunity?: boolean
    inflation: number
    dual?: {
      rewardPerBlock: number
      earnLabel: string
      endBlock: number
    }
  }

  export interface SerializedToken {
    chainId: number
    address: string
    decimals: number
    symbol: string
    name: string
    projectLink: string
  }

  export interface Address {
    97?: string
    56: string
  }
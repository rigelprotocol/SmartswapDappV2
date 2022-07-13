import { SerializedFarmsState } from "./farm/types";
import { TokenInfo, TokenList, Tags } from '@uniswap/token-lists'
import {Token} from "@uniswap/sdk";


export interface BlockState {
    currentBlock: number
    initialBlock: number
  }

export interface State {
    block: BlockState
    farms: SerializedFarmsState
  }

export class WrappedTokenInfo extends Token {
    public readonly tokenInfo: TokenInfo

    public readonly tags: TagInfo[]

    constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
        super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
        this.tokenInfo = tokenInfo
        this.tags = tags
    }

    public get logoURI(): string | undefined {
        return this.tokenInfo.logoURI
    }
}

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
    id: string
}
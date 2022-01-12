import { SerializedFarmsState } from "./farm/types";

export interface BlockState {
    currentBlock: number
    initialBlock: number
  }

export interface State {
    block: BlockState
    farms: SerializedFarmsState
  }
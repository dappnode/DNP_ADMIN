import { ChainData } from "types";

// Service > chainData

export type ChainDataState = ChainData[];

export const UPDATE_CHAIN_DATA = "UPDATE_CHAIN_DATA";
export const REQUEST_CHAIN_DATA = "REQUEST_CHAIN_DATA";

export interface RequestChainData {
  type: typeof REQUEST_CHAIN_DATA;
}

export interface UpdateChainData {
  type: typeof UPDATE_CHAIN_DATA;
  chainData: ChainData[];
}

export type AllReducerActions = RequestChainData | UpdateChainData;

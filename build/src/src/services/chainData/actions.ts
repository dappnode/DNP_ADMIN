import {
  REQUEST_CHAIN_DATA,
  UPDATE_CHAIN_DATA,
  RequestChainData,
  UpdateChainData
} from "./types";
import { ChainData } from "types";

// Service > chainData

export const requestChainData = (): RequestChainData => ({
  type: REQUEST_CHAIN_DATA
});

export const updateChainData = (chainData: ChainData[]): UpdateChainData => ({
  type: UPDATE_CHAIN_DATA,
  chainData
});

import { mountPoint } from "./data";
import { ChainDataState } from "./types";
import { ChainData } from "types";

// Service > chainData

const getLocal = (state: any): ChainDataState => state[mountPoint];

export const getChainData = (state: any): ChainData[] => getLocal(state);

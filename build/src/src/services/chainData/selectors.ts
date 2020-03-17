import { mountPoint } from "./data";
import { stringIncludes } from "../../utils/strings";
import { ChainDataState } from "./types";
import { ChainData } from "types";

// Service > chainData

const getLocal = (state: any): ChainDataState => state[mountPoint];

export const getChainData = (state: any): ChainData[] => getLocal(state);
export const getMainnet = (state: any): ChainData | undefined =>
  getChainData(state).find(({ name }) => stringIncludes(name, "mainnet"));

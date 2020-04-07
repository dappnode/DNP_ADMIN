import { mountPoint } from "./data";
import { isEmpty } from "lodash";
import { ChainDataState } from "./types";
import { ChainData } from "types";

// Service > chainData

const getLocal = (state: any): ChainDataState => state[mountPoint];

export const getChainData = (state: any): ChainData[] => {
  const chains = getLocal(state);

  // Legacy check, may not be necessary
  // Make sure all chainData objects exist and are populated
  return chains.filter(data => data && !isEmpty(data));
};

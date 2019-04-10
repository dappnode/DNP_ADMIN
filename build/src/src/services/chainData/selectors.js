import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { stringIncludes } from "../../utils/strings";

// Service > chainData

export const getChainData = createSelector(
  state => state[mountPoint],
  chainData => chainData
);

export const getMainnet = createSelector(
  getChainData,
  chainData =>
    chainData.find(({ name }) => stringIncludes(name, "mainnet")) || {}
);

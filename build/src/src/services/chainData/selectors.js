import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > chainData

export const getChainData = createSelector(
  state => state[mountPoint],
  chainData => chainData
);

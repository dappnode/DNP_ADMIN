import * as t from "./actionTypes";

// Service > chainData

export const requestChainData = () => ({
  type: t.REQUEST_CHAIN_DATA
});

export const updateChainData = chainData => ({
  type: t.UPDATE_CHAIN_DATA,
  chainData
});

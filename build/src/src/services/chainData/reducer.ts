import { Reducer } from "redux";
import { UPDATE_CHAIN_DATA, ChainDataState, AllReducerActions } from "./types";

// Service > chainData

export const reducer: Reducer<ChainDataState, AllReducerActions> = (
  state = [],
  action
) => {
  switch (action.type) {
    case UPDATE_CHAIN_DATA:
      return action.chainData;

    default:
      return state;
  }
};

import * as t from "./types";
import { ChainDataState, AllReducerActions } from "./types";

// Service > chainData

export default function(state = [], action: AllReducerActions): ChainDataState {
  switch (action.type) {
    case t.UPDATE_CHAIN_DATA:
      return action.chainData;

    default:
      return state;
  }
}

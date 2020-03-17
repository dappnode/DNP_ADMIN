import * as t from "./types";
import parseChainDataMessages from "./parsers/parseChainDataMessages";
import { isEmpty } from "lodash";
import { ChainDataState, AllReducerActions } from "./types";

// Service > chainData

export default function(state = [], action: AllReducerActions): ChainDataState {
  switch (action.type) {
    case t.UPDATE_CHAIN_DATA:
      // Format chain data before commiting to the store
      return (
        action.chainData
          // Make sure all chainData objects exist and are populated
          .filter(data => data && !isEmpty(data))
          .map(parseChainDataMessages)
      );

    default:
      return state;
  }
}

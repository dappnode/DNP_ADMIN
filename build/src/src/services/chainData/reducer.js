import * as t from "./actionTypes";
import parseChainDataMessages from "./parsers/parseChainDataMessages";

// Service > chainData

/**
 * @param state = chainData = [{
 *   name: "kovan",
 *   message: "Syncing 5936184/6000000",
 *   syncing: true,
 *   progress: 0.8642
 * }, ... ]
 * [Tested]
 */

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_CHAIN_DATA:
      // Format chain data before commiting to the store
      return action.chainData.map(parseChainDataMessages);

    default:
      return state;
  }
}

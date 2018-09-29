// DASHBOARD
import * as t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  dappnodeStats: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_DAPPNODE_STATS:
      return merge(state, {
        dappnodeStats: action.stats
      });
    default:
      return state;
  }
}

// NAVBAR
import * as t from "./actionTypes";

const initialState = {
  dappnodeIdentity: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_DAPPNODE_IDENTITY:
      return {
        ...state,
        dappnodeIdentity: action.dappnodeIdentity
      };
    default:
      return state;
  }
}

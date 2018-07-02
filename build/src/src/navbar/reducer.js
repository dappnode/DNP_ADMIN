// NAVBAR
import * as t from "./actionTypes";

const initialState = {
  vpnParams: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.PARAMS:
      return {
        ...state,
        vpnParams: action.payload
      };
    default:
      return state;
  }
}

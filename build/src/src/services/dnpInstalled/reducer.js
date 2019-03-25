import * as t from "./actionTypes";

// Service > dnpInstalled

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_DNP_INSTALLED:
      return action.dnps;

    default:
      return state;
  }
}

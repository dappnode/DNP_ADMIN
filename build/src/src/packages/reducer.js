//  PACKAGES
import * as t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  logs: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_LOG:
      return merge(state, {
        logs: {
          [action.id]: action.logs
        }
      });
    default:
      return state;
  }
}

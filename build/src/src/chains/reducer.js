// WATCHERS
import * as t from "./actionTypes";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_STATUS:
      return {
        ...state,
        [action.id]: action.payload
      };
    default:
      return state;
  }
}

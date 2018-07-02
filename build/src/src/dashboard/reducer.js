// WATCHERS
import * as t from "./actionTypes";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_STATUS:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    default:
      return state;
  }
}

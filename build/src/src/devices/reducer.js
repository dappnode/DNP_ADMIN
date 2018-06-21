import * as t from "./actionTypes";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE:
      return action.payload;
    default:
      return state;
  }
}

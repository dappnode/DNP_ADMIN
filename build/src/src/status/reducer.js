// WATCHERS
import * as t from "./actionTypes";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case "IS_ADMIN":
      return {
        ...state,
        isAdmin: {
          ...state.isAdmin,
          status: action.isAdmin ? 1 : -1,
          msg: action.isAdmin ? "ok" : "not admin"
        }
      };
    case t.UPDATE_STATUS:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    default:
      return state;
  }
}

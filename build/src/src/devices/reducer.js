// DEVICES
import * as t from "./actionTypes";

const initialState = {
  fetching: false,
  devices: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE:
      return {
        ...state,
        devices: action.devices
      };
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    default:
      return state;
  }
}

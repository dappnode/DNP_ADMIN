import merge from "deepmerge";
import {
  UPDATE_DNP_REQUEST,
  SET_DNP_REQUEST,
  AllActionTypes,
  DnpRequestState
} from "./types";

// Service > dnpRequest

const initialState: DnpRequestState = {
  dnps: {},
  requestStatus: {}
};

export default (state = initialState, action: AllActionTypes) => {
  switch (action.type) {
    case UPDATE_DNP_REQUEST:
      return {
        ...state,
        dnps: {
          [action.id]: merge(state.dnps[action.id] || {}, action.dnp)
        }
      };

    case SET_DNP_REQUEST:
      return {
        ...state,
        dnps: {
          [action.id]: action.dnp
        }
      };

    default:
      return state;
  }
};

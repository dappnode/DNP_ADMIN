import merge from "deepmerge";
import {
  UPDATE_DNP_REQUEST,
  SET_DNP_REQUEST,
  AllActionTypes,
  DnpRequestState,
  UPDATE_DNP_REQUEST_STATUS
} from "./types";

// Service > dnpRequest

const initialState: DnpRequestState = {
  dnps: {},
  requestStatus: {}
};

export default function(
  state: DnpRequestState = initialState,
  action: AllActionTypes
): DnpRequestState {
  switch (action.type) {
    case UPDATE_DNP_REQUEST:
      return {
        ...state,
        dnps: {
          ...state.dnps,
          [action.id]: merge(state.dnps[action.id] || {}, action.dnp)
        }
      };

    case SET_DNP_REQUEST:
      return {
        ...state,
        dnps: {
          ...state.dnps,
          [action.id]: action.dnp
        }
      };

    case UPDATE_DNP_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          [action.id]: action.requestStatus
        }
      };

    default:
      return state;
  }
}

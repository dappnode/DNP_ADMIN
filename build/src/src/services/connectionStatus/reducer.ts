import { Reducer } from "redux";
import {
  ConnectionStatusState,
  AllReducerActions,
  CONNECTION_OPEN,
  CONNECTION_CLOSE
} from "./types";

// Service > connectionStatus

export const reducer: Reducer<ConnectionStatusState, AllReducerActions> = (
  state = {
    isOpen: false,
    isNotAdmin: false,
    error: null
  },
  action
) => {
  switch (action.type) {
    case CONNECTION_OPEN:
      return {
        ...state,
        isOpen: true,
        error: null,
        isNotAdmin: false
      };

    case CONNECTION_CLOSE:
      return {
        ...state,
        isOpen: false,
        error: action.error,
        isNotAdmin: action.isNotAdmin
      };

    default:
      return state;
  }
};

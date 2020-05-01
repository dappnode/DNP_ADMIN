import {
  ConnectionStatusState,
  AllReducerActions,
  CONNECTION_OPEN,
  CONNECTION_CLOSE
} from "./types";

// Service > connectionStatus

const initialState: ConnectionStatusState = {
  isOpen: false,
  isNotAdmin: false,
  error: null
};

export default function(
  state: ConnectionStatusState = initialState,
  action: AllReducerActions
): ConnectionStatusState {
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
}

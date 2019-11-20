import {
  DnpDirectoryState,
  AllReducerActions,
  SET_DNP_DIRECTORY,
  UPDATE_DIRECTORY_STATUS
} from "./types";

// Service > dnpDirectory

const initialState: DnpDirectoryState = {
  directory: [],
  requestStatus: {}
};

export default (
  state = initialState,
  action: AllReducerActions
): DnpDirectoryState => {
  switch (action.type) {
    case SET_DNP_DIRECTORY:
      return {
        ...state,
        directory: action.directory
      };

    case UPDATE_DIRECTORY_STATUS:
      return {
        ...state,
        requestStatus: action.requestStatus
      };

    default:
      return state;
  }
};

import {
  DnpDirectoryState,
  AllReducerActions,
  UPDATE_DNP_DIRECTORY
} from "./types";

// Service > dnpDirectory

const initialState: DnpDirectoryState = [];

export default (state = initialState, action: AllReducerActions) => {
  switch (action.type) {
    case UPDATE_DNP_DIRECTORY:
      return action.directory;

    default:
      return state;
  }
};

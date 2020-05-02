import { keyBy } from "lodash";
import {
  DnpDirectoryState,
  AllReducerActions,
  SET_DNP_DIRECTORY,
  UPDATE_DIRECTORY_STATUS
} from "./types";
import { Reducer } from "redux";

// Service > dnpDirectory

export const reducer: Reducer<DnpDirectoryState, AllReducerActions> = (
  state = {
    directory: [],
    requestStatus: {}
  },
  action
) => {
  switch (action.type) {
    // Updates can come when the directory is already loaded
    // On a per DNP basis, discard updates of status "loading"
    // If the current status is "ok"
    case SET_DNP_DIRECTORY: {
      const directoryByName = keyBy(state.directory, dnp => dnp.name);
      return {
        ...state,
        directory: action.directory.map(dnp => {
          const currentDnp = directoryByName[dnp.name];
          return dnp.status === "loading" &&
            currentDnp &&
            currentDnp.status === "ok"
            ? currentDnp
            : dnp;
        })
      };
    }

    case UPDATE_DIRECTORY_STATUS:
      return {
        ...state,
        requestStatus: action.requestStatus
      };

    default:
      return state;
  }
};

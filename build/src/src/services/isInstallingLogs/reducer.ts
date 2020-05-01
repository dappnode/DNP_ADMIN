import { omit, omitBy } from "lodash";
import {
  UPDATE_IS_INSTALLING_LOG,
  AllActionTypes,
  IsInstallingLogsState,
  CLEAR_IS_INSTALLING_LOG
} from "./types";

// Service > isInstallingLogs

const initialState: IsInstallingLogsState = {
  logs: {},
  dnpNameToLogId: {}
};

export default function(
  state: IsInstallingLogsState = initialState,
  action: AllActionTypes
): IsInstallingLogsState {
  switch (action.type) {
    case UPDATE_IS_INSTALLING_LOG:
      const prevId = state.dnpNameToLogId[action.dnpName];
      const removePrevId = prevId && action.id !== prevId;
      // If there is a double installation, prevent the install log to update
      // Otherwise there could be confusing messages on the UI, which will display both

      return {
        logs: {
          ...(removePrevId ? omit(state.logs, prevId) : state.logs),
          [action.id]: {
            ...(state.logs[action.id] || {}),
            [action.dnpName]: action.log
          }
        },
        dnpNameToLogId: {
          ...state.dnpNameToLogId,
          [action.dnpName]: action.id
        }
      };

    case CLEAR_IS_INSTALLING_LOG:
      return {
        ...state,
        logs: omit(state.logs, action.id),
        dnpNameToLogId: omitBy(state.dnpNameToLogId, id => id === action.id)
      };

    default:
      return state;
  }
}

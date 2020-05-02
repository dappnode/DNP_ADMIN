import {
  UserActionLogsState,
  AllReducerActions,
  UPDATE_USER_ACTION_LOGS,
  PUSH_USER_ACTION_LOG
} from "./types";
import { Reducer } from "redux";

// Service > userActionLogs

export const reducer: Reducer<UserActionLogsState, AllReducerActions> = (
  state = [],
  action
) => {
  switch (action.type) {
    case UPDATE_USER_ACTION_LOGS:
      return action.userActionLogs;

    case PUSH_USER_ACTION_LOG:
      return [action.userActionLog, ...state];

    default:
      return state;
  }
};

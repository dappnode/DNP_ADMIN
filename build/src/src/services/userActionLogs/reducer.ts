import {
  UserActionLogsState,
  AllReducerActions,
  UPDATE_USER_ACTION_LOGS,
  PUSH_USER_ACTION_LOG
} from "./types";

// Service > userActionLogs

export default function(
  state: UserActionLogsState = [],
  action: AllReducerActions
): UserActionLogsState {
  switch (action.type) {
    case UPDATE_USER_ACTION_LOGS:
      return action.userActionLogs;

    case PUSH_USER_ACTION_LOG:
      return [action.userActionLog, ...state];

    default:
      return state;
  }
}

import { UserActionLogWithCount } from "types";

// Service > userActionLogs

export type UserActionLogsState = UserActionLogWithCount[];

export const UPDATE_USER_ACTION_LOGS = "UPDATE_USER_ACTION_LOGS";
export const PUSH_USER_ACTION_LOG = "PUSH_USER_ACTION_LOG";
export const FETCH_USER_ACTION_LOGS = "FETCH_USER_ACTION_LOGS";

export interface UpdateUserActionLogs {
  type: typeof UPDATE_USER_ACTION_LOGS;
  userActionLogs: UserActionLogWithCount[];
}

export interface PushUserActionLog {
  type: typeof PUSH_USER_ACTION_LOG;
  userActionLog: UserActionLogWithCount;
}

export type AllReducerActions = UpdateUserActionLogs | PushUserActionLog;

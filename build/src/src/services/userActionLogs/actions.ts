import {
  UPDATE_USER_ACTION_LOGS,
  PUSH_USER_ACTION_LOG,
  FETCH_USER_ACTION_LOGS,
  PushUserActionLog,
  UpdateUserActionLogs
} from "./types";
import { UserActionLogWithCount } from "types";

// Service > userActionLogs

export const updateUserActionLogs = (
  userActionLogs: UserActionLogWithCount[]
): UpdateUserActionLogs => ({
  type: UPDATE_USER_ACTION_LOGS,
  userActionLogs
});

export const pushUserActionLog = (
  userActionLog: UserActionLogWithCount
): PushUserActionLog => ({
  type: PUSH_USER_ACTION_LOG,
  userActionLog
});

export const fetchUserActionLogs = () => ({
  type: FETCH_USER_ACTION_LOGS
});

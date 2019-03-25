import * as t from "./actionTypes";

// Service > userActionLogs

export const updateUserActionLogs = userActionLogs => ({
  type: t.UPDATE_USER_ACTION_LOGS,
  userActionLogs
});

export const pushUserActionLog = userActionLog => ({
  type: t.PUSH_USER_ACTION_LOG,
  userActionLog
});

export const fetchUserActionLogs = () => ({
  type: t.FETCH_USER_ACTION_LOGS
});

import * as t from "./actionTypes";

// Service > userActionLogs

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_USER_ACTION_LOGS:
      return action.userActionLogs;

    case t.PUSH_USER_ACTION_LOG:
      return [...state, action.userActionLog];

    default:
      return state;
  }
}

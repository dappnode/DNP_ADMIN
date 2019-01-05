// WATCHERS
import t from "./actionTypes";

const initialState = {
  userActionLogs: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_USERACTIONLOGS:
      return {
        ...state,
        userActionLogs: action.userActionLogs
      };
    case "NEW_USER_ACTION_LOG":
      return {
        ...state,
        userActionLogs: [...state.userActionLogs, action.userActionLog]
      };
    default:
      return state;
  }
}

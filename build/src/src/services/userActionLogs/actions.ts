import { api } from "api";
import { userActionLogsSlice } from "./reducer";
import { AppThunk } from "store";
import { parseUserActionLogsString } from "utils/parseUserActionLogsString";

// Service > userActionLogs

export const fetchUserActionLogs = (): AppThunk => async dispatch => {
  try {
    const userActionLogs = await api
      .getUserActionLogs({})
      .then(parseUserActionLogsString);
    dispatch(updateUserActionLogs(userActionLogs));
  } catch (e) {
    console.error("Error fetching userActionLogs: ", e);
  }
};

const { updateUserActionLogs, pushUserActionLog } = userActionLogsSlice.actions;
export { pushUserActionLog };

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { UserActionLogWithCount } from "types";

// Service > userActionLogs

export const userActionLogsAdapter = createEntityAdapter<
  UserActionLogWithCount
>({
  selectId: userActionLog => userActionLog.timestamp,
  sortComparer: (a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
});

export const userActionLogsSlice = createSlice({
  name: "userActionLogs",
  initialState: userActionLogsAdapter.getInitialState(),
  reducers: {
    updateUserActionLogs: userActionLogsAdapter.setAll,
    pushUserActionLog: userActionLogsAdapter.addOne
  }
});

export const reducer = userActionLogsSlice.reducer;

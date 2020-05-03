import { RootState } from "rootReducer";
import { userActionLogsAdapter } from "./reducer";

// Service > userActionLogs

const selector = userActionLogsAdapter.getSelectors<RootState>(
  state => state.userActionLogs
);

export const getUserActionLogs = selector.selectAll;

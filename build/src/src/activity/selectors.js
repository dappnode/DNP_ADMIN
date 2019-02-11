// ACTIVITY
import { NAME } from "./constants";
import { createSelector } from "reselect";

const getLocal = createSelector(
  state => state[NAME],
  local => local
);
export const getUserActionLogs = createSelector(
  getLocal,
  local => (local.userActionLogs || []).slice().reverse()
);

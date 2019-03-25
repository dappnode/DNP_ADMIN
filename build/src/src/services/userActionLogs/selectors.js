import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > userActionLogs

export const getUserActionLogs = createSelector(
  state => state[mountPoint],
  notifications => notifications
);

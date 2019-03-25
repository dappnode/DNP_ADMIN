import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > connectionStatus

export const getConnectionStatus = createSelector(
  state => state[mountPoint],
  connectionStatus => connectionStatus
);

export const getIsConnectionOpen = createSelector(
  getConnectionStatus,
  connectionStatus => connectionStatus.isOpen
);

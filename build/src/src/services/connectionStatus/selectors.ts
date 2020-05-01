import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { ConnectionStatusState } from "./types";

// Service > connectionStatus

const getLocal = (state: any): ConnectionStatusState => state[mountPoint];

export const getConnectionStatus = getLocal;

export const getIsConnectionOpen = createSelector(
  getConnectionStatus,
  connectionStatus => connectionStatus.isOpen
);

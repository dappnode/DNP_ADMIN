import { RootState } from "rootReducer";
import { createSelector } from "reselect";

// Service > connectionStatus

export const getConnectionStatus = (state: RootState) => state.connectionStatus;

export const getIsConnectionOpen = createSelector(
  getConnectionStatus,
  connectionStatus => connectionStatus.isOpen
);

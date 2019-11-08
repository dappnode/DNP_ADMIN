import { DirectoryItem, RequestStatus } from "types";

export type DnpDirectoryState = {
  directory: DirectoryItem[];
  requestStatus: RequestStatus;
};

export const SET_DNP_DIRECTORY = "SET_DNP_DIRECTORY";
export const UPDATE_DIRECTORY_STATUS = "UPDATE_DIRECTORY_STATUS";
export const FETCH_DNP_DIRECTORY = "FETCH_DNP_DIRECTORY";

export interface SetDnpDirectory {
  type: typeof SET_DNP_DIRECTORY;
  directory: DirectoryItem[];
}

export interface UpdateDirectoryStatus {
  type: typeof UPDATE_DIRECTORY_STATUS;
  requestStatus: RequestStatus;
}

export type AllReducerActions = SetDnpDirectory | UpdateDirectoryStatus;

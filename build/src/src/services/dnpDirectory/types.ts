import { DirectoryItem } from "types";

export type DnpDirectoryState = DirectoryItem[];

export const UPDATE_DNP_DIRECTORY = "UPDATE_DNP_DIRECTORY";
export const UPDATE_DNP_DIRECTORY_BY_ID = "UPDATE_DNP_DIRECTORY_BY_ID";
export const FETCH_DNP_DIRECTORY = "FETCH_DNP_DIRECTORY";

export interface UpdateDnpDirectory {
  type: typeof UPDATE_DNP_DIRECTORY;
  directory: DirectoryItem[];
}

export interface FetchDnpDirectory {
  type: typeof FETCH_DNP_DIRECTORY;
}

export type AllReducerActions = UpdateDnpDirectory;

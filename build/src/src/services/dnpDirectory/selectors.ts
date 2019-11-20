import { mountPoint } from "./data";
import { DnpDirectoryState } from "./types";

// Service > dnpDirectory

const getLocal = (state: any): DnpDirectoryState => state[mountPoint];

export const getDnpDirectory = (state: any) => getLocal(state).directory;
export const getDirectoryRequestStatus = (state: any) =>
  getLocal(state).requestStatus;

import {
  UpdateDnpDirectory,
  FetchDnpDirectory,
  UPDATE_DNP_DIRECTORY,
  FETCH_DNP_DIRECTORY
} from "./types";
import { DirectoryItem } from "types";

// Service > dnpDirectory

export function updateDnpDirectory(
  directory: DirectoryItem[]
): UpdateDnpDirectory {
  return {
    type: UPDATE_DNP_DIRECTORY,
    directory
  };
}

export function fetchDnpDirectory(): FetchDnpDirectory {
  return {
    type: FETCH_DNP_DIRECTORY
  };
}

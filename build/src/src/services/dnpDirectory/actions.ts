import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { api } from "api";
import {
  SetDnpDirectory,
  UpdateDirectoryStatus,
  SET_DNP_DIRECTORY,
  UPDATE_DIRECTORY_STATUS
} from "./types";
import { DirectoryItem, RequestStatus } from "types";

// Service > dnpDirectory

export function setDnpDirectory(directory: DirectoryItem[]): SetDnpDirectory {
  return {
    type: SET_DNP_DIRECTORY,
    directory
  };
}

export function updateStatus(
  requestStatus: RequestStatus
): UpdateDirectoryStatus {
  return {
    type: UPDATE_DIRECTORY_STATUS,
    requestStatus
  };
}

// Redux-thunk actions

export const fetchDnpDirectory = (): ThunkAction<
  void,
  {},
  null,
  AnyAction
> => async dispatch => {
  try {
    dispatch(updateStatus({ loading: true }));
    dispatch(setDnpDirectory(await api.fetchDirectory()));
    dispatch(updateStatus({ loading: false, success: true }));
  } catch (e) {
    dispatch(updateStatus({ loading: false, error: e.message }));
  }
};

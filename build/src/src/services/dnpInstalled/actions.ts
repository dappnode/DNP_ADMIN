import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import * as api from "API/calls";
import { RequestStatus, PackageContainer } from "types";
import {
  SetDnpRequest,
  UpdateDnpRequestStatus,
  SET_DNP_INSTALLED,
  UPDATE_DNP_INSTALLED_STATUS
} from "./types";

// Service > dnpInstalled

export function setDnpInstalled(
  dnpInstalled: PackageContainer[]
): SetDnpRequest {
  return {
    type: SET_DNP_INSTALLED,
    dnpInstalled
  };
}

export function updateStatus(
  requestStatus: RequestStatus
): UpdateDnpRequestStatus {
  return {
    type: UPDATE_DNP_INSTALLED_STATUS,
    requestStatus
  };
}

// Redux-thunk actions

export const fetchDnpInstalled = (): ThunkAction<
  void,
  {},
  null,
  AnyAction
> => async dispatch => {
  try {
    dispatch(updateStatus({ loading: true }));
    dispatch(setDnpInstalled(await api.listPackages({})));
    dispatch(updateStatus({ loading: false, success: true }));
  } catch (e) {
    dispatch(updateStatus({ loading: false, error: e.message }));
  }
};

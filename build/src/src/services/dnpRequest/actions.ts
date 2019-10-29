import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import * as api from "API/calls";
import { RequestedDnp, RequestStatus } from "types";
import {
  UpdateDnpRequest,
  SetDnpRequest,
  UpdateRequestStatus,
  UPDATE_DNP_REQUEST,
  SET_DNP_REQUEST,
  UPDATE_REQUEST_STATUS
} from "./types";

export function updateDnpRequest(
  id: string,
  dnp: RequestedDnp
): UpdateDnpRequest {
  return {
    type: UPDATE_DNP_REQUEST,
    id,
    dnp
  };
}

export function setDnpRequest(id: string, dnp: RequestedDnp): SetDnpRequest {
  return {
    type: SET_DNP_REQUEST,
    id,
    dnp
  };
}

export function updateRequestStatus(
  id: string,
  requestStatus: RequestStatus
): UpdateRequestStatus {
  return {
    type: UPDATE_REQUEST_STATUS,
    id,
    requestStatus
  };
}

// Redux-thunk actions

export const fetchDnpRequest = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  try {
    dispatch(updateRequestStatus(id, { loading: true }));
    const dnp = await api.fetchDnpRequest({ id });
    dispatch(setDnpRequest(id, dnp));
    dispatch(updateRequestStatus(id, { loading: false, success: true }));
  } catch (e) {
    dispatch(updateRequestStatus(id, { loading: false, error: e.message }));
  }
};

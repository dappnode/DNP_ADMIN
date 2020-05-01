import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { api } from "api";
import { RequestedDnp, RequestStatus } from "types";
import {
  UpdateDnpRequest,
  SetDnpRequest,
  UpdateDnpRequestStatus,
  UPDATE_DNP_REQUEST,
  SET_DNP_REQUEST,
  UPDATE_DNP_REQUEST_STATUS
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

export function updateStatus(
  requestStatus: RequestStatus,
  id: string
): UpdateDnpRequestStatus {
  return {
    type: UPDATE_DNP_REQUEST_STATUS,
    requestStatus,
    id
  };
}

// Redux-thunk actions

export const fetchDnpRequest = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  try {
    dispatch(updateStatus({ loading: true }, id));
    dispatch(setDnpRequest(id, await api.fetchDnpRequest({ id })));
    dispatch(updateStatus({ loading: false, success: true }, id));
  } catch (e) {
    dispatch(updateStatus({ loading: false, error: e.message }, id));
  }
};

import { RequestedDnp, RequestStatus } from "types";

export interface DnpRequestState {
  dnps: {
    [requestId: string]: RequestedDnp;
  };
  requestStatus: {
    [requestId: string]: RequestStatus;
  };
}

export const UPDATE_DNP_REQUEST = "UPDATE_DNP_REQUEST";
export const SET_DNP_REQUEST = "SET_DNP_REQUEST";
export const UPDATE_REQUEST_STATUS = "UPDATE_REQUEST_STATUS";

export interface UpdateDnpRequest {
  type: typeof UPDATE_DNP_REQUEST;
  id: string;
  dnp: RequestedDnp;
}

export interface SetDnpRequest {
  type: typeof SET_DNP_REQUEST;
  id: string;
  dnp: RequestedDnp;
}

export interface UpdateRequestStatus {
  type: typeof UPDATE_REQUEST_STATUS;
  id: string;
  requestStatus: RequestStatus;
}

export type AllActionTypes = UpdateDnpRequest | SetDnpRequest;

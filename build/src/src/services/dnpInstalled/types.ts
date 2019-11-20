import { PackageContainer, RequestStatus } from "types";

// Service > dnpInstalled

export interface DnpInstalledState {
  dnpInstalled: PackageContainer[];
  requestStatus: RequestStatus;
}

export const SET_DNP_INSTALLED = "SET_DNP_INSTALLED";
export const UPDATE_DNP_INSTALLED_STATUS = "UPDATE_DNP_INSTALLED_STATUS";

export interface SetDnpRequest {
  type: typeof SET_DNP_INSTALLED;
  dnpInstalled: PackageContainer[];
}

export interface UpdateDnpRequestStatus {
  type: typeof UPDATE_DNP_INSTALLED_STATUS;
  requestStatus: RequestStatus;
}

export type AllActionTypes = SetDnpRequest | UpdateDnpRequestStatus;

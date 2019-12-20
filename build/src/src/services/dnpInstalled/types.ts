import { PackageContainer, RequestStatus, PackageDetailData } from "types";

// Service > dnpInstalled

export interface DnpInstalledState {
  dnpInstalled: PackageContainer[];
  requestStatus: RequestStatus;
  dnpInstalledData: {
    [dnpName: string]: PackageDetailData;
  };
  dnpInstalledDataRequestStatus: {
    [dnpName: string]: RequestStatus;
  };
}

export const SET_DNP_INSTALLED = "SET_DNP_INSTALLED";
export const SET_DNP_INSTALLED_DATA = "SET_DNP_INSTALLED_DATA";
export const UPDATE_DNP_INSTALLED_STATUS = "UPDATE_DNP_INSTALLED_STATUS";
export const UPDATE_DNP_INSTALLED_DATA_STATUS =
  "UPDATE_DNP_INSTALLED_DATA_STATUS";

export interface SetDnpInstalled {
  type: typeof SET_DNP_INSTALLED;
  dnpInstalled: PackageContainer[];
}

export interface SetDnpInstalledData {
  type: typeof SET_DNP_INSTALLED_DATA;
  id: string;
  dnpInstalledData: PackageDetailData;
}

export interface UpdateDnpInstalledStatus {
  type: typeof UPDATE_DNP_INSTALLED_STATUS;
  requestStatus: RequestStatus;
}

export interface UpdateDnpInstalledDataStatus {
  type: typeof UPDATE_DNP_INSTALLED_DATA_STATUS;
  id: string;
  requestStatus: RequestStatus;
}

export type AllActionTypes =
  | SetDnpInstalled
  | SetDnpInstalledData
  | UpdateDnpInstalledStatus
  | UpdateDnpInstalledDataStatus;

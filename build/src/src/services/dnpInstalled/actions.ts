import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { api } from "api";
import { RequestStatus, PackageContainer, PackageDetailData } from "types";
import {
  SetDnpInstalled,
  SetDnpInstalledData,
  UpdateDnpInstalledStatus,
  UpdateDnpInstalledDataStatus,
  SET_DNP_INSTALLED,
  SET_DNP_INSTALLED_DATA,
  UPDATE_DNP_INSTALLED_STATUS,
  UPDATE_DNP_INSTALLED_DATA_STATUS
} from "./types";

// Service > dnpInstalled

export function setDnpInstalled(
  dnpInstalled: PackageContainer[]
): SetDnpInstalled {
  return {
    type: SET_DNP_INSTALLED,
    dnpInstalled
  };
}

export function setDnpInstalledData(
  dnpInstalledData: PackageDetailData,
  id: string
): SetDnpInstalledData {
  return {
    type: SET_DNP_INSTALLED_DATA,
    dnpInstalledData,
    id
  };
}

export function updateStatus(
  requestStatus: RequestStatus
): UpdateDnpInstalledStatus {
  return {
    type: UPDATE_DNP_INSTALLED_STATUS,
    requestStatus
  };
}

export function updateDnpInstalledDataStatus(
  requestStatus: RequestStatus,
  id: string
): UpdateDnpInstalledDataStatus {
  return {
    type: UPDATE_DNP_INSTALLED_DATA_STATUS,
    requestStatus,
    id
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
    dispatch(setDnpInstalled(await api.listPackages()));
    dispatch(updateStatus({ loading: false, success: true }));
  } catch (e) {
    dispatch(updateStatus({ loading: false, error: e.message }));
  }
};

export const fetchDnpInstalledData = ({
  id
}: {
  id: string;
}): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  const updateStatusDnp = (requestStatus: RequestStatus) =>
    updateDnpInstalledDataStatus(requestStatus, id);
  try {
    dispatch(updateStatusDnp({ loading: true }));
    dispatch(setDnpInstalledData(await api.packageDetailDataGet({ id }), id));
    dispatch(updateStatusDnp({ loading: false, success: true }));
  } catch (e) {
    dispatch(updateStatusDnp({ loading: false, error: e.message }));
  }
};

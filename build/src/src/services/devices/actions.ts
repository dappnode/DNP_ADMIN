import { devicesSlice } from "./reducer";
import { api } from "api";
import { AppThunk } from "store";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import * as loadingIds from "services/loadingStatus/loadingIds";

export const fetchDevices = (): AppThunk => async dispatch => {
  try {
    dispatch(updateIsLoading(loadingIds.devices));
    dispatch(updateDevices(await api.devicesList()));
    dispatch(updateIsLoaded(loadingIds.devices));
  } catch (e) {
    console.error(`Error on fetchDevices: ${e.stack}`);
  }
};

export const updateDevices = devicesSlice.actions.updateDevices;
export const updateDevice = devicesSlice.actions.updateDevice;

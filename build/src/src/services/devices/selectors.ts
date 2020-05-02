import { RootState } from "rootReducer";
import { devicesAdapter } from "./reducer";

// Service > devices

const deviceSelector = devicesAdapter.getSelectors<RootState>(
  state => state.devices
);

/**
 * Return devices as an array and order them to place
 * the superAdmin as the first device
 */
export const getDevices = deviceSelector.selectAll;
export const getDeviceById = deviceSelector.selectById;
export const areThereDevices = (state: RootState): boolean =>
  deviceSelector.selectTotal(state) > 0;

import { RootState } from "rootReducer";
import { superAdminId } from "./data";
import { VpnDeviceState } from "./types";

// Service > devices

/**
 * Return devices as an array and order them to place
 * the superAdmin as the first device
 */
export const getDevices = (state: RootState): VpnDeviceState[] =>
  Object.values(state.devices).sort(d1 => (d1.id === superAdminId ? -1 : 0));

export const areThereDevices = (state: RootState): boolean =>
  getDevices(state).length > 0;

export const getDeviceById = (
  state: RootState,
  id: string
): VpnDeviceState | undefined => state.devices[id];

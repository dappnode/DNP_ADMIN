import { mountPoint, superAdminId } from "./data";
import { DevicesState, VpnDeviceState } from "./types";

// Service > devices

const getLocal = (state: any): DevicesState => state[mountPoint];

/**
 * Return devices as an array and order them to place
 * the superAdmin as the first device
 */
export function getDevices(state: any): VpnDeviceState[] {
  const devices = getLocal(state);
  return Object.values(devices).sort(d1 => {
    if (d1.id === superAdminId) return -1;
    else return 0;
  });
}

export function areThereDevices(state: any): boolean {
  return getDevices(state).length > 0;
}

export function getDeviceById(
  state: any,
  id: string
): VpnDeviceState | undefined {
  const devices = getLocal(state);
  return devices[id];
}

import { mountPoint, superAdminId } from "./data";
import { createSelector } from "reselect";

// Service > devices

/**
 * Return devices as an array and order them to place
 * the superAdmin as the first device
 */
export const getDevices = createSelector(
  state => state[mountPoint],
  devices =>
    Object.values(devices).sort(d1 => {
      if (d1.id === superAdminId) return -1;
      else return 0;
    })
);

export const areThereDevices = createSelector(
  getDevices,
  devices => Boolean(devices.length)
);

export const getDeviceById = createSelector(
  getDevices,
  (_, id) => id,
  (devices, id) => devices.find(d => d.id === id) || {}
);

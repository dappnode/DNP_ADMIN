// DEVICES
import { NAME, guestsName } from "./constants";
import { createSelector } from "reselect";

const getLocal = createSelector(
  state => state[NAME],
  local => local
);

export const getDevices = createSelector(
  getLocal,
  local => local.devices
);
export const getFetching = createSelector(
  getLocal,
  local => local.fetching
);

export const getDevicesWithoutGuest = createSelector(
  getDevices,
  devices =>
    devices.filter(
      device => (device.name || "").toLowerCase() !== guestsName.toLowerCase()
    )
);
export const getGuestUsersDevice = createSelector(
  getDevices,
  devices =>
    devices.find(
      device => (device.name || "").toLowerCase() === guestsName.toLowerCase()
    )
);

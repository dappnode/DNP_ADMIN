import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { getDeviceId } from "pages/devices/utils";

// Service > devices

export const getDevices = createSelector(
  state => state[mountPoint],
  devices => devices
);

const ADMIN_STATIC_IP_PREFIX = "172.33.10.";

// Make devices backwards compatible
export const getDevicesClean = createSelector(
  getDevices,
  devices =>
    Object.values(devices).map(device => ({
      ...device,
      id: getDeviceId(device),
      url: "url" in device ? device.url : device.otp,
      isAdmin:
        "admin" in device
          ? device.admin
          : "ip" in device
          ? device.ip.includes(ADMIN_STATIC_IP_PREFIX)
          : false
    }))
);

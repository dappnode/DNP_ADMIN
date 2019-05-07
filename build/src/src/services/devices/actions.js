import * as t from "./actionTypes";

// Service > devices

export const updateDevices = devices => ({
  type: t.UPDATE_DEVICES,
  devices
});

export const updateDevice = (id, data) => ({
  type: t.UPDATE_DEVICE,
  id,
  data
});

export const fetchDevices = () => ({
  type: t.FETCH_DEVICES
});

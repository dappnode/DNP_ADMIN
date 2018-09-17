// DEVICES
import * as t from "./actionTypes";

export const addDevice = id => ({
  type: t.CALL,
  method: "addDevice",
  msg: "Adding " + id + "...",
  id
});

export const removeDevice = id => ({
  type: t.CALL,
  method: "removeDevice",
  msg: "Removing " + id + "...",
  id
});

export const toggleAdmin = id => ({
  type: t.CALL,
  method: "toggleAdmin",
  msg: "Toggling " + id + "admin credentials...",
  id
});

export const fetchDevices = id => ({
  type: t.FETCH_DEVICES,
  id
});

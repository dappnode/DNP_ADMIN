// DEVICES
import * as t from "./actionTypes";
import * as APIcall from "API/crossbarCalls";

export const addDevice = id => ({
  type: t.CALL,
  call: "addDevice",
  id
});

export const removeDevice = id => ({
  type: t.CALL,
  call: "removeDevice",
  id
});

export const toggleAdmin = id => ({
  type: t.CALL,
  call: "toggleAdmin",
  id
});

export const fetchDevices = id => ({
  type: t.FETCH_DEVICES,
  id
});

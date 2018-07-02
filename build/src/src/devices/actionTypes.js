import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const ADD = type("devices/ADD");
export const UPDATE = type("devices/UPDATE");
export const FETCH_DEVICES = type("devices/FETCH_DEVICES");

// prefixing each type with the module name helps preventing name collisions

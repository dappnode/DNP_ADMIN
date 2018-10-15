import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const CALL = type("ADD");
export const REMOVE = type("REMOVE");
export const TOGGLE_ADMIN = type("TOGGLE_ADMIN");
export const UPDATE = type("UPDATE");
export const FETCH_DEVICES = type("FETCH_DEVICES");
export const UPDATE_FETCHING = type("UPDATE_FETCHING");

// prefixing each type with the module name helps preventing name collisions

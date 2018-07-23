import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const ADD = type("ADD");
export const CALL = type("CALL");
export const UPDATE = type("UPDATE");
export const UPDATE_PACKAGE = type("UPDATE_PACKAGE");
export const LIST_PACKAGES = type("LIST_PACKAGES");
export const UPDATE_LOG = type("UPDATE_LOG");
export const UPDATE_PACKAGES = type("UPDATE_PACKAGES");
export const UPDATE_SELECTED_VERSION = type("UPDATE_SELECTED_VERSION");
export const UPDATE_SELECTED_PACKAGE = type("UPDATE_SELECTED_PACKAGE");
export const UPDATE_SELECTED_TYPES = type("UPDATE_SELECTED_TYPES");
export const UPDATE_INPUT = type("UPDATE_INPUT");
export const INITIALIZED = type("INITIALIZED");
export const SET_ID = type("SET_ID");

// prefixing each type with the module name helps preventing name collisions

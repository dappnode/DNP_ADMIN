import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const ADD = type("ADD");
export const UPDATE = type("UPDATE");
export const UPDATE_FETCHING = type("UPDATE_FETCHING");
export const UPDATE_PACKAGE = type("UPDATE_PACKAGE");
export const UPDATE_DIRECTORY = type("UPDATE_DIRECTORY");
export const UPDATE_SELECTED_VERSION = type("UPDATE_SELECTED_VERSION");
export const UPDATE_SELECTED_PACKAGE = type("UPDATE_SELECTED_PACKAGE");
export const UPDATE_SELECTED_TYPES = type("UPDATE_SELECTED_TYPES");
export const UPDATE_INPUT = type("UPDATE_INPUT");
export const INITIALIZED = type("INITIALIZED");

// prefixing each type with the module name helps preventing name collisions

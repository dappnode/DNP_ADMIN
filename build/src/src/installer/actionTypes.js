import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const ADD = type("ADD");
export const INSTALL = type("INSTALL");
export const UPDATE_ENV = type("UPDATE_ENV");
export const OPEN_PORTS = type("OPEN_PORTS");
export const FETCH_PACKAGE_VERSIONS = type("FETCH_PACKAGE_VERSIONS");
export const UPDATE = type("UPDATE");
export const UPDATE_FETCHING = type("UPDATE_FETCHING");
export const UPDATE_PACKAGE = type("UPDATE_PACKAGE");
export const UPDATE_DIRECTORY = type("UPDATE_DIRECTORY");
export const UPDATE_SELECTED_VERSION = type("UPDATE_SELECTED_VERSION");
export const UPDATE_SELECTED_PACKAGE = type("UPDATE_SELECTED_PACKAGE");
export const UPDATE_SELECTED_TYPES = type("UPDATE_SELECTED_TYPES");
export const UPDATE_INPUT = type("UPDATE_INPUT");
export const ISINSTALLING = type("ISINSTALLING");
export const FETCH_DIRECTORY = type("FETCH_DIRECTORY");

// prefixing each type with the module name helps preventing name collisions

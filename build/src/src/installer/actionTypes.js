import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const INSTALL = type("INSTALL");
export const UPDATE_ENV = type("UPDATE_ENV");
export const OPEN_PORTS = type("OPEN_PORTS");
export const SHOULD_OPEN_PORTS = type("SHOULD_OPEN_PORTS");
export const FETCH_PACKAGE_DATA = type("FETCH_PACKAGE_DATA");
export const FETCH_PACKAGE_REQUEST = type("FETCH_PACKAGE_REQUEST");
export const UPDATE_FETCHING = type("UPDATE_FETCHING");
export const UPDATE_SELECTED_TYPES = type("UPDATE_SELECTED_TYPES");
export const UPDATE_INPUT = type("UPDATE_INPUT");
export const PROGRESS_LOG = type("PROGRESS_LOG");
export const CLEAR_PROGRESS_LOG = type("CLEAR_PROGRESS_LOG");
export const FETCH_DIRECTORY = type("FETCH_DIRECTORY");
export const DISK_SPACE_AVAILABLE = type("DISK_SPACE_AVAILABLE");
export const UPDATE_DISK_SPACE_AVAILABLE = type("UPDATE_DISK_SPACE_AVAILABLE");

// prefixing each type with the module name helps preventing name collisions

// WATCHERS
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_STATUS = type("UPDATE_STATUS");
export const UPDATE_USERACTIONLOGS = type("UPDATE_USERACTIONLOGS");

// prefixing each type with the module name helps preventing name collisions

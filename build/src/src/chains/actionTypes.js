// WATCHERS
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_STATUS = type("UPDATE_STATUS");

// prefixing each type with the module name helps preventing name collisions

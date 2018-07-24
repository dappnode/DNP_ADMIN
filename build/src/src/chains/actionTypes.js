// WATCHERS
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_STATUS = type("UPDATE_STATUS");
export const ADD_CHAIN = type("ADD_CHAIN");
export const REMOVE_CHAIN = type("REMOVE_CHAIN");
export const INSTALLED_PACKAGE = type("INSTALLED_PACKAGE");

// prefixing each type with the module name helps preventing name collisions

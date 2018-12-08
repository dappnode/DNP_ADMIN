import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const DIAGNOSE = type("DIAGNOSE");
export const UPDATE_DIAGNOSE = type("UPDATE_DIAGNOSE");
export const CLEAR_DIAGNOSE = type("CLEAR_DIAGNOSE");
export const COMPUTE_ISSUE_URL = type("COMPUTE_ISSUE_URL");
export const UPDATE_ISSUE_URL = type("UPDATE_ISSUE_URL");
export const UPDATE_INFO = type("UPDATE_INFO");

// prefixing each type with the module name helps preventing name collisions

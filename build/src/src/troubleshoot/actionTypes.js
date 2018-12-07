import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const COMPUTE_ISSUE_URL = type("COMPUTE_ISSUE_URL");
export const UPDATE_ISSUE_URL = type("UPDATE_ISSUE_URL");

// prefixing each type with the module name helps preventing name collisions

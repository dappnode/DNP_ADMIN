// WATCHERS
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_STATUS = type("UPDATE_STATUS");
export const IPFS_START = type("IPFS_START");
export const WAMP_START = type("WAMP_START");
export const STOP = type("STOP");

// prefixing each type with the module name helps preventing name collisions

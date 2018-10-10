// WATCHERS
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_DAPPNODE_STATS = type("UPDATE_DAPPNODE_STATS");
export const GET_DAPPNODE_STATS = type("GET_DAPPNODE_STATS");

// prefixing each type with the module name helps preventing name collisions

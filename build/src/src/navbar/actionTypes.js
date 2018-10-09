// NAVBAR
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_DAPPNODE_IDENTITY = type("UPDATE_DAPPNODE_IDENTITY");

// prefixing each type with the module name helps preventing name collisions

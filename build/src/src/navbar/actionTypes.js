// NAVBAR
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const PARAMS = type("PARAMS");

// prefixing each type with the module name helps preventing name collisions

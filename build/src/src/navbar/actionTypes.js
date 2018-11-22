// NAVBAR
import { NAME } from "./constants";

const type = tag => NAME + "/" + tag;

export const UPDATE_DAPPNODE_IDENTITY = type("UPDATE_DAPPNODE_IDENTITY");
// Notifications
export const PUSH_NOTIFICATION = type("PUSH_NOTIFICATION");
export const VIEWED_NOTIFICATIONS = type("VIEWED_NOTIFICATIONS");

// prefixing each type with the module name helps preventing name collisions

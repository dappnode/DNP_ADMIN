import { mountPoint } from "./data";
import { PackageNotification } from "types";

// Service > notifications

export const getNotifications = (state: any): PackageNotification[] =>
  Object.values(state[mountPoint] || {});

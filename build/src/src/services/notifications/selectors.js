import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > notifications

export const getNotifications = createSelector(
  state => state[mountPoint],
  notifications => notifications
);

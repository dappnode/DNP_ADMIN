import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > devices

export const getDevices = createSelector(
  state => state[mountPoint],
  devices => Object.values(devices)
);

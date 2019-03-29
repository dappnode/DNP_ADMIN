import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { objToArray } from "utils/objects";

// Service > devices

export const getDevices = createSelector(
  state => state[mountPoint],
  devices => objToArray(devices)
);

import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > dnpInstalled

export const getDnpInstalled = createSelector(
  state => state[mountPoint],
  dnps => dnps
);

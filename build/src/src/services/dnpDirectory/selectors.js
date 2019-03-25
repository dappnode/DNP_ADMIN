import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > dnpDirectory

export const getDnpDirectory = createSelector(
  state => state[mountPoint],
  dnpDirectory => dnpDirectory
);

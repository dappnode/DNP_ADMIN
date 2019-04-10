import { mountPoint } from "./data";
import { createSelector } from "reselect";
import _ from "lodash";

// Service > dnpDirectory

export const getDnpDirectory = createSelector(
  state => state[mountPoint],
  dnpDirectory => dnpDirectory
);

export const getDnpDirectoryWhitelisted = createSelector(
  getDnpDirectory,
  dnpDirectory => _.pickBy(dnpDirectory, dnp => dnp.whitelisted)
);

export const getDnpDirectoryById = createSelector(
  getDnpDirectory,
  (_, id) => id,
  (dnpDirectory, id) => dnpDirectory[id]
);

export const getDnpDepsById = createSelector(
  getDnpDirectoryById,
  dnp => ((dnp || {}).requestResult || {}).success || {}
);

// Parsers

// PACKAGES
import { NAME } from "./constants";
import { createSelector } from "reselect";
import parsePathname from "utils/parsePathname";

// #### EXTERNAL

export const getPackages = createSelector(
  state => state.installedPackages,
  _packages => _packages
);
// pathname = /packages/kovan.dnp.dappnode.eth
// pathname = /system/kovan.dnp.dappnode.eth
export const getUrlId = createSelector(
  state => state.router.location.pathname,
  pathname => parsePathname(pathname)[1] || ""
);
export const getModuleName = createSelector(
  state => state.router.location.pathname,
  pathname => parsePathname(pathname)[0] || ""
);

// #### INTERNAL
const getLocal = createSelector(
  state => state[NAME],
  local => local
);
const getLogs = createSelector(
  getLocal,
  local => local.logs
);

export const fetching = createSelector(
  getLocal,
  local => local.fetching || false
);
export const hasFetched = createSelector(
  getLocal,
  local => local.hasFetched || false
);
export const areThereDnps = createSelector(
  getPackages,
  dnps => Boolean((dnps || []).length)
);

// Package lists
export const getCorePackages = createSelector(
  getPackages,
  _packages => _packages.filter(p => p.isCORE)
);
export const getDnpPackages = createSelector(
  getPackages,
  _packages => _packages.filter(p => p.isDNP)
);
export const getDnp = createSelector(
  getUrlId,
  getPackages,
  (id, dnps) => dnps.find(dnp => dnp.name === id)
);

// Package logs
export const getDnpLogs = createSelector(
  getUrlId,
  getLogs,
  (id, logs) => logs[id]
);

// PACKAGES
import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { getDnpInstalled } from "services/dnpInstalled/selectors";

/**
 * Parses pathname parts
 * @param {String} pathname = '/packages/kovan.dnp.dappnode.eth'
 * @return {Array} ['packages', 'kovan.dnp.dappnode.eth']
 */
const parsePathname = pathname => (pathname || "").split("/").filter(e => e);

// #### EXTERNAL

export const getPackages = getDnpInstalled;

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
  state => state[mountPoint],
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
  getDnpInstalled,
  dnps => Boolean((dnps || []).length)
);

// Package lists
export const getFilteredPackages = createSelector(
  getDnpInstalled,
  _packages => _packages.filter(p => p.name !== "core.dnp.dappnode.eth")
);
export const getCorePackages = createSelector(
  getDnpInstalled,
  _packages => _packages.filter(p => p.isCORE)
);
export const getDnpPackages = createSelector(
  getDnpInstalled,
  _packages => _packages.filter(p => p.isDNP)
);
export const getDnp = createSelector(
  getUrlId,
  getDnpInstalled,
  (id, dnps) => dnps.find(dnp => dnp.name === id)
);

// Package logs
export const getDnpLogs = createSelector(
  getUrlId,
  getLogs,
  (id, logs) => logs[id]
);

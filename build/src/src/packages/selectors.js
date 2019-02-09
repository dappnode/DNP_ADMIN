// PACKAGES
import { NAME } from "./constants";
import { createSelector } from "reselect";

// Selectors provide a way to query data from the module state.
// While they are not normally named as such in a Redux project, they
// are always present.

// The first argument of connect is a selector in that it selects
// values out of the state atom, and returns an object representing a
// component’s props.

// I would urge that common selectors by placed in the selectors.js
// file so they can not only be reused within the module, but
// potentially be used by other modules in the application.

// I highly recommend that you check out reselect as it provides a
// way to build composable selectors that are automatically memoized.

// From https://jaysoo.ca/2016/02/28/applying-code-organization-rules-to-concrete-redux-code/

// Utils

// this.state.packageInfo[this.state.targetPackageName]

// #### EXTERNAL

export const getPackages = createSelector(
  state => state.installedPackages,
  _packages => _packages
);
const getUrlId = createSelector(
  state => state.router.location.pathname,
  pathname => (pathname || "").split(NAME + "/")[1] || ""
);

// #### INTERNAL
const getLocalState = createSelector(
  state => state[NAME],
  localState => localState
);
const getLogs = createSelector(
  getLocalState,
  localState => localState.logs
);

export const fetching = createSelector(
  getLocalState,
  localState => localState.fetching || false
);
export const hasFetched = createSelector(
  getLocalState,
  localState => localState.hasFetched || false
);

// Package lists
export const getCorePackages = createSelector(
  [getPackages],
  _packages => _packages.filter(p => p.isCORE)
);
export const getDnpPackages = createSelector(
  [getPackages],
  _packages => _packages.filter(p => p.isDNP)
);
export const getDnp = createSelector(
  [(_, id) => id, getPackages],
  (id, dnps) => dnps.find(dnp => dnp.name === id)
);

// Package logs
export const getDnpLogs = createSelector(
  [(_, id) => id, getLogs],
  (id, logs) => logs[id]
);

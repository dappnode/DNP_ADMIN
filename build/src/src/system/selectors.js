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
const packages = state => state.installedPackages;

// #### INTERNAL

const local = state => state[NAME];

export const systemUpdateAvailable = state =>
  local(state).systemUpdateAvailable;
export const coreDeps = state => local(state).coreDeps;
export const staticIp = state => local(state).staticIp;
export const staticIpInput = state => local(state).staticIpInput;

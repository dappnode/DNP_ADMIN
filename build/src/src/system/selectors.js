// PACKAGES
import { NAME } from "./constants";

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

const local = state => state[NAME];
const packages = state => local(state).packages;
const logs = state => local(state).logs;
export const systemUpdateAvailable = state =>
  local(state).systemUpdateAvailable;
export const coreDeps = state => local(state).coreDeps;
const pathname = state => state.router.location.pathname || "";
const id = state => pathname(state).split(NAME + "/")[1] || "";

// Package lists

export const getPackages = packages;
export const getCorePackages = state =>
  packages(state)
    .filter(p => p.isCORE)
    .filter(p => !p.name.includes("core.dnp"));
export const getDnpPackages = state => packages(state).filter(p => p.isDNP);

// Package logs

export const getLogs = state => logs(state)[id(state)];

// Selected package

export const getId = id;
export const getPackage = state =>
  packages(state).find(p => p.name === id(state)) || {};

export const getPackageId = state => getPackage(state).name || "";
export const getPackageIsCORE = state => getPackage(state).isCORE || false;

// PACKAGES
import { NAME } from "./constants";
import semver from "semver";

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
const getDirectory = state => state.directory;

// #### INTERNAL

const local = state => state[NAME];
const logs = state => local(state).logs;
const pathname = state => state.router.location.pathname || "";
const id = state => pathname(state).split(NAME + "/")[1] || "";
export const fetching = state => local(state).fetching || false;
export const hasFetched = state => local(state).hasFetched || false;

// Package lists

export const getPackages = packages;
export const getCorePackages = state => packages(state).filter(p => p.isCORE);
export const getDnpPackages = state => packages(state).filter(p => p.isDNP);

// Package logs

export const getLogs = state => logs(state)[id(state)];

// Selected package

export const getId = id;
export const getPackage = state =>
  packages(state).find(p => p.name === id(state)) || {};

export const getPackageId = state => getPackage(state).name || "";
export const getPackageIsCORE = state => getPackage(state).isCORE || false;

// Find packages that need to be upgraded

export const getDnpsToBeUpgraded = state => {
  const directory = getDirectory(state);
  // directory = {
  //   "admin.dnp.dappnode.eth": {
  //     manifest: {
  //       type: "dncore",
  //       version: "0.1.13"
  //     },
  //     name: "admin.dnp.dappnode.eth",
  //   },
  //   ...
  // };

  const dnps = getDnpPackages(state);
  // dnps = [
  //   {
  //     isCORE: true,
  //     isDNP: false,
  //     name: "dappmanager.dnp.dappnode.eth",
  //     version: "0.1.14"
  //   },
  //   ...
  // ];
  const dnpsToBeUpgraded = [];
  dnps.forEach(dnp => {
    const name = dnp.name;
    const currentVersion = dnp.version;
    const lastVersion = ((directory[name] || {}).manifest || {}).version;
    if (
      semver.valid(lastVersion) &&
      semver.valid(currentVersion) &&
      semver.gt(lastVersion, currentVersion)
    ) {
      dnpsToBeUpgraded.push({
        name,
        currentVersion,
        lastVersion
      });
    }
  });
  return dnpsToBeUpgraded;
};

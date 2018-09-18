import { createSelector } from "reselect";
import fp from "lodash/fp";
import { NAME } from "./constants";
import getTags from "utils/getTags";
import { isIpfsHash } from "./utils";

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

// #### EXTERNAL SELECTORS
export const session = state => state.session;
export const connectionOpen = state => session(state) && session(state).isOpen;
export const directory = state => state.directory;
export const installedPackages = state => state.installedPackages || [];

// #### INTERNAL SELECTORS
const local = state => state[NAME];
const packages = state => local(state).packages;
export const packageData = state => local(state).packageData;
export const selectedPackageId = state => local(state).selectedPackageId;
const selectedTypes = state => local(state).selectedTypes;
const inputValue = state => local(state).input;
export const isInstalling = state => local(state).isInstalling;
export const fetching = state => local(state).fetching || false;
export const shouldOpenPorts = state => local(state).shouldOpenPorts;
export const progressLogs = state => local(state).progressLogs;

const filterCompleted = todos => todos.filter(t => t.completed);
const filterActive = todos => todos.filter(t => !t.completed);

export const getAll = state => state[NAME];

// Input field

export const getInput = inputValue;

// Packages and directory
export const getDirectory = state => {
  const _directory = directory(state);
  // Compute the installation tag
  for (const pkgName of Object.keys(_directory)) {
    if (pkgName.startsWith("/ipfs/")) {
      const installed = installedPackages(state).find(
        pkg => pkg.origin === pkgName
      );
      _directory[pkgName].tag = installed ? "UPDATED" : "INSTALL";
    } else {
      const latestVersion = ((_directory[pkgName] || {}).manifest || {})
        .version;
      const _currentPkg = installedPackages(state).find(
        pkg => pkg.name === pkgName
      );
      const currentVersion = (_currentPkg || {}).version;
      _directory[pkgName].tag =
        currentVersion && latestVersion
          ? currentVersion === latestVersion
            ? "UPDATED"
            : "UPDATE"
          : "INSTALL";
    }
  }
  return _directory;
};

export const getFilteredDirectory = state => {
  const allPackages = Object.values(getDirectory(state)).reverse();
  const selectedPackages = allPackages
    // Filter by name
    .filter(pkg => {
      try {
        // Avoid expensive searches if input is empty
        if (!inputValue(state) || inputValue(state) === "") return true;
        return JSON.stringify(pkg.manifest).includes(inputValue(state));
      } catch (e) {
        console.error("Error searching manifest", e);
        return true;
      }
    })
    // Filter by type
    .filter(pkg => {
      const types = selectedTypes(state);
      if (types.length === 0) return true;
      // Prevent the app from crashing with defective packages
      return (
        pkg &&
        pkg.manifest &&
        pkg.manifest.type &&
        types.includes(pkg.manifest.type)
      );
    });
  if (selectedPackages.length) {
    return selectedPackages;
  } else {
    return allPackages;
  }
};

export const getFilteredDirectoryNonCores = state =>
  getFilteredDirectory(state).filter(
    pkg => pkg.manifest && pkg.manifest.type && pkg.manifest.type !== "dncore"
  );

// Selected package, for installation modal

export const selectedPackage = state =>
  packages(state)[selectedPackageId(state)] || {};

export const selectedPackageName = state => selectedPackage(state).name || "";

export const selectedPackageIsCORE = state => selectedPackage(state).name || "";

export const selectedPackageManifest = state =>
  selectedPackage(state).manifest || {};

export const selectedPackageVersions = state =>
  selectedPackage(state).versions || [];

export const selectedPackageVersionsNames = state =>
  selectedPackageVersions(state).map(v => v.version);

export const selectedPackageInstallTag = state => {
  if (isIpfsHash(selectedPackageId(state))) return "Install";
  let { tag } = getTags(selectedPackage(state));
  return tag;
};

export const manifestModal = state => {
  if (selectedPackageVersions(state).length > 0) {
    return selectedPackageVersions(state)[0].manifest;
  } else return {};
};

// Selected types, for the filter

export const getSelectedTypes = selectedTypes;

export const getCompleted = fp.compose(
  filterCompleted,
  getAll
);

export const getActive = fp.compose(
  filterActive,
  getAll
);

export const getCounts = createSelector(
  getAll,
  getCompleted,
  getActive,
  (allTodos, completedTodos, activeTodos) => ({
    all: allTodos.length,
    completed: completedTodos.length,
    active: activeTodos.length
  })
);

import { createSelector } from "reselect";
import fp from "lodash/fp";
import { NAME } from "./constants";
import getTags from "utils/getTags";

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
const directory = state => local(state).directory;
const selectedPackageId = state => local(state).selectedPackageId;
const selectedVersion = state => local(state).selectedVersion;
const selectedTypes = state => local(state).selectedTypes;
const inputValue = state => local(state).input;
export const fetching = state => local(state).fetching;

const filterCompleted = todos => todos.filter(t => t.completed);
const filterActive = todos => todos.filter(t => !t.completed);

export const getAll = state => state[NAME];

// Input field

export const getInput = inputValue;

// Packages and directory

export const getDirectory = state =>
  directory(state)
    .map(pkg => {
      return packages(state)[pkg.name] || pkg;
    })
    // Filter by name
    .filter(pkg => pkg.name.includes(inputValue(state)))
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
  let { tag } = getTags(selectedPackage(state));
  return tag;
};

export const getSelectedVersion = selectedVersion;

export const manifestModal = state => {
  const selectedPackageVersion = selectedPackageVersions(state).find(
    // Make sure the manifest is there and valid
    v => v.version === selectedVersion(state) && v.manifest
  );
  if (selectedPackageVersion) return selectedPackageVersion.manifest;
  return selectedPackageManifest(state);
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

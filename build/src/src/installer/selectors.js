import { createSelector } from "reselect";
import fp from "lodash/fp";
import merge from "deepmerge";
import { NAME } from "./constants";
import getTags from "utils/getTags";
import { isIpfsHash, urlToId } from "./utils";

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
export const connectionOpen = state => state.session && state.session.isOpen;
export const directory = state => state.directory;
export const installedPackages = state => state.installedPackages || [];
export const isSyncing = state => state.isSyncing;

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

// Generate an object to test if a DNP is installed
export const getIsInstalled = state =>
  installedPackages(state).reduce((obj, dnp) => {
    obj[dnp.name] = true;
    return obj;
  }, {});

// Gets the DNP info of the id in the url
// /#/installer/ipfs:QmaokAG8ECxpbLp4bqE6A3tBXsATZS7aN8RPd3DsE1haKz
export const getQueryId = state => {
  const pathname = state.router.location.pathname;
  const urlId = pathname.includes(`${NAME}/`) && pathname.split(`${NAME}/`)[1];
  return urlToId(urlId);
};
export const getQueryDnp = state => {
  const id = getQueryId(state);
  return directory(state)[id];
};
export const getQueryDnpName = state => {
  return (getQueryDnp(state) || {}).name;
};

// Get the current ENVs if the package is installed.
function getInstalledDnp(state, dnpName) {
  return installedPackages(state).find(({ name }) => name === dnpName) || {};
}

/**
 * ENVS
 */

/**
 * Parse the ENVs of a manifest object
 * @param {Object} manifest
 * @return {Object} envs = {ENV_NAME: "ENV_VALUE"}
 */
function parseManifestEnvs(manifest = {}) {
  const envsArray = (manifest.image || {}).environment || [];
  return envsArray.reduce((obj, row) => {
    const [key, value] = (row || "").trim().split("=");
    obj[key] = value || "";
    return obj;
  }, {});
}

// The key .envs already contains ENVs as an object
function getInstalledDnpEnvs(state, dnpName) {
  return getInstalledDnp(state, dnpName).envs || {};
}

// Envs for the current query. Should merge envs object from
// 1. User set
// 2. Previously set if already installed (on updates)
// 3. Default values on the manifest
export const getEnvs = state => {
  // First get the query DNP, from the url
  const queryDnp = getQueryDnp(state);
  const defaultEnvs = {};

  // Prioritize ENVs set at the installation before the default ones on the manifest
  defaultEnvs[queryDnp.name] = merge(
    parseManifestEnvs(queryDnp.manifest),
    getInstalledDnpEnvs(state, queryDnp.name)
  );
  // Append the ENVs of the dependencies
  const dnps = (queryDnp.requestResult || {}).success || {};
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = directory(state)[`${depName}@${dnps[depName]}`] || {};
      defaultEnvs[depName] = merge(
        parseManifestEnvs(depDnp.manifest),
        getInstalledDnpEnvs(state, depName)
      );
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, local(state).userSetEnvs);
};

/**
 * PORTS
 */

/**
 * Parse the ports of a manifest object
 * @param {Object} manifest
 * @return {Object} ports = {containerAndType: hostPort}
 */
function parseManifestPorts(manifest = {}) {
  const portsArray = (manifest.image || {}).ports || [];
  return portsArray.reduce((obj, port) => {
    if (port.includes(":")) {
      // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
      const [host, containerAndType] = port.split(/:(.+)/);
      obj[containerAndType] = host;
    } else {
      // CONTAINER/type, return [null, CONTAINER/type]
      obj[port] = "";
    }
    return obj;
  }, {});
}

export const getPorts = state => {
  // First get the query DNP, from the url
  const queryDnp = getQueryDnp(state);
  const defaultEnvs = {};

  // Ports cannot be changed after the DNP is installed
  defaultEnvs[queryDnp.name] = parseManifestPorts(queryDnp.manifest);

  // Append the ENVs of the dependencies
  const dnps = (queryDnp.requestResult || {}).success || {};
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = directory(state)[`${depName}@${dnps[depName]}`] || {};
      defaultEnvs[depName] = parseManifestPorts(depDnp.manifest);
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, local(state).userSetEnvs);
};

/**
 * VOLS
 */

/**
 * Parse the vols of a manifest object
 * @param {Object} manifest
 * @return {Object} vols = {containerAndAccessmode: hostPath}
 */
function parseManifestVols(manifest = {}) {
  // HOST:CONTAINER:accessMode, return [HOST, CONTAINER:accessMode]
  const volsArray = (manifest.image || {}).volumes || [];
  return volsArray.reduce((obj, vol) => {
    // regex to split by first occurrence of ":"
    const [host, containerAndAccessmode] = vol.split(/:(.+)/);
    obj[containerAndAccessmode] = host;
    return obj;
  }, {});
}

export const getVols = state => {
  // First get the query DNP, from the url
  const queryDnp = getQueryDnp(state);
  const defaultEnvs = {};

  // Vols cannot be changed after the DNP is installed
  defaultEnvs[queryDnp.name] = parseManifestVols(queryDnp.manifest);

  // Append the ENVs of the dependencies
  const dnps = (queryDnp.requestResult || {}).success || {};
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = directory(state)[`${depName}@${dnps[depName]}`] || {};
      defaultEnvs[depName] = parseManifestVols(depDnp.manifest);
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, local(state).userSetEnvs);
};

/**
 * Should hide card headers?
 * - Only if envs, ports and vols only have one DNP and is the query
 */
export const getHideCardHeaders = state => {
  const envs = getEnvs(state);
  const ports = getPorts(state);
  const vols = getVols(state);
  const queryDnpName = getQueryDnpName(state);
  return (
    Object.keys(envs).length === 1 &&
    envs[queryDnpName] &&
    Object.keys(ports).length === 1 &&
    ports[queryDnpName] &&
    Object.keys(vols).length === 1 &&
    vols[queryDnpName]
  );
};

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

export const directoryLoaded = state => {
  return Boolean(Object.keys(directory(state)).length);
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
      if (Object.keys(types).length === 0) return true;
      // Prevent the app from crashing with defective packages
      return (
        pkg && pkg.manifest && pkg.manifest.type && types[pkg.manifest.type]
      );
    });
  return selectedPackages;
};

export const getFilteredDirectoryNonCores = state =>
  getFilteredDirectory(state).filter(pkg => {
    if (!pkg.manifest) {
      // If packages are broken, display them anyway
      return true;
    } else {
      return (
        pkg.manifest && pkg.manifest.type && pkg.manifest.type !== "dncore"
      );
    }
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

import { createSelector } from "reselect";
import fp from "lodash/fp";
import merge from "deepmerge";
import { NAME } from "./constants";
import { urlToId } from "./utils";

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
export const packageData = state => local(state).packageData;
export const selectedPackageId = state => local(state).selectedPackageId;
const selectedTypes = state => local(state).selectedTypes;
const inputValue = state => local(state).input;
export const isInstalling = state => local(state).isInstalling;
export const fetching = state => local(state).fetching || false;
export const shouldOpenPorts = state => local(state).shouldOpenPorts;
export const progressLogs = state => local(state).progressLogs;
export const getUserSetEnvs = state => local(state).userSetEnvs;
export const getUserSetPorts = state => local(state).userSetPorts;
export const getUserSetVols = state => local(state).userSetVols;
export const getShowAdvancedSettings = state =>
  local(state).showAdvancedSettings;

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
export const getQueryDnpDeps = state => {
  // Packages that are part of the dependency tree but are already updated
  // will not appear in the success object
  const { success, alreadyUpdated } =
    (getQueryDnp(state) || {}).requestResult || {};
  return merge(alreadyUpdated || {}, success || {});
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

function getDnpFromDirectory(state, dnpName, dnpVersion) {
  return (
    directory(state)[`${dnpName}@${dnpVersion}`] ||
    directory(state)[dnpName] ||
    {}
  );
}

// Envs for the current query. Should merge envs object from
// 1. User set
// 2. Previously set if already installed (on updates)
// 3. Default values on the manifest
export const getEnvs = state => {
  // First get the query DNP, from the url
  const queryDnp = getQueryDnp(state);
  if (!queryDnp) return {};
  const defaultEnvs = {};

  // Prioritize ENVs set at the installation before the default ones on the manifest
  defaultEnvs[queryDnp.name] = merge(
    parseManifestEnvs(queryDnp.manifest),
    getInstalledDnpEnvs(state, queryDnp.name)
  );
  // Append the ENVs of the dependencies
  const dnps = getQueryDnpDeps(state);
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = getDnpFromDirectory(state, depName, dnps[depName]);
      const manifestEnvs = parseManifestEnvs(depDnp.manifest);
      const alreadySetEnvs = getInstalledDnpEnvs(state, depName);
      // Don't append empty objects to the envs object
      if (
        Object.keys(manifestEnvs).length ||
        Object.keys(alreadySetEnvs).length
      ) {
        defaultEnvs[depName] = merge(manifestEnvs, alreadySetEnvs);
      }
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, getUserSetEnvs(state));
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
    // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
    // CONTAINER/type, return [null, CONTAINER/type]
    const [portMapping, type] = port.split("/");
    const [host, container] = portMapping.split(":");
    if (container) obj[port] = { host, container, type };
    else obj[port] = { container: host, type };
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
  const dnps = getQueryDnpDeps(state);
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = getDnpFromDirectory(state, depName, dnps[depName]);
      defaultEnvs[depName] = parseManifestPorts(depDnp.manifest);
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, getUserSetPorts(state));
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
    const [host, container, accessMode] = vol.split(":");
    obj[vol] = { host, container, ...(accessMode ? { accessMode } : {}) };
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
  const dnps = getQueryDnpDeps(state);
  Object.keys(dnps)
    .filter(depName => depName !== queryDnp.name)
    .forEach(depName => {
      const depDnp = getDnpFromDirectory(state, depName, dnps[depName]);
      defaultEnvs[depName] = parseManifestVols(depDnp.manifest);
    });

  // Merge default envs and the ones set by the user
  return merge(defaultEnvs, getUserSetVols(state));
};

/**
 * Convert "30303:30303/udp": {
 *   host: "new_path",
 *   container: "/root/.local",
 *   type: "udp"
 * }
 * To "old_path:/root/.local": "new_path:/root/.local"
 */
export const getUserSetPortsStringified = state => {
  // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
  // CONTAINER/type, return [null, CONTAINER/type]
  const userSetPorts = getUserSetPorts(state);
  const userSetPortsParsed = {};
  for (const dnpName of Object.keys(userSetPorts)) {
    userSetPortsParsed[dnpName] = {};
    for (const id of Object.keys(userSetPorts[dnpName])) {
      const { host, container, type } = userSetPorts[dnpName][id];
      const portMapping = host ? `${host}:${container}` : container;
      userSetPortsParsed[dnpName][id] = type
        ? `${portMapping}/${type}`
        : portMapping;
    }
  }
  return userSetPortsParsed;
};

/**
 * Convert "old_path:/root/.local": {
 *   host: "new_path",
 *   container: "/root/.local"
 *   accessMode: "ro"
 * }
 * To "old_path:/root/.local:ro": "new_path:/root/.local:ro"
 */
export const getUserSetVolsStringified = state => {
  const userSetVols = getUserSetVols(state);
  const userSetVolsParsed = {};
  for (const dnpName of Object.keys(userSetVols)) {
    userSetVolsParsed[dnpName] = {};
    for (const id of Object.keys(userSetVols[dnpName])) {
      const { host, container, accessMode } = userSetVols[dnpName][id];
      userSetVolsParsed[dnpName][id] = [host, container, accessMode]
        .filter(x => x)
        .join(":");
    }
  }
  return userSetVolsParsed;
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

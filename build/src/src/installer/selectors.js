import { NAME } from "./constants";
import { createSelector, createStructuredSelector } from "reselect";
import merge from "deepmerge";
import { urlToId } from "./utils";
import parsePathname from "utils/parsePathname";

// #### EXTERNAL SELECTORS
export const getConnectionOpen = state => state.session && state.session.isOpen;
export const getDirectory = createSelector(
  state => state.directory,
  _directory => _directory
);
export const getInstalledPackages = createSelector(
  state => state.installedPackages,
  _packages => _packages || []
);
export const getIsSyncing = state => state.isSyncing;

// #### INTERNAL SELECTORS
const getLocal = createSelector(
  state => state[NAME],
  local => local
);
export const getPackageData = createSelector(
  getLocal,
  local => local.packageData
);
export const getSelectedPackageId = createSelector(
  getLocal,
  local => local.selectedPackageId
);
export const getSelectedTypes = createSelector(
  getLocal,
  local => local.selectedTypes
);
export const getInputValue = createSelector(
  getLocal,
  local => local.searchInput
);
export const getIsInstalling = createSelector(
  getLocal,
  local => local.isInstalling
);
export const getFetching = createSelector(
  getLocal,
  local => local.fetching
);
export const getShouldOpenPorts = createSelector(
  getLocal,
  local => local.shouldOpenPorts
);
export const getProgressLogs = createSelector(
  getLocal,
  local => local.progressLogs
);
export const getUserSetEnvs = createSelector(
  getLocal,
  local => local.userSetEnvs
);
export const getUserSetPorts = createSelector(
  getLocal,
  local => local.userSetPorts
);
export const getUserSetVols = createSelector(
  getLocal,
  local => local.userSetVols
);
export const getUserSet = createStructuredSelector({
  envs: getUserSetEnvs,
  ports: getUserSetPorts,
  vols: getUserSetPorts
});
export const getShowAdvancedSettings = createSelector(
  getLocal,
  local => local.showAdvancedSettings
);

// Gets the DNP info of the id in the url
// Query ID on /installer/:id route
// /#/installer/kovan.dnp.dappnode.eth
// /#/installer/ipfs:QmaokAG8ECxpbLp4bqE6A3tBXsATZS7aN8RPd3DsE1haKz
export const getQueryId = createSelector(
  state => state.router.location.pathname,
  pathname => urlToId(parsePathname(pathname)[1] || "")
);
export const getQueryDnp = createSelector(
  getQueryId,
  getDirectory,
  (queryId, directory) => directory[queryId]
);
export const getQueryDnpDeps = createSelector(
  getQueryDnp,
  queryDnp => {
    const { success, alreadyUpdated } = (queryDnp || {}).requestResult || {};
    // DNPs that are part of the dependency tree but are already updated
    // will not appear in the success object
    return merge(alreadyUpdated || {}, success || {});
  }
);
export const getQueryDnpName = createSelector(
  getQueryDnp,
  queryDnp => (queryDnp || {}).name
);
export const getQueryProgressLogs = createSelector(
  getQueryDnp,
  getProgressLogs,
  (dnp, progressLogs) => {
    const dnpName = ((dnp || {}).manifest || {}).name;
    if (!dnpName) return null;
    for (const logs of Object.values(progressLogs)) {
      if (Object.keys(logs).includes(dnpName)) {
        return logs;
      }
    }
  }
);

// Generate an object to test if a DNP is installed
export const getIsInstalled = createSelector(
  getInstalledPackages,
  dnps =>
    dnps.reduce((obj, dnp) => {
      obj[dnp.name] = true;
      return obj;
    }, {})
);

/**
 * ENVS, PORTS, VOLS (userSet)
 */

const parseManifest = {
  /**
   * Parse the ENVs of a manifest object
   * @param {Object} manifest
   * @return {Object} envs = {ENV_NAME: "ENV_VALUE"}
   */
  envs: (manifest = {}) =>
    ((manifest.image || {}).environment || []).reduce((obj, row) => {
      const [key, value] = (row || "").trim().split("=");
      obj[key] = value || "";
      return obj;
    }, {}),
  /**
   * Parse the ports of a manifest object
   * @param {Object} manifest
   * @return {Object} ports = {containerAndType: hostPort}
   */
  ports: (manifest = {}) =>
    ((manifest.image || {}).ports || []).reduce((obj, port) => {
      // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
      // CONTAINER/type, return [null, CONTAINER/type]
      const [portMapping, type] = port.split("/");
      const [host, container] = portMapping.split(":");
      obj[port] = { host, container, type };
      return obj;
    }, {}),
  /**
   * Parse the vols of a manifest object
   * @param {Object} manifest
   * @return {Object} vols = {containerAndAccessmode: hostPath}
   */
  vols: (manifest = {}) =>
    ((manifest.image || {}).volumes || []).reduce((obj, vol) => {
      // HOST:CONTAINER:accessMode, return [HOST, CONTAINER:accessMode]
      const [host, container, accessMode] = vol.split(":");
      obj[vol] = { host, container, ...(accessMode ? { accessMode } : {}) };
      return obj;
    }, {})
};

const stringifyUserSet = {
  envs: envs => envs,
  /**
   * Convert "30303:30303/udp": {
   *   host: "new_path",
   *   container: "/root/.local",
   *   type: "udp"
   * }
   * To "old_path:/root/.local": "new_path:/root/.local"
   */
  ports: port => {
    const { host, container, type } = port;
    const portMapping = host ? `${host}:${container}` : container;
    return type ? `${portMapping}/${type}` : portMapping;
  },
  /**
   * Convert "old_path:/root/.local": {
   *   host: "new_path",
   *   container: "/root/.local"
   *   accessMode: "ro"
   * }
   * To "old_path:/root/.local:ro": "new_path:/root/.local:ro"
   */
  vols: vol => {
    const { host, container, accessMode } = vol;
    return [host, container, accessMode].filter(x => x).join(":");
  }
};

const parseInstalled = {
  // The key .envs already contains ENVs as an object
  envs: dnp => dnp.envs || {},
  // Ports cannot be changed after the DNP is installed
  ports: () => ({}),
  // Vols cannot be changed after the DNP is installed
  vols: () => ({})
};

// Envs for the current query. Should merge envs object from
// 1. User set
// 2. Previously set if already installed (on updates)
// 3. Default values on the manifest
const getValuesFactory = key =>
  createSelector(
    getQueryDnp,
    getInstalledPackages,
    getDirectory,
    getUserSet,
    (queryDnp, installedPackages, directory, userSet) => {
      // First get the query DNP, from the url
      if (!queryDnp) return {};

      // Prepare methods
      // Get the current ENVs if the package is installed.
      const getInstalledDnp = dnpName =>
        (installedPackages || []).find(({ name }) => name === dnpName) || {};

      const getDnpFromDirectory = (dnpName, dnpVersion) =>
        directory[`${dnpName}@${dnpVersion}`] || directory[dnpName] || {};

      // Prioritize ENVs set at the installation before the default ones on the manifest
      const defaultValues = {};
      defaultValues[queryDnp.name] = merge(
        parseManifest[key](queryDnp.manifest),
        parseInstalled[key](getInstalledDnp(queryDnp.name))
      );
      // Append the ENVs of the dependencies
      const { success, alreadyUpdated } = (queryDnp || {}).requestResult || {};
      // DNPs that are part of the dependency tree but are already updated will not appear in the success object
      const deps = merge(alreadyUpdated || {}, success || {});
      Object.keys(deps)
        .filter(depName => depName !== queryDnp.name)
        .forEach(depName => {
          const depDnp = getDnpFromDirectory(depName, deps[depName]);
          const fromManifest = parseManifest[key](depDnp.manifest);
          const fromInstalled = parseInstalled[key](getInstalledDnp(depName));
          // Don't append empty objects to the envs object
          if (!emptyObject(fromManifest) || !emptyObject(fromInstalled)) {
            defaultValues[depName] = merge(fromManifest, fromInstalled);
          }
        });

      // Merge default envs and the ones set by the user
      return merge(defaultValues, userSet[key]);
    }
  );

export const getEnvs = createSelector(
  getValuesFactory("envs"),
  envs => envs
);
export const getPorts = createSelector(
  getValuesFactory("ports"),
  ports => ports
);
export const getVols = createSelector(
  getValuesFactory("vols"),
  vols => vols
);

/**
 * Convert "30303:30303/udp": {
 *   host: "new_path",
 *   container: "/root/.local",
 *   type: "udp"
 * }
 * To "old_path:/root/.local": "new_path:/root/.local"
 */
export const getUserSetPortsStringified = createSelector(
  getUserSetPorts,
  userSetPorts => {
    // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
    // CONTAINER/type, return [null, CONTAINER/type]
    const userSetPortsParsed = {};
    for (const dnpName of Object.keys(userSetPorts)) {
      userSetPortsParsed[dnpName] = {};
      for (const id of Object.keys(userSetPorts[dnpName])) {
        userSetPortsParsed[dnpName][id] = stringifyUserSet.ports(
          userSetPorts[dnpName][id]
        );
      }
    }
    return userSetPortsParsed;
  }
);

/**
 * Convert "old_path:/root/.local": {
 *   host: "new_path",
 *   container: "/root/.local"
 *   accessMode: "ro"
 * }
 * To "old_path:/root/.local:ro": "new_path:/root/.local:ro"
 */
export const getUserSetVolsStringified = createSelector(
  getUserSetVols,
  userSetVols => {
    const userSetVolsParsed = {};
    for (const dnpName of Object.keys(userSetVols)) {
      userSetVolsParsed[dnpName] = {};
      for (const id of Object.keys(userSetVols[dnpName])) {
        userSetVolsParsed[dnpName][id] = stringifyUserSet.vols(
          userSetVols[dnpName][id]
        );
      }
    }
    return userSetVolsParsed;
  }
);

/**
 * Should hide card headers?
 * - Only if envs, ports and vols only have one DNP and is the query
 */
export const getHideCardHeaders = createSelector(
  getEnvs,
  getPorts,
  getVols,
  getQueryDnpName,
  (envs, ports, vols, queryDnpName) =>
    Object.keys(envs).length === 1 &&
    envs[queryDnpName] &&
    Object.keys(ports).length === 1 &&
    ports[queryDnpName] &&
    Object.keys(vols).length === 1 &&
    vols[queryDnpName]
);

// Packages and directory
export const getDirectoryFormated = createSelector(
  getDirectory,
  getInstalledPackages,
  (directory, installedPackages) => {
    // Compute the installation tag
    for (const pkgName of Object.keys(directory)) {
      if (pkgName.startsWith("/ipfs/")) {
        const installed = installedPackages.find(pkg => pkg.origin === pkgName);
        directory[pkgName].tag = installed ? "UPDATED" : "INSTALL";
      } else {
        const latestVersion = ((directory[pkgName] || {}).manifest || {})
          .version;
        const currentPkg = installedPackages.find(pkg => pkg.name === pkgName);
        const currentVersion = (currentPkg || {}).version;
        directory[pkgName].tag =
          currentVersion && latestVersion
            ? currentVersion === latestVersion
              ? "UPDATED"
              : "UPDATE"
            : "INSTALL";
      }
    }
    return directory;
  }
);

export const getIsDirectoryLoaded = createSelector(
  getDirectory,
  directory => Boolean(!emptyObject(directory))
);

export const getFilteredDirectory = createSelector(
  getDirectory,
  getInputValue,
  getSelectedTypes,
  (directory, inputValue, selectedTypes) => {
    const allPackages = Object.values(directory).reverse();
    const selectedPackages = allPackages
      // Filter by name
      .filter(pkg => {
        try {
          // Avoid expensive searches if input is empty. inputValue = "" evaluates to false
          if (!inputValue) return true;
          return JSON.stringify(pkg.manifest).includes(inputValue);
        } catch (e) {
          console.error("Error searching manifest", e);
          return true;
        }
      })
      // Filter by type
      .filter(pkg => {
        const types = selectedTypes;
        if (Object.keys(types).length === 0) return true;
        // Prevent the app from crashing with defective packages
        return types[((pkg || {}).manifest || {}).type];
      });
    return selectedPackages;
  }
);

export const getFilteredDirectoryNonCores = createSelector(
  getFilteredDirectory,
  filteredDirectory =>
    // If packages are broken, display them anyway
    filteredDirectory.filter(
      pkg => !(pkg || {}).manifest || pkg.manifest.type !== "dncore"
    )
);

// Utility to test if an object is empty
function emptyObject(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

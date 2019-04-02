import { mountPoint } from "./data";
import { createSelector } from "reselect";
import merge from "deepmerge";
import {
  getDnpDirectory,
  getDnpDirectoryWhitelisted
} from "services/dnpDirectory/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { getDappnodeParams } from "services/dappnodeStatus/selectors";
import { getIsConnectionOpen } from "services/connectionStatus/selectors";
// Parsers
import {
  parseDefaultEnvs,
  parseDefaultPorts,
  parseDefaultVols,
  parseDnpFromDirectory,
  parseDepsFromDnp
} from "./parsers";
import parseInstallTag from "./parsers/parseInstallTag";
import stringifyUserSetPorts from "./parsers/stringifyUserSetPorts";
import stringifyUserSetVols from "./parsers/stringifyUserSetVols";
// Utils
import _ from "lodash";

// #### EXTERNAL SELECTORS
export const connectionOpen = getIsConnectionOpen;
export const installedPackages = state => state.installedPackages || [];
export const isSyncing = state => state.isSyncing;
export const getShouldOpenPorts = createSelector(
  getDappnodeParams,
  dappnodeParams => dappnodeParams.openPorts && dappnodeParams.upnpAvailable
);

// #### INTERNAL SELECTOR
const getLocal = createSelector(
  state => state[mountPoint],
  local => local
);
const getFromLocalFactory = key =>
  createSelector(
    getLocal,
    local => local[key]
  );

export const getSelectedTypes = getFromLocalFactory("selectedTypes");
export const getInputValue = getFromLocalFactory("input");
export const getIsInstalling = getFromLocalFactory("isInstalling");
export const getProgressLogs = getFromLocalFactory("progressLogs");
export const getUserSetEnvs = getFromLocalFactory("userSetEnvs");
export const getUserSetPorts = getFromLocalFactory("userSetPorts");
export const getUserSetVols = getFromLocalFactory("userSetVols");

export const getIsInstallingById = createSelector(
  getIsInstalling,
  (_, id) => id,
  (isInstalling, id) => isInstalling[id]
);

// Generate an object to test if a DNP is installed
export const getIsInstalled = state =>
  installedPackages(state).reduce((obj, dnp) => {
    obj[dnp.name] = true;
    return obj;
  }, {});

/**
 * Gets the query id from the react-router injected props
 * - The url path is: /installer/:id
 * - Must be decoded to be compatible with IPFS paths
 * @returns {String}
 */
export const getQueryId = createSelector(
  (_, ownProps) => (ownProps.match || {}).params.id,
  queryId => decodeURIComponent(queryId)
);

export const getQueryDnp = createSelector(
  getQueryId,
  getDnpDirectory,
  (queryId, dnpDirectory) => dnpDirectory[queryId]
);

export const getQueryName = createSelector(
  getQueryDnp,
  dnp => ((dnp || {}).manifest || {}).name || (dnp || {}).name
);

export const getQueryIdOrName = createSelector(
  getQueryName,
  getQueryId,
  (name, id) => name || id
);

/**
 * Selector factory to merge the parameters with a priority order:
 * 1. Manifest variables (default)
 * 2. Variables already set on the DNP (applies to updates)
 * 3. User set variables for this specific installation
 * @param {String} varId = "envs", "ports" or "vols"
 * @returns {Object} Always ordered by DNP id = {
 *   dnpName.dnp.dappnode.eth: {
 *     "FOO": "BAR"
 *   },
 *   /ipfs/QmPi32MzYBMWgsqVaWeLB728rJqyZwcZBwwoJjd8dTyqte: {
 *     "FOO": "BAR"
 *   },
 * }
 * [Tested]
 */
const getVarFactory = varId => {
  // Condensed switch statement to assign selectors based on an ID
  const [getUserSetVar, parseDefaultVar] =
    varId === "envs"
      ? [getUserSetEnvs, parseDefaultEnvs]
      : varId === "ports"
      ? [getUserSetPorts, parseDefaultPorts]
      : varId === "vols"
      ? [getUserSetVols, parseDefaultVols]
      : [null, null];

  return createSelector(
    getQueryId,
    getDnpDirectory,
    getDnpInstalled,
    getUserSetVar,
    (queryId, dnpDirectory, dnpInstalled, userSetVar) => {
      if (!queryId) return {};

      // Pre-bind this parser to avoid repeated code
      const parseDefaultBinded = parseDefaultVar.bind(
        this,
        dnpDirectory,
        dnpInstalled
      );
      const defaultVars = {};

      // Append envs from the query
      const dnp = parseDnpFromDirectory(dnpDirectory, queryId);
      defaultVars[dnp.name] = parseDefaultBinded(queryId);

      // Append envs from the dependencies of the query
      const deps = parseDepsFromDnp(dnp);
      Object.keys(deps)
        .filter(depName => depName !== dnp.name)
        .forEach(depName => {
          const depVersion = deps[depName];
          defaultVars[depName] = parseDefaultBinded(depName, depVersion);
        });

      // Merge default envs and the ones set by the user
      // Also, clean empty objects
      return cleanObj(merge(defaultVars, userSetVar));
    }
  );
};

/**
 * Instances of getVarFactory
 * Used in: Envs.jsx, Ports.jsx, Vols.jsx
 * [Tested]
 */
export const getEnvs = getVarFactory("envs");
export const getPorts = getVarFactory("ports");
export const getVols = getVarFactory("vols");

/**
 * Format userSet parameters to be send to the dappmanager
 * Used in saga installer/install
 * @returns {Object} userSetFormatted = {
 *   userSetEnvs = {
 *     "kovan.dnp.dappnode.eth": {
 *       "ENV_NAME": "VALUE1"
 *     }, ... },
 *   userSetVols = "kovan.dnp.dappnode.eth": {
 *      "path:/root/.local": {
 *        host: "new_path"
 *        container: "/root/.local"
 *    }, ... },
 *   userSetPorts = {
 *    "kovan.dnp.dappnode.eth": {
 *      "30303": "31313:30303",
 *      "30303/udp": "31313:30303/udp"
 *   }, ... }
 * }
 * Used in: ./sagas.js
 * [Tested]
 */
export const getUserSetFormatted = createSelector(
  getUserSetEnvs,
  getUserSetPorts,
  getUserSetVols,
  (envs, ports, vols) => ({
    userSetEnvs: envs,
    userSetPorts: stringifyUserSetPorts(ports),
    userSetVols: stringifyUserSetVols(vols)
  })
);

/**
 * Logic to show or hide internal card headers.
 * - Only if envs, ports and vols only have one DNP and is the query
 * @returns {Bool} true = hide headers
 * Used in: Envs.jsx, Ports.jsx, Vols.jsx
 * [Tested]
 */
export const getHideCardHeaders = createSelector(
  getEnvs,
  getPorts,
  getVols,
  getQueryName,
  (envs, ports, vols, queryName) =>
    Boolean(
      Object.keys(envs).length === 1 &&
        envs[queryName] &&
        Object.keys(ports).length === 1 &&
        ports[queryName] &&
        Object.keys(vols).length === 1 &&
        vols[queryName]
    )
);

/**
 * Append the install tag to each DNP aggregating the dnpDirectory and the dnpInstalled
 * @returns {Object}
 * [Tested]
 */
const getDnpDirectoryWithTags = createSelector(
  getDnpDirectoryWhitelisted,
  getDnpInstalled,
  (dnpDirectory, dnpInstalled) => {
    Object.keys(dnpDirectory).forEach(dnpName => {
      const tag = parseInstallTag(dnpDirectory, dnpInstalled, dnpName);
      dnpDirectory[dnpName].tag = tag;
    });
    return dnpDirectory;
  }
);

/**
 * Filters directory by:
 * 1. Search bar. If search bar is empty, return all
 * 2. Selected types: If no types selected, return all
 * @returns {Array}
 * [Tested]
 */
export const getFilteredDirectoryWithTags = createSelector(
  getDnpDirectoryWithTags,
  getInputValue,
  getSelectedTypes,
  (dnps, inputValue, selectedTypes) =>
    Object.values(dnps)
      .reverse()
      .filter(dnp => !inputValue || includesSafe(dnp.manifest, inputValue))
      .filter(
        dnp =>
          !Object.keys(selectedTypes).length ||
          ((dnp.manifest || {}).type && selectedTypes[dnp.manifest.type])
      )
);

/**
 * Filter directory by DNPs that are not `type: "dncore"`
 * - If a DNP is broken and has no type, display it
 * @returns {Array}
 * [Tested]
 */
export const getFilteredDirectoryWithTagsNonCores = createSelector(
  getFilteredDirectoryWithTags,
  dnps =>
    // If packages are broken, display them anyway
    dnps.filter(dnp => !dnp.manifest || (dnp.manifest || {}).type !== "dncore")
);

export const directoryLoaded = createSelector(
  getDnpDirectoryWhitelisted,
  dnpDirectory => Boolean(Object.keys(dnpDirectory).length)
);

// Utilitites

function includesSafe(source, target) {
  try {
    return JSON.stringify(source).includes(target);
  } catch (e) {
    console.error(`Error on includesSafe: ${e.stack}`);
    return true;
  }
}

function cleanObj(obj) {
  return _.pickBy(obj, value => !_.isEmpty(value));
}

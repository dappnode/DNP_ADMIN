import { mountPoint } from "./data";
import { createSelector } from "reselect";
import merge from "deepmerge";
import {
  getDnpDirectory,
  getDnpDirectoryWhitelisted
} from "services/dnpDirectory/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { getDappnodeParams } from "services/dappnodeStatus/selectors";
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
export const getUserSetEnvs = getFromLocalFactory("userSetEnvs");
export const getUserSetPorts = getFromLocalFactory("userSetPorts");
export const getUserSetVols = getFromLocalFactory("userSetVols");

/**
 * Generate an object to test if a DNP is installed
 * - Used by Ports.jsx and Vols.jsx to lock the variables if DNP is installed
 */
export const getIsInstalled = createSelector(
  getDnpInstalled,
  dnpInstalled =>
    dnpInstalled.reduce((obj, dnp) => {
      return { ...obj, [dnp.name]: true };
    }, {})
);

/**
 * Gets the query id from the react-router injected props
 * - The url path is: /installer/:id
 * - Must be decoded to be compatible with IPFS paths
 * @returns {string}
 */
export const getQueryId = createSelector(
  (_, ownProps) => (ownProps.match || {}).params.id,
  queryId => decodeURIComponent(queryId)
);

export const getQueryDnp = createSelector(
  getQueryId,
  getDnpDirectory,
  getDnpInstalled,
  (queryId, dnpDirectory, dnpInstalled) => {
    const dnp = dnpDirectory[queryId];
    const tag =
      dnp && dnp.name && parseInstallTag(dnpDirectory, dnpInstalled, dnp.name);
    return { ...dnp, tag };
  }
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
 * @param {string} varId = "envs", "ports" or "vols"
 * @returns {object} Always ordered by DNP id = {
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
 * @returns {object} userSetFormatted = {
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
 * @returns {bool} true = hide headers
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
 * @returns {object}
 * [Tested]
 */
const getDnpDirectoryWithTags = createSelector(
  getDnpDirectoryWhitelisted,
  getDnpInstalled,
  (dnpDirectory, dnpInstalled) => {
    return Object.entries(dnpDirectory).map(([dnpName, dnp]) => {
      const tag = parseInstallTag(dnpDirectory, dnpInstalled, dnpName);
      return { ...dnp, tag };
    });
  }
);

/**
 * Filter directory by DNPs that are not `type: "dncore"`
 * - If a DNP is broken and has no type, display it
 * @returns {array}
 * [Tested]
 */
export const getDnpDirectoryWithTagsNonCores = createSelector(
  getDnpDirectoryWithTags,
  dnps =>
    // If packages are broken, display them anyway
    dnps.filter(dnp => !dnp.manifest || (dnp.manifest || {}).type !== "dncore")
);

export const directoryLoaded = createSelector(
  getDnpDirectoryWhitelisted,
  dnpDirectory => Boolean(Object.keys(dnpDirectory).length)
);

// Utilitites

function cleanObj(obj) {
  return _.pickBy(obj, value => !_.isEmpty(value));
}

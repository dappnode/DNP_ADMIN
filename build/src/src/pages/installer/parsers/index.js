import merge from "deepmerge";
import parseManifestEnvs from "./parseManifestEnvs";
import parseManifestPorts from "./parseManifestPorts";
import parseManifestVols from "./parseManifestVols";

/**
 * Generic helpers for getUser
 */

export function parseDepsFromDnp(dnp) {
  // Packages that are part of the dependency tree but are already updated
  // will not appear in the success object
  // #### How to centralize object definitions so if requestResult changes, this code doesn't break
  const { dnps } = (dnp || {}).requestResult || {};
  return dnps || {};
}

function parseInstalledDnp(dnpInstalled, dnpName) {
  return dnpInstalled.find(({ name }) => name === dnpName) || {};
}

/**
 * @param {object} dnp = { envs: { "ENV_NAME": "ENV_VALUE" } }
 * @return {object} envs = {
 *   "ENV_NAME": { name: "ENV_NAME", value: "ENV_VALUE" }
 * }
 */
function parseInstalledDnpEnvs(dnp) {
  const envs = (dnp || {}).envs || {};
  return Object.entries(envs).reduce((obj, [name, value]) => {
    obj[name] = { name, value };
    return obj;
  }, {});
}

export function parseDnpFromDirectory(directory, dnpName, dnpVersion) {
  return directory[`${dnpName}@${dnpVersion}`] || directory[dnpName] || {};
}

/*
 * Parsers for the userSetVars
 */

export function parseDefaultEnvs(
  dnpDirectory,
  dnpInstalled,
  dnpName,
  dnpVersion
) {
  const dnp = parseDnpFromDirectory(dnpDirectory, dnpName, dnpVersion);
  return merge(
    parseManifestEnvs(dnp.manifest),
    // The key .envs already contains ENVs as an object
    parseInstalledDnpEnvs(parseInstalledDnp(dnpInstalled, dnpName))
  );
}

export function parseDefaultPorts(dnpDirectory, _, dnpName, dnpVersion) {
  const dnp = parseDnpFromDirectory(dnpDirectory, dnpName, dnpVersion);
  return parseManifestPorts(dnp.manifest);
}

export function parseDefaultVols(dnpDirectory, _, dnpName, dnpVersion) {
  const dnp = parseDnpFromDirectory(dnpDirectory, dnpName, dnpVersion);
  return parseManifestVols(dnp.manifest);
}

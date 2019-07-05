import merge from "deepmerge";
import parseManifestEnvs from "./parseManifestEnvs";
import parseManifestPorts from "./parseManifestPorts";
import parseManifestVols from "./parseManifestVols";
import parseInstalledDnpEnvs from "./parseInstalledDnpEnvs";

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

export function parseDnpFromDirectory(directory, dnpName, dnpVersion) {
  return directory[`${dnpName}@${dnpVersion}`] || directory[dnpName] || {};
}

/*
 * Parsers for the userSetVars
 */

export function parseDefaultEnvs(
  dnpDirectory,
  dnpInstalled,
  dnpNameOrId,
  dnpVersion
) {
  const dnp = parseDnpFromDirectory(dnpDirectory, dnpNameOrId, dnpVersion);
  // dnpNameOrId can be an IPFS hash. Also if the name is not found in the manifest,
  // fallback to dnpNameOrId
  const dnpName = ((dnp || {}).manifest || {}).name || dnpNameOrId;
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

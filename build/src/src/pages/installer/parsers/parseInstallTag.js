import shouldUpdate from "utils/shouldUpdate";

/**
 * Returns the install tag for `/installer/`
 * @param {object} dnpDirectory
 * @param {array} dnpInstalled
 * @param {string} dnpName
 * @returns {string} "INSTALL", "UPDATE", "UPDATED"
 */
export default function parseInstallTag(dnpDirectory, dnpInstalled, dnpName) {
  const installedDnp = dnpInstalled.find(
    dnp => dnp.origin === dnpName || dnp.name === dnpName
  );
  if (!installedDnp) return "INSTALL";
  const dnp = dnpDirectory[dnpName] || {};
  const latestVersion = dnp.version || (dnp.manifest || {}).version;
  const currentVersion = installedDnp.version;
  return shouldUpdate(currentVersion, latestVersion) ? "UPDATE" : "UPDATED";
}

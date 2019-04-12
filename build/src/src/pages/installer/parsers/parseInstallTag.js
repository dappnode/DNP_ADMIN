import shouldUpdate from "utils/shouldUpdate";

/**
 * Returns the install tag for `/installer/`
 * @param {object} dnpDirectory
 * @param {array} dnpInstalled
 * @param {string} dnpName
 * @returns {string} "INSTALL", "UPDATE", "UPDATED"
 */
export default function parseInstallTag(dnpDirectory, dnpInstalled, dnpName) {
  const installed = dnpInstalled.find(
    dnp => dnp.origin === dnpName || dnp.name === dnpName
  );
  if (!installed) return "INSTALL";
  const latestVersion =
    dnpDirectory[dnpName].version ||
    (dnpDirectory[dnpName].manifest || {}).version;
  const currentVersion = installed.version;
  return shouldUpdate(currentVersion, latestVersion) ? "UPDATE" : "UPDATED";
}

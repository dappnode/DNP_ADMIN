const semver = require("semver");

/**
 *
 * @param {string} v1 currentVersion
 * @param {string} v2 newVersion
 * @returns {bool}
 */
function shouldUpdate(v1, v2) {
  // Deal with a double IPFS hash case
  if (v1 && v2 && v1 === v2) return false;
  v1 = semver.valid(v1) || "999.9.9";
  v2 = semver.valid(v2) || "9999.9.9";
  return semver.lt(v1, v2);
}

module.exports = shouldUpdate;

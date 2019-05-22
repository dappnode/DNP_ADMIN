/**
 * Parse the ENVs of a manifest object
 * @param {object} manifest
 * @returns {object} envs = {
 *   name: "ENV_NAME",
 *   value: "ENV_VALUE",
 *   index: 1
 * }
 */
export default function parseManifestEnvs(manifest = {}) {
  const envsArray = (manifest.image || {}).environment || [];
  return envsArray.reduce((obj, row, index) => {
    const [key, value = ""] = (row || "").trim().split(/=(.*)/);
    obj[key] = { name: key, value, index };
    return obj;
  }, {});
}

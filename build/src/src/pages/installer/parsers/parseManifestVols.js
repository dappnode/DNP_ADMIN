/**
 * Parse the vols of a manifest object
 * @param {object} manifest
 * @returns {object} vols = [{
 *   host: "dnp_data",
 *   container: "/usr/src/data",
 *   accessMode: "ro",
 *   index: 1
 * }, ... ]
 */
export default function parseManifestVols(manifest = {}) {
  // HOST:CONTAINER:accessMode, return [HOST, CONTAINER:accessMode]
  const volsArray = (manifest.image || {}).volumes || [];
  return volsArray.reduce((obj, vol, index) => {
    const [host, container, accessMode] = vol.split(":");
    obj[vol] = {
      host,
      container,
      ...(accessMode ? { accessMode } : {}),
      index
    };
    return obj;
  }, {});
}

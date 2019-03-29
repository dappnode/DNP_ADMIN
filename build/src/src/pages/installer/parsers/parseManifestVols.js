/**
 * Parse the vols of a manifest object
 * @param {Object} manifest
 * @return {Object} vols = {containerAndAccessmode: hostPath}
 */
export default function parseManifestVols(manifest = {}) {
  // HOST:CONTAINER:accessMode, return [HOST, CONTAINER:accessMode]
  const volsArray = (manifest.image || {}).volumes || [];
  return volsArray.reduce((obj, vol) => {
    const [host, container, accessMode] = vol.split(":");
    obj[vol] = { host, container, ...(accessMode ? { accessMode } : {}) };
    return obj;
  }, {});
}

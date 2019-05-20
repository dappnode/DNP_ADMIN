/**
 * Parse the ports of a manifest object
 * @param {object} manifest
 * @returns {object} ports = [{
 *   host: "5001",
 *   container: "5001",
 *   type: "udp",
 *   index: 1
 * }, ... ]
 */
export default function parseManifestPorts(manifest = {}) {
  const portsArray = (manifest.image || {}).ports || [];
  return portsArray.reduce((obj, port, index) => {
    const [portMapping, type] = port.split("/");
    const [host, container] = portMapping.split(":");

    // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
    if (container) obj[port] = { host, container, type, index };
    // CONTAINER/type, return [null, CONTAINER/type]
    else obj[port] = { container: host, type, index };

    return obj;
  }, {});
}

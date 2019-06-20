/**
 * Parse the ports of a manifest object
 * @param {object} manifest
 * @returns {object} ports = [{
 *   host: "5001",
 *   container: "5001",
 *   protocol: "udp",
 *   index: 1
 * }, ... ]
 */
export default function parseManifestPorts(manifest = {}) {
  const portsArray = (manifest.image || {}).ports || [];
  return portsArray.reduce((obj, port, index) => {
    const [portMapping, protocol] = port.split("/");
    const [host, container] = portMapping.split(":");

    // HOST:CONTAINER/protocol, return [HOST, CONTAINER/protocol]
    if (container) obj[port] = { host, container, protocol, index };
    // CONTAINER/protocol, return [null, CONTAINER/protocol]
    else obj[port] = { container: host, protocol, index };

    return obj;
  }, {});
}

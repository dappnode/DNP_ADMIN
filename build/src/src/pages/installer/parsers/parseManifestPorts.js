/**
 * Parse the ports of a manifest object
 * @param {Object} manifest
 * @return {Object} ports = {containerAndType: hostPort}
 */
export default function parseManifestPorts(manifest = {}) {
  const portsArray = (manifest.image || {}).ports || [];
  return portsArray.reduce((obj, port) => {
    const [portMapping, type] = port.split("/");
    const [host, container] = portMapping.split(":");

    // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
    if (container) obj[port] = { host, container, type };
    // CONTAINER/type, return [null, CONTAINER/type]
    else obj[port] = { container: host, type };

    return obj;
  }, {});
}

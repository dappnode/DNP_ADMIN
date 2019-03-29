/**
 * Parse the ports of a manifest object
 * @param {Object} manifest
 * @return {Object} ports = {containerAndType: hostPort}
 */
export default function parseManifestPorts(manifest = {}) {
  const portsArray = (manifest.image || {}).ports || [];
  return portsArray.reduce((obj, port) => {
    // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
    // CONTAINER/type, return [null, CONTAINER/type]
    const [portMapping, type] = port.split("/");
    const [host, container] = portMapping.split(":");
    obj[port] = { host, container, type };
    return obj;
  }, {});
}

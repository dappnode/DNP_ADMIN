/**
 * Convert "30303:30303/udp": {
 *   host: "4000",
 *   container: "30303",
 *   type: "udp"
 * }
 * To "30303:30303/udp": "4000:30303/udp"
 */
export default function getUserSetPortsStringified(userSetPorts) {
  // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
  // CONTAINER/type, return [null, CONTAINER/type]
  const userSetPortsParsed = {};
  for (const dnpName of Object.keys(userSetPorts)) {
    userSetPortsParsed[dnpName] = {};
    for (const id of Object.keys(userSetPorts[dnpName])) {
      const { host, container, type } = userSetPorts[dnpName][id];
      const portMapping = host ? `${host}:${container}` : container;
      userSetPortsParsed[dnpName][id] = type
        ? `${portMapping}/${type}`
        : portMapping;
    }
  }
  return userSetPortsParsed;
}

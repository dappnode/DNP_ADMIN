/**
 * Convert "30303:30303/udp": {
 *   host: "4000",
 *   container: "30303",
 *   protocol: "udp"
 * }
 * To "30303:30303/udp": "4000:30303/udp"
 */
export default function getUserSetPortsStringified(userSetPorts) {
  // HOST:CONTAINER/protocol, return [HOST, CONTAINER/protocol]
  // CONTAINER/protocol, return [null, CONTAINER/protocol]
  const userSetPortsParsed = {};
  for (const dnpName of Object.keys(userSetPorts)) {
    userSetPortsParsed[dnpName] = {};
    for (const id of Object.keys(userSetPorts[dnpName])) {
      const { host, container, protocol } = userSetPorts[dnpName][id];
      const portMapping = host ? `${host}:${container}` : container;
      userSetPortsParsed[dnpName][id] = protocol
        ? `${portMapping}/${protocol}`
        : portMapping;
    }
  }
  return userSetPortsParsed;
}

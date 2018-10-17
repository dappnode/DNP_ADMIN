import uniqArray from './uniqArray'

/**
 * Parses ports
 * @param {object} manifest
 * @return {array} ['8080 UDP', '4001 TCP']
 */
function parsePorts(manifest) {
    // portsArray = ['30303:30303/udp']
    const portsArray = ((manifest || {}).image || {}).ports || [];
    const portsFormatted = portsArray
        // Ignore ports that are not map
        .filter(e => e.includes(":"))
        // Transform ['30303:30303/udp'] => ['30303 UDP']
        .map(p => {
          const hostPortNumber = p.split(":")[0];
          const portType = p.split("/")[1] || 'TCP';
          return {
              number: hostPortNumber,
              type: portType
          }
        })
    return uniqArray(portsFormatted)
}

export default parsePorts;

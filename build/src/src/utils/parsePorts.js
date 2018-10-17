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
          const hostPort = p.split(":")[0];
          return `${hostPort} ${p.includes("udp") ? "UDP" : "TCP"}`;
        })
    return uniqArray(portsFormatted)
}

export default parsePorts;

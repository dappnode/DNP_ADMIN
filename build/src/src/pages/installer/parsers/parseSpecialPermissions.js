/**
 * - Usage of an external volume
 * - Priviledged
 * @param {object} manifest
 * @returns {array} permissions = [{
 *   name: "Short description",
 *   details: "Long description of the capabilitites"
 * }, ... ]
 */
function parseSpecialPermissions(manifest = {}) {
  const specialPermissions = [];

  const { external_vol, ipv4_address, network_mode, privileged, cap_add } =
    manifest.image || {};

  for (const externalVol of external_vol || []) {
    // externalVol = "dncore_ethchaindnpdappnodeeth_data:/app/.ethchain:ro"
    const host = externalVol.split(":")[0];
    const parts = host.split("_");
    if (parts[0] === "dncore")
      specialPermissions.push({
        name: "Access to core volume",
        details: `Allows the DNP to read and write to the core volume ${host}`
      });
    else
      specialPermissions.push({
        name: "Access to DNP volume",
        details: `Allows the DNP to read and write to the DNP volume ${host}`
      });
  }

  const priviledgedDetails =
    "Allows the DNP to manipulate and read any installed DNP and install additional packages. Allows the DNP to fully interact with the host system";

  if (
    manifest.type === "dncore" ||
    privileged ||
    (cap_add || []).includes("ALL")
  )
    specialPermissions.push({
      name: "Priviledged access to the system host",
      details: priviledgedDetails
    });

  if (manifest.type === "dncore" && ipv4_address)
    specialPermissions.push({
      name: "Admin priviledges in DAppNode's WAMP",
      details:
        "Allows the DNP to call any WAMP method of any DNP restricted to admin users"
    });

  for (const cap of cap_add || []) {
    if (cap !== "ALL")
      specialPermissions.push({
        name: `Priviledged system capability ${cap}`,
        details: `See docker docs for more information https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities`
      });
  }

  if (network_mode === "host")
    specialPermissions.push({
      name: `Access to the host network`,
      details:
        "Allows the DNP connect directly to the host's network. It can bind its open ports directly to the host's IP address"
    });

  return specialPermissions;
}

module.exports = parseSpecialPermissions;

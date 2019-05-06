function getServerName(str) {
    if (!str) return "DAppNode VPN";
    str = decodeURIComponent(str);
    const strLc = str.toLowerCase();
    if (!strLc.includes("dappnode") && !strLc.includes("vpn"))
      return `${str} DAppNode VPN`;
    if (!strLc.includes("dappnode") && strLc.includes("vpn"))
      return `${str} DAppNode`;
    if (strLc.includes("dappnode") && !strLc.includes("vpn"))
      return `${str} VPN`;
    return str;
}

// Remove all non-alphanumeric characters (including space)
// In some Linux distributions it may cause problems
function getCleanServerName(str) {
  const serverName = getServerName(str) || "";
  return serverName.replace(/\W/g, "");
}

export default getCleanServerName;

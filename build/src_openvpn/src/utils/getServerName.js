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

export default getServerName

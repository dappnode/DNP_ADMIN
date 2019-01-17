/**
 * Checks if a string is an IP v4.
 * Credit: regex from ip-regex npm package.
 */

const v4 =
  "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
const ipv4RegExp = new RegExp(`(?:^${v4}$)`);

function isIpv4(ip) {
  if (!ip) return false;
  return ipv4RegExp.test(ip);
}

export default isIpv4;

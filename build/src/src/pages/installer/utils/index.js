import isIpfsHash from "utils/isIpfsHash";
import { stringSplit } from "utils/strings";

// Utils

export function correctPackageName(req) {
  if (!req || typeof req !== "string") return req;
  // First determine if it contains an ipfs hash
  const hash = stringSplit(req, "ipfs/")[1] || req;
  if (isIpfsHash(req)) return "/ipfs/" + hash;
  else return req;
}

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function cleanDnpName(dnpName) {
  if (!dnpName || typeof dnpName !== "string") return dnpName;
  return stringSplit(dnpName, "@")[0];
}

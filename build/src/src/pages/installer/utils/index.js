// Utils

export function isIpfsHash(hash) {
  if (!hash || typeof hash !== "string") return false;
  return hash.includes("/ipfs/") && isIpfsMultiHash(hash.split("/ipfs/")[1]);
}

export function isDnpDomain(id) {
  if (!id || typeof id !== "string") return false;
  if (!id.includes(".")) return false;
  const [, dnpTag, , extension] = id.split(".");
  return (
    dnpTag &&
    (dnpTag === "dnp" || dnpTag === "public") &&
    extension &&
    extension === "eth"
  );
}

export function isIpfsMultiHash(multiHash) {
  if (!multiHash || typeof multiHash !== "string") return false;
  return (
    multiHash.startsWith("Qm") &&
    !multiHash.includes(".") &&
    multiHash.length === 46
  );
}

export function correctPackageName(req) {
  if (!req || typeof req !== "string") return req;
  // First determine if it contains an ipfs hash
  if (req.startsWith("ipfs/") && isIpfsMultiHash(req.split("ipfs/")[1]))
    return "/" + req;
  else if (isIpfsMultiHash(req)) return "/ipfs/" + req;
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
  return (dnpName || "").split("@")[0];
}

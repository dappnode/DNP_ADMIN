// Utils

export function isIpfsHash(hash) {
  return hash.includes("/ipfs/") && isIpfsMultiHash(hash.split("/ipfs/")[1]);
}

export function isIpfsMultiHash(multiHash) {
  return (
    multiHash.startsWith("Qm") &&
    !multiHash.includes(".") &&
    multiHash.length === 46
  );
}

export function correctPackageName(req) {
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

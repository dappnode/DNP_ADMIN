// Utils

export function isIpfsHash(hash) {
  return hash.includes("/ipfs/") && isIpfsMultiHash(hash.split("/ipfs/")[1]);
}

export function isDnpDomain(id) {
  if (!id || !id.includes(".")) return false;
  const [, dnpTag, , extension] = id.split(".");
  return (
    dnpTag &&
    (dnpTag === "dnp" || dnpTag === "public") &&
    extension &&
    extension === "eth"
  );
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

export function idToUrl(id) {
  // First determine if it contains an ipfs hash
  if (
    (id.startsWith("ipfs/") || id.startsWith("/ipfs/")) &&
    isIpfsMultiHash(id.split("ipfs/")[1])
  ) {
    return "ipfs:" + id.split("ipfs/")[1];
  } else {
    return id;
  }
}

export function urlToId(url) {
  // Clean url
  url = url.split("@")[0];
  // First determine if it contains an ipfs hash
  if (url.startsWith("ipfs:")) {
    return "/ipfs/" + url.split("ipfs:")[1];
  } else {
    return url;
  }
}

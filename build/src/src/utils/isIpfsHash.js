import isIPFS from "is-ipfs";

export default function isIpfsHash(HASH) {
  if (!HASH) return false;
  // Correct hash prefix
  if (HASH.includes("ipfs/")) {
    HASH = HASH.split("ipfs/")[1];
  }
  HASH.replace("/", "");
  // Make sure hash if valid
  return isIPFS.multihash(HASH);
}

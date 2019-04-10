// import multihash from 'multihashes'
// import base58 from 'bs58'

// function isMultihash (hash) {
//   try {
//     const buffer = Buffer.from(base58.decode(hash))
//     multihash.decode(buffer)
//     return true
//   } catch (e) {
//     return false
//   }
// }

function isMultihash(hash) {
  if (!hash) return false;
  return hash.startsWith("Qm") && hash.length === 46;
}

export default function isIpfsHash(hash) {
  if (!hash || typeof hash !== "string") return false;
  // Correct hash prefix
  if (hash.includes("ipfs/")) {
    hash = hash.split("ipfs/")[1];
  }
  hash.replace("/", "");
  // Make sure hash if valid
  return isMultihash(hash);
}

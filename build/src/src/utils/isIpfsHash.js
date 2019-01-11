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

function isMultihash (hash) {
  if (!hash) return false
  return hash.startsWith('Qm') && hash.length === 46
}

export default function isIpfsHash(HASH) {
  if (!HASH) return false;
  // Correct hash prefix
  if (HASH.includes("ipfs/")) {
    HASH = HASH.split("ipfs/")[1];
  }
  HASH.replace("/", "");
  // Make sure hash if valid
  return isMultihash(HASH);
}

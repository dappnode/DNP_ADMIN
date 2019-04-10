import web3 from "./web3";

export default function getBlockTimestamp(blockNumber) {
  return web3.eth
    .getBlock(blockNumber)
    .catch(e =>
      console.error(
        `Error getting timestamp for blockNumber ${blockNumber} ${e.stack}`
      )
    )
    .then(block => parseInt((block || {}).timestamp || 0, 10));
}

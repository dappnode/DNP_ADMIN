import web3 from "./web3";

async function diagnoseEthchain() {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  console.log("latestBlockNumber: ", latestBlockNumber);
  const blockNumbers = [];
  for (
    let block = latestBlockNumber;
    block > 0;
    block -= 0.05 * latestBlockNumber
  ) {
    // Ensure the blockNumber is an integer > 0
    blockNumbers.push(Math.ceil(block));
  }
  const blocks = {};
  await Promise.all(
    blockNumbers.map(async blockNumber => {
      const block = await web3.eth.getBlock(blockNumber);
      blocks[blockNumber] = Boolean((block || {}).hash);
    })
  );
  console.log("blocks", blocks);
}

export default diagnoseEthchain;

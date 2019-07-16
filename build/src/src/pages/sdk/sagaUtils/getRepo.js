import web3 from "./web3";
import getBlockTimestamp from "./getBlockTimestamp";
import repoContract from "contracts/repository.json";

const options = {
  year: "numeric",
  month: "short",
  day: "numeric"
};

function getDate(blockNumber) {
  return getBlockTimestamp(blockNumber).then(timestamp =>
    new Intl.DateTimeFormat("en-US", options).format(timestamp * 1000)
  );
}

function getContentUri(repo, version) {
  return repo.methods
    .getBySemanticVersion(version)
    .call()
    .then(result => web3.utils.hexToAscii(result.contentURI))
    .catch(e =>
      e.message === "Couldn't decode uint16 from ABI: 0x"
        ? "NOT_VALID_VERSION"
        : e.message
    );
}

// txHash = 0xc2589085830a93086ae9e133b613005a1e3d1b6aaa863631eec606d5e3d6b028
function getSender(txHash) {
  return web3.eth.getTransaction(txHash).then(txObj => txObj.from);
}

// function addPackage({ id, name, repoAddr }) {
//   logs.info(`Adding ${name}, repoAddr: ${repoAddr}, id: ${id}`);
async function getRepo({ blockNumber, address }) {
  // event NewVersion(uint256 versionId, uint16[3] semanticVersion);
  const repo = new web3.eth.Contract(repoContract.abi, address);
  const newVersionEvents = await repo.getPastEvents("NewVersion", {
    fromBlock: String(blockNumber)
  });
  const versions = await Promise.all(
    newVersionEvents.reverse().map(async newVersionEvent => {
      const { semanticVersion } = newVersionEvent.returnValues;
      const [date, sender, contentUri] = await Promise.all([
        getDate(newVersionEvent.blockNumber),
        getSender(newVersionEvent.transactionHash),
        getContentUri(repo, semanticVersion)
      ]);
      return {
        version: semanticVersion.join("."),
        blockNumber: newVersionEvent.blockNumber,
        date,
        sender,
        contentUri
      };
    })
  );
  return {
    date: await getDate(blockNumber),
    versions: versions.reduce((obj, item) => {
      obj[item.version] = item;
      return obj;
    }, {})
  };
}

export default getRepo;

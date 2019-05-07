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

// // Subscribe to new repos
// registry.events.NewRepo((err, event) => {
//   if (err)
//     return logs.error(`Error on registry NewRepo: ${err.stack || err.message}`);
//   handleNewRepo(event);
// });

// function handleNewRepo(event) {
//   // id: '0xd7ec73ef33cd0720e49cbc4bfb1a912840535bee540dcf01d1cc4caae0129631',
//   // name: 'livepeer',
//   // repo: '0xf655173FAfb85f9f2943b2F2518146a4c149c70b',
//   const { id, name, repo: repoAddr } = event.returnValues;
//   addPackage({ id, name, repoAddr });
// }

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

  //   await Promise.all(
  //     versionIndexes.map(async i => {
  //       try {
  //         const verArray = await repo.methods
  //           .getByVersionId(i)
  //           .call()
  //           .then(res => res.semanticVersion);
  //         // semanticVersion = [1, 0, 8]. It is joined to form a regular semver string
  //         const version = verArray.join(".");
  //         try {
  //           return {
  //             version,
  //             hash: await repo.methods
  //               .getBySemanticVersion(verArray)
  //               .call()
  //               .then(res => web3.utils.hexToAscii(res.contentURI))
  //           };
  //         } catch (e) {
  //           // If you request an inexistent ID to the contract, web3 will throw
  //           // Error: couldn't decode uint16 from ABI.
  //           return {
  //             version,
  //             error: String(e).includes("decode uint16 from ABI")
  //               ? "Attempting to fetch an inexistent version"
  //               : `Error getting version ${version} of repo ${repo.name}: ${
  //                   e.message
  //                 }`
  //           };
  //         }
  //       } catch (e) {
  //         console.error(`Error getting versions of ${repo.name}: ${e.stack}`);
  //       }
  //     })
  //   );
}

//   function getLatest() {
//     repo.methods
//       .getLatest()
//       .call()
//       .then(result => web3.utils.hexToAscii(result.contentURI))
//       .then(hash => {
//         if (hash.startsWith("/ipfs/")) newVersion({ id, hash, name });
//       })
//       .catch(err =>
//         logs.error(
//           `Error getting ${name}'s latest version: ${err.stack || err.message}`
//         )
//       );
//   }

//   // Get latest version
//   getLatest();

//   // Subscribe to new verions
//   repo.events.NewVersion(error => {
//     if (error)
//       return logs.error(
//         `Error on NewVersion of ${name}: ${err.stack || err.message}`
//       );
//     getLatest();
//   });
// }

export default getRepo;

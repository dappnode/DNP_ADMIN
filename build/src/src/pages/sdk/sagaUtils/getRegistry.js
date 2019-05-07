import registryContract from "contracts/registry.json";
import web3 from "./web3";
import web3Utils from "web3-utils";
import { stringIncludes } from "utils/strings";

/**
 * Fetches all repos from a registry.
 * This call may take a long while (10-30 seconds)
 *
 * @param {string} registryAddress = '0x266bfdb2124a68beb6769dc887bd655f78778923'
 * @returns {object} of repos: {
 *   timenode: {
 *     id: "0x6a5699a502e5914239605cde5bd114545c56cef63bbac3a3f5783844226a99a9"
 *     name: "timenode"
 *     repoAddr: "0x2ee525f1ae6c822D4205A915586616524A9DaC1E"
 *     timestamp: 1543338354
 *   },
 *   ...
 * }
 */
async function getRegistry(registryAddress) {
  if (!registryAddress) throw Error("registryAddress must be defined");
  if (!web3Utils.isAddress(registryAddress))
    throw Error(`registryAddress must be an address: ${registryAddress}`);

  const registry = new web3.eth.Contract(registryContract.abi, registryAddress);
  // Event definition
  //   topic: "0x526d4ccf8c3d7b6f0b6d4cc0de526d515c87d1ea3bd264ace0b5c2e70d1b2208"
  //   event NewRepo(bytes32 id, string name, address repo);
  // Event usage https://github.com/aragon/aragonOS/blob/da862e2c8d2666f8a15be74f4d401659e3e1b497/contracts/apm/APMRegistry.sol#L97
  //   bytes32 node = registrar.createNameAndPoint(keccak256(abi.encodePacked(_name)), repo);
  //   emit NewRepo(node, _name, repo);

  const newRepoEvents = await registry
    .getPastEvents("NewRepo", {
      fromBlock: registryContract.deployBlock
    })
    .then(removeDuplicatedRepos);
  return newRepoEvents
    .filter(event => {
      // Ignore faulty deploy of telegram repo
      const name = event.returnValues.name || "";
      if (
        stringIncludes(
          registryAddress,
          "0x266bfdb2124a68beb6769dc887bd655f78778923"
        ) &&
        name.includes(".")
      )
        return false;
      // ignore apm-registry apm-enssub apm-repo
      if (name.startsWith("apm-")) return false;
      return true;
    })
    .map(newRepoEvent => {
      // id: '0xd7ec73ef33cd0720e49cbc4bfb1a912840535bee540dcf01d1cc4caae0129631',
      // name: 'livepeer',
      // repo: '0xf655173FAfb85f9f2943b2F2518146a4c149c70b',
      const { id, name, repo: address } = newRepoEvent.returnValues;
      return {
        id,
        name,
        address,
        blockNumber: newRepoEvent.blockNumber
      };
    })
    .reduce((obj, item) => {
      obj[item.name] = item;
      return obj;
    }, {});
}

// Utility

// There has been issues during the deploy of some repos.
// This function ignores repos that have the same id assuming the latter repo is the good one
function removeDuplicatedRepos(repoEvents) {
  // Deal with duplicated repos
  // If two events have the same id, the latest will be pinned
  const eventsObj = {};
  for (const event of repoEvents) {
    const { id } = event.returnValues;
    if (!eventsObj[id] || event.blockNumber > eventsObj[id].blockNumber) {
      eventsObj[id] = event;
    }
  }
  return Object.values(eventsObj);
}

export default getRegistry;

import web3 from "./web3";
import repo from "contracts/repository.json";

/**
 * Get the lastest version of an APM repo contract for an ENS domain.
 *
 * @param {string} ensName: "admin.dnp.dappnode.eth"
 * @returns {string} latest semver version = '0.1.0'
 */
async function getLatestVersion(repoAddress) {
  const repoInstance = new web3.eth.Contract(repo.abi, repoAddress);
  return await repoInstance.methods
    .getLatest()
    .call()
    .then(res => res.semanticVersion.join("."))
    .catch(e => {
      // Rename error for user comprehension
      e.message = `Error getting latest version of ${repoAddress}: ${
        e.message
      }`;
      throw e;
    });
}

async function isAllowed(repoAddress, address) {
  const repoInstance = new web3.eth.Contract(repo.abi, repoAddress);
  return await repoInstance.methods
    .canPerform(
      address,
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      []
    )
    .call()
    .catch(e => {
      // Rename error for user comprehension
      e.message = `Error checking if account ${address} is allowed at ${repoAddress}: ${
        e.message
      }`;
      throw e;
    });
}

export default {
  getLatestVersion,
  isAllowed
};

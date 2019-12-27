import registryContract from "contracts/registry.json";
import repoContract from "contracts/repository.json";

export default async function executePublishTx(
  web3,
  {
    dnpName,
    version,
    manifestIpfsHash,
    developerAddress,
    registryAddress,
    repoAddress
  }
) {
  if (!dnpName) throw Error("dnpName must be defined");
  if (!version) throw Error("version must be defined");
  if (!manifestIpfsHash) throw Error("manifestIpfsHash must be defined");
  if (!registryAddress) throw Error("registryAddress must be defined");
  if (!manifestIpfsHash && !developerAddress)
    throw Error("developerAddress or repoAddress must be defined");

  // Compute tx data
  const contentURI =
    "0x" + Buffer.from(manifestIpfsHash, "utf8").toString("hex");
  // @param _contractAddress address for smart contract logic for version (if set to 0, it uses last versions' contractAddress)
  const contractAddress = "0x0000000000000000000000000000000000000000";
  const shortName = dnpName.split(".")[0];

  const userAddress = await web3.eth.getAccounts().then(res => res[0]);

  // If repository exists, push new version to it
  if (repoAddress) {
    // newVersion(
    //     uint16[3] _newSemanticVersion,
    //     address _contractAddress,
    //     bytes _contentURI
    // )
    const repo = new web3.eth.Contract(repoContract.abi, repoAddress);
    const txHash = await repo.methods
      .newVersion(
        version.split("."), // uint16[3] _newSemanticVersion
        contractAddress, // address _contractAddress
        contentURI // bytes _contentURI
      )
      .send({ from: userAddress, gas: 300000, value: 0 });
    /* eslint-disable-next-line no-console */
    console.log("got txHash", txHash);
  }
  // If repo does not exist, create a new repo and push version
  else {
    // A developer address can be provided by the option developerAddress.
    // If it is not provided a prompt will ask for it

    // newRepoWithVersion(
    //     string _name,
    //     address _dev,
    //     uint16[3] _initialSemanticVersion,
    //     address _contractAddress,
    //     bytes _contentURI
    // )
    const registry = new web3.eth.Contract(
      registryContract.abi,
      registryAddress
    );
    const txHash = await registry.methods
      .newRepoWithVersion(
        shortName, // string _name
        developerAddress, // address _dev
        version.split("."), // uint16[3] _initialSemanticVersion
        contractAddress, // address _contractAddress
        contentURI // bytes _contentURI
      )
      .send({ from: userAddress, gas: 1100000, value: 0 });
    /* eslint-disable-next-line no-console */
    console.log("got txHash", txHash);
  }
}

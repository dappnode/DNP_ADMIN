import Web3 from "web3";

export default async function connectToMetamask() {
  // Modern dapp browsers...
  if (window.ethereum) {
    // Request account access if needed
    await window.ethereum.enable();
    // Acccounts now exposed
    return new Web3(window.ethereum);
    // web3.eth.sendTransaction({
    //   /* ... */
    // });
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    throw Error("Non-Ethereum browser detected. Please, install MetaMask");
  }
}

import Web3 from "web3";

// const providerUrl = "wss://mainnet.infura.io/_ws";
const providerUrl = "https://mainnet.infura.io";
// const providerUrl = "ws://my.ethchain.dnp.dappnode.eth:8546";
const web3 = new Web3(providerUrl);

export default web3;

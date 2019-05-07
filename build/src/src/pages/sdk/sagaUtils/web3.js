import Web3 from "web3";

function configureWeb3() {
  const providerUrl = "http://my.ethchain.dnp.dappnode.eth:8545";
  return new Web3(providerUrl);
}

export default (process.env.REACT_APP_MOCK_DATA ? {} : configureWeb3());

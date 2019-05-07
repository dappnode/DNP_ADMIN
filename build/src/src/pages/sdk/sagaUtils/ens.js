import web3 from "./web3";
import Ens from "ethereum-ens";

function configureEns() {
  const _provider = web3.currentProvider;
  // Correct incompatibility between modules
  _provider.sendAsync = _provider.sendAsync || _provider.send;
  return new Ens(_provider);
}

export default (process.env.REACT_APP_MOCK_DATA ? {} : configureEns());

import web3 from "./web3";
import Ens from "ethereum-ens";

function configureEns() {
  if (process.env.REACT_APP_MOCK_DATA || process.env.TEST) return {};

  const _provider = web3.currentProvider;
  // Correct incompatibility between modules
  _provider.sendAsync = _provider.sendAsync || _provider.send;
  return new Ens(_provider);
}

export default configureEns();

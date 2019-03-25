import web3 from "./web3";
import Ens from "ethereum-ens";

const _provider = web3.currentProvider;
// Correct incompatibility between modules
_provider.sendAsync = _provider.sendAsync || _provider.send;
const ens = new Ens(_provider);

export default ens;

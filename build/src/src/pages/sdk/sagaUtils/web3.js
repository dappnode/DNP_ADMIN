import Web3 from "web3";
import { fullnodeHttpJsonRpc } from "../../../params";

function configureWeb3() {
  if (process.env.REACT_APP_MOCK_DATA || process.env.TEST) return {};

  return new Web3(fullnodeHttpJsonRpc);
}

export default configureWeb3();

import { fullnodeHttpJsonRpc } from "params";
import Web3 from "web3";

let web3;
function getWeb3() {
  if (!web3) web3 = new Web3(fullnodeHttpJsonRpc);
  return web3;
}

const blockDiff = 50;
const cacheTime = 120 * 1000; // ms

/**
 * RPC CALL
 * ========
 * Calls the RPC method eth_syncing
 * Each call takes ~600ms (500ms minimum, 1500ms maximum observed)
 * Using this raw methodology to avoid expensive libraries (web3)
 *
 * @returns {bool} Returns true if it's syncing and the blockDiff
 * is big enough. Returns false otherwise
 */
const isSyncingRpcCall = () =>
  getWeb3()
    .eth.isSyncing()
    .then(res => {
      if (!res) return false;
      const currentBlock = parseInt(res.currentBlock, 10);
      const highestBlock = parseInt(res.highestBlock, 10);
      return Math.abs(currentBlock - highestBlock) > blockDiff;
    })
    .catch(err => {
      console.error("Error calling isSyncing", err);
    });

/**
 * CACHE RESPONSE WRAP
 * ===================
 * To prevent multiple calls to the dappmanager to wait for isSyncing,
 * the result will be cached for a short period of time (30s)
 */
const isSyncingCache = {
  lastCheck: 0,
  res: false
};

/**
 * If the time threshold is exceeded, recompute value
 * lastCheck time is updated immediately. During the time the fetch
 * is happening, future calls will still get the old value, but this
 * ensures the minimum number of calls
 *
 * @returns {bool} isSyncing: true / false
 */
async function isSyncingWrap() {
  // Prevent logging errors on offline development
  if (process.env.REACT_APP_MOCK_DATA) return false;

  if (Date.now() - isSyncingCache.lastCheck > cacheTime) {
    isSyncingCache.lastCheck = Date.now();
    isSyncingCache.res = await isSyncingRpcCall();
  }
  return isSyncingCache.res;
}

export default isSyncingWrap;

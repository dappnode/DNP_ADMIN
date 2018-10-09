const Web3 = require('web3');
const web3 = new Web3('http://my.ethchain.dnp.dappnode.eth:8545');

const blockDiff = 50;
const cacheTime = 120 * 1000; // ms

/**
 * RPC CALL
 * ========
 * Calls the RPC method eth_syncing
 * Each call takes ~600ms (500ms minimum, 1500ms maximum observed)
 * Using this raw methodology to avoid expensive libraries (web3)
 *
 * @return {Bool} Returns true if it's syncing and the blockDiff
 * is big enough. Returns false otherwise
 */
const isSyncingRpcCall = () => web3.eth.isSyncing()
    .then(res => {
        if (!res) return false
        const currentBlock = parseInt(res.currentBlock);
        const highestBlock = parseInt(res.highestBlock);
        return Math.abs(currentBlock - highestBlock) > blockDiff
    })
    .catch(err => {
        console.error('Error calling isSyncing', err)
    })

/**
 * CACHE RESPONSE WRAP
 * ===================
 * To prevent multiple calls to the dappmanager to wait for isSyncing,
 * the result will be cached for a short period of time (30s)
 */
const isSyncingCache = {
    lastCheck: 0,
    res: false,
};

/**
 * If the time threshold is exceeded, recompute value
 * lastCheck time is updated immediately. During the time the fetch
 * is happening, future calls will still get the old value, but this
 * ensures the minimum number of calls
 *
 * @return {Bool} isSyncing: true / false
 */
async function isSyncingWrap() {
    if (Date.now() - isSyncingCache.lastCheck > cacheTime) {
        isSyncingCache.lastCheck = Date.now();
        isSyncingCache.res = await isSyncingRpcCall();
    }
    return isSyncingCache.res;
}

export default isSyncingWrap;

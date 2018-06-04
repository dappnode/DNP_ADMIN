import Web3 from 'Lib/web3.min'
import * as AppActions from 'Action'


// import the actual Api class
import Api from '@parity/api';

// @Parity, do the setup
const parityProvider = new Api.Provider.Http('http://my.ethchain.dnp.dappnode.eth:8545');
const api = new Api(parityProvider);

const MIN_BLOCK_DIFF_SYNC = 10

let ETHCHAIN_URL = 'http://my.ethchain.dnp.dappnode.eth:8545'

console.log('Attempting to connect to ', ETHCHAIN_URL)

// Web3
const web3Provider = new Web3.providers.HttpProvider(ETHCHAIN_URL)
let web3 = new Web3(web3Provider);

let web3WatchLoop = setInterval(function(){
  try {

    api.eth.syncing()
    .then(function(isSyncing){

      if (
        isSyncing
        // Condition 1, big enough difference between current and highest block
        && isSyncing.highestBlock.c[0] - isSyncing.currentBlock.c[0] > MIN_BLOCK_DIFF_SYNC
      ) {

        if (isSyncing.warpChunksAmount.c[0] == 0) {
          // Regular syncing
          const cB = isSyncing.currentBlock.c[0]
          const hB = isSyncing.highestBlock.c[0]
          log(true, 'warning', 'Blocks synced: '+cB+' / '+hB+' ('+Math.floor(100*cB/hB)+'%)')
        } else {
          // From SNAPSHOT
          const cC = isSyncing.warpChunksProcessed.c[0]
          const hC = isSyncing.warpChunksAmount.c[0]
          log(true, 'warning', 'Syncing from SNAPSHOT: '+cC+' / '+hC+' ('+Math.floor(100*cC/hC)+'%)')
        }

      } else {

        web3.eth.getBlockNumber()
        .then(function(blockNumber){
          log(false, 'success', 'Syncronized, block: '+blockNumber)
        })
      }
    })

    .catch(function(e){
      log('danger', 'Error: '+e.message)
    })

  } catch(e) {
    log('danger', 'Error: '+e.message)
  }
}, 1000);




function log(isSyncing, type, status) {
  if (status && status.includes('Invalid JSON RPC response')) {
    status = 'Can\'t connect to ETHCHAIN.'
  }
  console.log({
    isSyncing,
    type,
    status
  })
  AppActions.updateChainStatus({
    isSyncing,
    type,
    status
  })
}

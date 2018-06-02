import Web3 from 'Lib/web3.min'
import * as AppActions from 'Action'


// import the actual Api class
import Api from '@parity/api';

// @Parity, do the setup
const parityProvider = new Api.Provider.Http('http://my.ethchain.dnp.dappnode.eth:8545');
const api = new Api(parityProvider);

const MIN_BLOCK_DIFF_SYNC = 10

let ethchains = [
  {
    name: 'Mainnet',
    url: 'http://my.ethchain.dnp.dappnode.eth:8545'
  }
]


ethchains.forEach(function(ethchain) {
  console.log('ethchain.url',ethchain.url)

  // Web3
  const web3Provider = new Web3.providers.HttpProvider(ethchain.url)
  let web3 = new Web3(web3Provider);

  let web3WatchLoop = setInterval(function(){
    try {

      api.eth.syncing()
      .then(function(isSyncing){

        if (
          isSyncing
          // Condition 1, big enough difference between current and highest block
          && syncing.highestBlock.c[0] - syncing.currentBlock.c[0] > MIN_BLOCK_DIFF_SYNC
        ) {

          if (isSyncing.warpChunksAmount.c[0] == 0) {
            // Regular syncing
            const cB = isSyncing.currentBlock.c[0]
            const hB = isSyncing.highestBlock.c[0]
            log(ethchain.name, true, 'warning', 'Blocks synced: '+cB+' / '+hB+' ('+Math.floor(100*cB/hB)+'%)')
          } else {
            // From SNAPSHOT
            const cC = isSyncing.warpChunksProcessed.c[0]
            const hC = isSyncing.warpChunksAmount.c[0]
            log(ethchain.name, true, 'warning', 'Syncing from SNAPSHOT: '+cC+' / '+hC+' ('+Math.floor(100*cC/hC)+'%)')
          }

        } else {

          web3.eth.getBlockNumber()
          .then(function(blockNumber){
            log(ethchain.name, false, 'success', 'Syncronized, block: '+blockNumber)
          })
        }
      })

      .catch(function(e){
        log(ethchain.name, 'danger', 'Error: '+e.message)
      })

    } catch(e) {
      log(ethchain.name, 'danger', 'Error: '+e.message)
    }
  }, 1000);

})


function log(name, isSyncing, type, status) {
  if (status && status.includes('Invalid JSON RPC response')) {
    status = 'Can\'t connect to ETHCHAIN.'
  }
  // console.log(name, type, status)
  AppActions.updateChainStatus({
    name,
    isSyncing,
    type,
    status
  })
}

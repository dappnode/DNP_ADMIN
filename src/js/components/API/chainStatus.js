import Web3 from 'Lib/web3.min'
import * as AppActions from 'Action'


let ethchains = [
  {
    name: 'Mainnet',
    url: 'http://my.ethchain.dnp.dappnode.eth:8545'
  }
]

ethchains.forEach(function(ethchain) {
  console.log('ethchain.url',ethchain.url)
  const provider = new Web3.providers.HttpProvider(ethchain.url)
  let web3 = new Web3(provider);

  let web3WatchLoop = setInterval(function(){
    try {

      web3.eth.isSyncing()
      .then(function(isSyncing){
        if (isSyncing) {
          log(ethchain.name, 'warning', 'Blocks synced: '+isSyncing.currentBlock+' / '+isSyncing.highestBlock)
        } else {
          web3.eth.getBlockNumber()
          .then(function(blockNumber){
            log(ethchain.name, 'success', 'Syncronized, block: '+blockNumber)
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


function log(name, type, status) {
  console.log(name, type, status)
  AppActions.updateChainStatus({
    name,
    type,
    status
  })
}

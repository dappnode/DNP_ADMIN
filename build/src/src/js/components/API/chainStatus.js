import Web3 from 'Lib/web3.min'
import * as AppActions from 'Action'
import { linearRegression } from 'simple-statistics'


// import the actual Api class
import Api from '@parity/api';

// @Parity, do the setup
const parityProvider = new Api.Provider.Http('http://my.ethchain.dnp.dappnode.eth:8545');
const api = new Api(parityProvider);

const MIN_BLOCK_DIFF_SYNC = 10
const INTERVAL_MS = 1000 // ms
const TRACKER_MAX_LENGTH = 60

let ETHCHAIN_URL = 'http://my.ethchain.dnp.dappnode.eth:8545'

console.log('Attempting to connect to ', ETHCHAIN_URL)

// Web3
const web3Provider = new Web3.providers.HttpProvider(ETHCHAIN_URL)
let web3 = new Web3(web3Provider);

let chunks = []
let startTime = Date.now()
let syncingInfoGlobal

let web3WatchLoop = setInterval(function(){
  let timeout
  try {

    timeout = setTimeout(() => { throw Error('timeout expired') }, 3000);
    api.eth.syncing()
    .then(function(syncingInfo){
      clearTimeout(timeout)
      syncingInfoGlobal = syncingInfo
      if (
        syncingInfo
        // Condition 1, big enough difference between current and highest block
        && syncingInfo.highestBlock.c[0] - syncingInfo.currentBlock.c[0] > MIN_BLOCK_DIFF_SYNC
      ) {

        log(true, 0, trackSyncing(syncingInfo))

      } else {

        web3.eth.getBlockNumber()
        .then(function(blockNumber){
          log(false, 1, 'Syncronized, block: '+blockNumber)
        })
      }
    })

    .catch(function(e){
      clearTimeout(timeout)
      log(true, -1, 'Error: '+e.message)
    })

  } catch(e) {
    clearTimeout(timeout)
    log(true, -1, 'Error: '+e.message)
  }
}, INTERVAL_MS);




function log(isSyncing, typeNum, status) {
  let type
  if (typeNum ===  1) type = 'success'
  if (typeNum ===  0) type = 'warning'
  if (typeNum === -1) type = 'danger'
  AppActions.updateStatus({pkg: 'ethchain', item: 'chain', on: typeNum, msg: status})
  if (status && status.includes('Invalid JSON RPC response')) {
    status = 'Can\'t connect to ETHCHAIN.'
  }
  // console.log({
  //   isSyncing,
  //   type,
  //   status,
  //   syncingInfoGlobal
  // })
  AppActions.updateChainStatus({
    isSyncing,
    type,
    status
  })
}

const track = { blocks: [], chunks: [] }
function trackSyncing(syncingInfo) {
  // Parse syncing object
  const cB = syncingInfo.currentBlock.c[0]
  const hB = syncingInfo.highestBlock.c[0]
  const cC = syncingInfo.warpChunksProcessed.c[0]
  const hC = syncingInfo.warpChunksAmount.c[0]

  // Store progress
  const time = (Date.now()-startTime)/1000 // convert to seconds
  track.blocks.push([time, cB])
  track.chunks.push([time, cC])
  // Clean array limiting it to 60 values
  if (track.blocks.length > TRACKER_MAX_LENGTH) track.blocks.shift()
  if (track.chunks.length > TRACKER_MAX_LENGTH) track.chunks.shift()

  // Compute slopes
  const chunksPerSecond = linearRegression(track.chunks).m
  const blocksPerSecond = linearRegression(track.blocks).m
  // console.log('blocksPerSecond',blocksPerSecond,'chunksPerSecond',chunksPerSecond)

  // Compare slopes
  // chunksPerSecond = 0.1 ~ 1, blocksPerSecond = 100 ~ 1000
  // OPTIONAL CONDITION syncingInfo.warpChunksAmount.c[0] == 0
  const isSnapshot = (chunksPerSecond > blocksPerSecond/1000)

  // Output for the user
  if (isSnapshot) {
    const time = Math.floor((hC-cC) / chunksPerSecond / 60)
    return 'Syncing from SNAPSHOT: '+cC+' / '+hC+' ('+Math.floor(100*cC/hC)+'%) '+time+' min remaining'
  }
  else {
    const time = Math.floor((hB-cB) / blocksPerSecond / 60)
    return 'Blocks synced: '+cB+' / '+hB+' ('+Math.floor(100*cB/hB)+'%) '+time+' min remaining'
  }
}

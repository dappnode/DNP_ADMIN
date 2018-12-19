import { linearRegression } from "simple-statistics";
import Web3 from "web3";

let web3Public = new Web3();

const MIN_BLOCK_DIFF_SYNC = 10;
const INTERVAL_MS = 2 * 1000; // ms
const TRACKER_MAX_LENGTH = 60;

class Ethchain {
  constructor(url, callback) {
    this.url = url;
    this.web3 = new Web3();
    this.blockNumber = undefined;
    this.syncingObject = false;
    this.track = { blocks: [], chunks: [] };
    this.startTime = Date.now(); // Prevents too big time values
    // Callback
    this.callback = callback;
    callback({
      status: 0,
      msg: "Connecting to " + url
    });
    // Subscription tokens
    this.newBlockHeadersSubscription = undefined;
    // Init
    this.web3.setProvider(this.newProvider(url));
  }

  restart = () => {
    this.startSubscriptions("Manually initiated");
  };

  stop = () => {
    clearTimeout(this.syncingToken);
    let handleUnsubscribe = (error, success) => {
      // This wil likely fail because the connection is already closed
      // if (error) console.error("Error unsubscribing " + this.url, error);
    };
    if (
      this.newBlockHeadersSubscription &&
      this.newBlockHeadersSubscription.unsubscribe
    )
      this.newBlockHeadersSubscription.unsubscribe(
        handleUnsubscribe.bind(this)
      );
  };

  newProvider = url => {
    if (!(this instanceof Ethchain)) console.error("WRONG THIS!");
    const provider = new Web3.providers.WebsocketProvider(url);
    provider.on("error", this.handleDisconnects.bind(this));
    provider.on("end", this.handleDisconnects.bind(this));
    provider.on("timeout", this.handleDisconnects.bind(this));
    provider.on("connect", this.startSubscriptions.bind(this));
    return provider;
  };

  // Provider callbacks

  handleDisconnects = e => {
    // Cancel the interval
    clearTimeout(this.syncingToken);
    // Skip retry error to avoid creating too much provider instances
    if (this.nextAttempt && this.nextAttempt > Date.now()) return;
    // Use a parabolic time increase to slow down reconnection attempts
    this.retryAttempt ? this.retryAttempt++ : (this.retryAttempt = 1);
    this.waitTime = 1000 * Math.pow(this.retryAttempt, 1.7);
    this.nextAttempt = Date.now() + this.waitTime;
    // Schedule next attempt
    setTimeout(() => {
      this.onError(
        "Connection " +
          e.type +
          ". Reconnection #" +
          this.retryAttempt +
          ", next in " +
          Math.round(this.waitTime / 1000) +
          "s"
      );
      this.web3.setProvider(this.newProvider(this.url));
    }, this.waitTime);
  };

  startSubscriptions(e) {
    // Properly binded, this = Ethchain
    if (!(this instanceof Ethchain)) console.error("WRONG THIS!");
    this.retryAttempt = 0;
    this.syncingTimeoutMs = INTERVAL_MS;
    // Request block number immediately
    // Commented out to avoid success -> warning on start-up
    // const handleBlock = block => {
    //   console.log(block, this.url);
    //   this.setBlock(block);
    // };
    // this.web3.eth.getBlockNumber().then(handleBlock.bind(this));
    // Subscribe to new block numbers
    this.subscribeToBlockNumber();
    // Subscribe to isSyncing, slow down calls if synced
    this.subscribeToSyncing();
  }

  // Subscribe methods
  subscribeToBlockNumber = () => {
    let handleBlockHeader = (error, blockHeader) => {
      if (error) console.error(error);
      else this.setBlock(blockHeader.number);
    };
    this.newBlockHeadersSubscription = this.web3.eth.subscribe(
      "newBlockHeaders",
      handleBlockHeader
    );
  };

  subscribeToSyncing = () => {
    let handleIsSyncing = (error, syncing) => {
      if (error) return console.log(error);
      // Increase next syncing check if already synced
      if (!syncing) this.syncingTimeoutMs = this.syncingTimeoutMs * 1.5;
      // Speed up blocknumber fetching
      let handleBlockNumber = block => {
        this.setBlock(block);
      };
      if (!this.blockNumber)
        this.web3.eth.getBlockNumber().then(handleBlockNumber.bind(this));
      // Format in place
      formatSyncing(syncing);
      // track syncing to know if it's syncing from snapshot or not
      this.trackSyncing(syncing);
      // store syncing
      this.setSyncing(syncing);
      // Schedule the next check
      let subscribeToSyncing = this.subscribeToSyncing.bind(this);
      this.syncingToken = setTimeout(subscribeToSyncing, this.syncingTimeoutMs);
    };
    this.web3.eth.isSyncing(handleIsSyncing);
  };

  trackSyncing = syncing => {
    if (!syncing) return;
    // Parse syncing object, create aliases
    const { cB, cC } = parseSyncing(syncing);

    // Store progress
    const time = (Date.now() - this.startTime) / 1000; // convert to seconds
    this.track.blocks.push([time, cB]);
    this.track.chunks.push([time, cC]);
    // Clean array limiting it to 60 values
    if (this.track.blocks.length > TRACKER_MAX_LENGTH)
      this.track.blocks.shift();
    if (this.track.chunks.length > TRACKER_MAX_LENGTH)
      this.track.chunks.shift();
  };

  setBlock(block) {
    // Properly binded, this = Ethchain
    // if (!(this instanceof Ethchain)) console.error("WRONG THIS!");
    if (block) this.blockNumber = block;
    this.onUpdate();
  }

  setSyncing = syncing => {
    if (syncing || this.syncingObject) this.onUpdate();
    this.syncingObject = syncing;
  };

  onError = err => {
    const response = errorResponse(err);
    this.callback(response);
  };

  onUpdate = () => {
    const response = this.syncingLogic();
    this.callback(response);
  };

  syncingLogic = () => {
    // Properly binded, this = Ethchain
    // If no syncing, display synced
    if (!this.syncingObject) return syncedResponse(this.blockNumber);
    // Otherwise check the difference
    const { cB, hB } = parseSyncing(this.syncingObject);
    // console.log(hB, cB, hB - cB < MIN_BLOCK_DIFF_SYNC);
    if (hB - cB < MIN_BLOCK_DIFF_SYNC) return syncedResponse(this.blockNumber);
    // Now display that is syncing
    return isSyncingResponse(this.syncingObject, this.track);
  };
}

// Utilities

function formatSyncing(syncing) {
  const keys = ["warpChunksAmount", "warpChunksProcessed"];
  keys.filter(key => syncing[key]).forEach(key => {
    syncing[key] = web3Public.utils.hexToNumber(syncing[key]);
  });
}

function parseSyncing(syncing) {
  return {
    cB: syncing.currentBlock,
    hB: syncing.highestBlock,
    cC: syncing.warpChunksProcessed,
    hC: syncing.warpChunksAmount
  };
}

function computeRemainingTime(cX, hX, xPerSecond) {
  const time = Math.floor((hX - cX) / xPerSecond / 60);
  const percent = Math.floor((100 * cX) / hX);
  if (time > 0 && time < 1440) {
    return cX + " / " + hX + " (" + percent + "%) " + time + " min remaining";
  } else {
    return cX + " / " + hX + " (" + percent + "%) computing remaining time...";
  }
}

function errorResponse(err) {
  return {
    status: -1,
    msg: typeof err === typeof {} ? JSON.stringify(err) : String(err)
  };
}

function syncedResponse(blockNumber) {
  return {
    status: 1,
    msg: "Synced #" + blockNumber
  };
}

function isSyncingResponse(syncing, track) {
  const { cB, hB, cC, hC } = parseSyncing(syncing);
  // Compute slopes
  const chunksPerSecond = linearRegression(track.chunks).m;
  const blocksPerSecond = linearRegression(track.blocks).m;
  // Compare slopes
  // Scaling: chunksPerSecond = 0.1 ~ 1, blocksPerSecond = 100 ~ 1000
  // Additional condition: chunksAmount > 0 && chunksProcessed > 0
  let isSnapshot = cC * hC > 0 && 1000 * chunksPerSecond > blocksPerSecond;

  // Output for the user
  const msg = isSnapshot
    ? "Syncing snapshot: " + computeRemainingTime(cC, hC, chunksPerSecond)
    : "Blocks synced: " + computeRemainingTime(cB, hB, blocksPerSecond);
  return {
    status: 0,
    msg
  };
}

export default Ethchain;

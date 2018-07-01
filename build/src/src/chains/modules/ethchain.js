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
    // Subscription tokens
    this.newBlockHeadersSubscription = undefined;
    // Init
    this.web3.setProvider(this.newProvider(url));
  }

  restart = () => {
    this.startSubscriptions("Manually initiated");
  };

  stop = () => {
    let _this = this;
    clearTimeout(this.syncingToken);
    if (
      this.newBlockHeadersSubscription &&
      this.newBlockHeadersSubscription.unsubscribe
    )
      this.newBlockHeadersSubscription.unsubscribe(function(error, success) {
        if (error)
          console.error(
            "Error unsubscribing " + _this.url + " from newBlockHeaders: ",
            error
          );
      });
  };

  newProvider = url => {
    const provider = new Web3.providers.WebsocketProvider(url);
    provider.on("error", this.handleDisconnects);
    provider.on("end", this.handleDisconnects);
    provider.on("timeout", this.handleDisconnects);
    provider.on("connect", this.startSubscriptions);
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
        "Connection " + e.type + ". Reconnection #" + this.retryAttempt
      );
      this.web3.setProvider(this.newProvider(this.url));
    }, this.waitTime);
  };

  startSubscriptions = e => {
    this.retryAttempt = 0;
    this.syncingTimeoutMs = INTERVAL_MS;
    // Request block number immediately
    this.web3.eth.getBlockNumber().then(this.setBlock);
    // Subscribe to new block numbers
    this.subscribeToBlockNumber();
    // Subscribe to isSyncing, slow down calls if synced
    this.subscribeToSyncing();
  };

  // Subscribe methods
  subscribeToBlockNumber = () => {
    let _this = this;
    this.newBlockHeadersSubscription = this.web3.eth.subscribe(
      "newBlockHeaders",
      function(error, blockHeader) {
        if (error) console.log(error);
        else _this.setBlock(blockHeader.number);
      }
    );
  };

  subscribeToSyncing = () => {
    let _this = this;
    this.web3.eth.isSyncing(function(error, syncing) {
      if (error) return console.log(error);
      // Increase next syncing check if already synced
      if (!syncing) _this.syncingTimeoutMs = _this.syncingTimeoutMs * 1.5;
      // Speed up blocknumber fetching
      if (!syncing) _this.web3.eth.getBlockNumber().then(_this.setBlock);
      // Format in place
      formatSyncing(syncing);
      // track syncing to know if it's syncing from snapshot or not
      _this.trackSyncing(syncing);
      // store syncing
      _this.setSyncing(syncing);
      // Schedule the next check
      _this.syncingToken = setTimeout(
        _this.subscribeToSyncing,
        _this.syncingTimeoutMs
      );
    });
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

  setBlock = block => {
    if (this.blockNumber !== block) this.onUpdate();
    if (block) this.blockNumber = block;
  };

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
    // If no syncing, display synced
    if (!this.syncingObject) return syncedResponse(this.blockNumber);
    // Otherwise check the difference
    const { cB, hB } = parseSyncing(this.syncingObject);
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
  return cX + " / " + hX + " (" + percent + "%) " + time + " min remaining";
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

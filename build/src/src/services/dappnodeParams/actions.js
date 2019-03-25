import * as t from "./actionTypes";

// Service > dappnodeParams

// Update

export const updateDappnodeParams = params => ({
  type: t.UPDATE_DAPPNODE_PARAMS,
  params
});

export const updateDappnodeStats = stats => ({
  type: t.UPDATE_DAPPNODE_STATS,
  stats
});

export const updateDappnodeDiagnose = diagnose => ({
  type: t.UPDATE_DAPPNODE_DIAGNOSE,
  diagnose
});

export const updatePingReturn = (dnp, pingReturn) => ({
  type: t.UPDATE_PING_RETURN,
  dnp,
  pingReturn
});

export const updateIpfsConnectionStatus = ipfsConnectionStatus => ({
  type: t.UPDATE_IPFS_CONNECTION_STATUS,
  ipfsConnectionStatus
});

// Fetch

export const fetchDappnodeParams = () => ({
  type: t.FETCH_DAPPNODE_PARAMS
});

export const fetchDappnodeStats = () => ({
  type: t.FETCH_DAPPNODE_STATS
});

export const fetchDappnodeDiagnose = () => ({
  type: t.FETCH_DAPPNODE_DIAGNOSE
});

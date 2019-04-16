import * as t from "./actionTypes";
import * as loadingIds from "./loadingIds";

// Service > loadingStatus

const updateLoadingById = id => loading => ({
  type: t.UPDATE_LOADING,
  id,
  loading
});

export const dappnodeParams = updateLoadingById(loadingIds.dappnodeParams);
export const dappnodeStats = updateLoadingById(loadingIds.dappnodeStats);
export const dappnodeDiagnose = updateLoadingById(loadingIds.dappnodeDiagnose);
export const pingDappnodeDnps = updateLoadingById(loadingIds.pingDappnodeDnps);
export const versionData = updateLoadingById(loadingIds.versionData);
export const ipfsConnectionStatus = updateLoadingById(
  loadingIds.ipfsConnectionStatus
);
// Service > dnpInstalled
export const dnpInstalled = updateLoadingById(loadingIds.dnpInstalled);

import { api } from "api";
import { createAction } from "@reduxjs/toolkit";
import { dappnodeStatus } from "./reducer";
import { AppThunk } from "store";

// Service > dappnodeStatus

// Update

export const setSystemInfo = dappnodeStatus.actions.systemInfo;
export const updateWifiStatus = dappnodeStatus.actions.wifiStatus;
export const updatePasswordIsInsecure =
  dappnodeStatus.actions.passwordIsInsecure;
export const updateAutoUpdateData = dappnodeStatus.actions.autoUpdateData;
export const updateVolumes = dappnodeStatus.actions.volumes;

// Fetch

export const fetchAllDappnodeStatus = createAction("FETCH_ALL_DAPPNODE_STATUS");
export const fetchDappnodeParams = createAction("FETCH_DAPPNODE_PARAMS");
export const fetchDappnodeStats = createAction("FETCH_DAPPNODE_STATS");
export const fetchDappnodeDiagnose = createAction("FETCH_DAPPNODE_DIAGNOSE");
export const fetchPasswordIsInsecure = createAction(
  "FETCH_PASSWORD_IS_INSECURE"
);

export const fetchAutoUpdateData = (): AppThunk => async dispatch =>
  withTryCatch(async () => {
    dispatch(updateAutoUpdateData(await api.autoUpdateDataGet()));
  }, "autoUpdateData");

async function withTryCatch(fn: () => Promise<void>, id = "") {
  try {
    await fn();
  } catch (e) {
    console.error(`Error fetching ${id}`, e);
  }
}

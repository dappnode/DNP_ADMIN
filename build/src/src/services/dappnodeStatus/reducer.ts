import { mapValues } from "lodash";
import {
  SystemInfo,
  HostStats,
  Diagnose,
  VolumeData,
  AutoUpdateDataView
} from "types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Service > dappnodeStatus

interface DappnodeStatusState {
  systemInfo: SystemInfo | null;
  stats: HostStats;
  diagnose: Diagnose;
  ipfsConnectionStatus: { resolves: boolean; error?: string } | null;
  wifiStatus: { running: boolean } | null;
  passwordIsInsecure: boolean;
  autoUpdateData: AutoUpdateDataView | null;
  volumes: VolumeData[];
}

const initialState: DappnodeStatusState = {
  systemInfo: null,
  stats: {},
  diagnose: [],
  ipfsConnectionStatus: null,
  wifiStatus: null,
  passwordIsInsecure: false,
  autoUpdateData: null,
  volumes: []
};

export const dappnodeStatus = createSlice({
  name: "dappnodeStatus",
  initialState,
  reducers: mapValues(
    initialState,
    (data, key) => (
      state: typeof initialState,
      action: PayloadAction<typeof data>
    ) => ({
      ...state,
      [key]: action.payload
    })
  ) as {
    [K in keyof DappnodeStatusState]: (
      state: DappnodeStatusState,
      action: PayloadAction<DappnodeStatusState[K]>
    ) => DappnodeStatusState;
  }
});

export const reducer = dappnodeStatus.reducer;

import { mapValues } from "lodash";
import { DappnodeStatusState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Service > dappnodeStatus

const initialState: DappnodeStatusState = {
  systemInfo: null,
  stats: {},
  diagnose: [],
  ipfsConnectionStatus: null,
  wifiStatus: null,
  passwordIsInsecure: false,
  autoUpdateData: null,
  mountpoints: [],
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

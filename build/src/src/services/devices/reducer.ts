import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { VpnDevice } from "common/types";
import { superAdminId } from "params";

// Service > devices

export const devicesAdapter = createEntityAdapter<VpnDevice>({
  sortComparer: (a, b) => (a.id === superAdminId ? -1 : 0)
});

export const devicesSlice = createSlice({
  name: "devices",
  initialState: devicesAdapter.getInitialState(),
  reducers: { updateDevices: devicesAdapter.setAll }
});

export const reducer = devicesSlice.reducer;

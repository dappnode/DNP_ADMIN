import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { VpnDevice, VpnDeviceCredentials } from "common/types";
import { superAdminId } from "params";

// Service > devices

type VpnDeviceState = VpnDevice & Partial<VpnDeviceCredentials>;

export const devicesAdapter = createEntityAdapter<VpnDeviceState>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: device => device.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => (a.id === superAdminId ? -1 : 0)
});

export const devicesSlice = createSlice({
  name: "devices",
  initialState: devicesAdapter.getInitialState(),
  reducers: {
    updateDevices: devicesAdapter.setAll,
    updateDevice: devicesAdapter.updateOne
  }
});

export const reducer = devicesSlice.reducer;


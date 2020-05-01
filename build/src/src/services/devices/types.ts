import { VpnDevice, VpnDeviceCredentials } from "common/types";

// Service > devices

export type VpnDeviceState = VpnDevice & Partial<VpnDeviceCredentials>;

export interface DevicesState {
  [deviceId: string]: VpnDeviceState;
}

export const UPDATE_DEVICES = "UPDATE_DEVICES";
export const UPDATE_DEVICE = "UPDATE_DEVICE";
export const FETCH_DEVICES = "FETCH_DEVICES";

export interface UpdateDevices {
  type: typeof UPDATE_DEVICES;
  devices: VpnDevice[];
}

export interface UpdateDevice {
  type: typeof UPDATE_DEVICE;
  id: string;
  device: Partial<VpnDeviceState>;
}

export type AllReducerActions = UpdateDevices | UpdateDevice;

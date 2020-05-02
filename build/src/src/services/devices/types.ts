import { VpnDevice, VpnDeviceCredentials } from "common/types";

// Service > devices

export type VpnDeviceState = VpnDevice & Partial<VpnDeviceCredentials>;

export interface DevicesState {
  [deviceId: string]: VpnDeviceState;
}

export const FETCH_DEVICES = "FETCH_DEVICES";

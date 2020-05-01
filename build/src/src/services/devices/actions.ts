import { VpnDevice } from "types";
import {
  UpdateDevices,
  UPDATE_DEVICES,
  VpnDeviceState,
  UPDATE_DEVICE,
  UpdateDevice
} from "./types";

// Service > devices

export const updateDevices = (devices: VpnDevice[]): UpdateDevices => ({
  type: UPDATE_DEVICES,
  devices
});

export const updateDevice = (
  id: string,
  device: Partial<VpnDeviceState>
): UpdateDevice => ({
  type: UPDATE_DEVICE,
  id,
  device
});

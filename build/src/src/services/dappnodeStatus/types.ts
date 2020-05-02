import {
  SystemInfo,
  HostStats,
  Diagnose,
  MountpointData,
  VolumeData,
  AutoUpdateDataView
} from "types";

// Service > dappnodeStatus

export interface DappnodeStatusState {
  systemInfo: SystemInfo | null;
  stats: HostStats;
  diagnose: Diagnose;
  ipfsConnectionStatus: IpfsConnectionStatus | null;
  wifiStatus: WifiStatus | null;
  passwordIsInsecure: boolean;
  autoUpdateData: AutoUpdateDataView | null;
  mountpoints: MountpointData[];
  volumes: VolumeData[];
}

export interface IpfsConnectionStatus {
  resolves: boolean;
  error?: string;
}

export interface WifiStatus {
  running: boolean;
}

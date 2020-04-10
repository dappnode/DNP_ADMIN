import { mountPoint } from "./data";
import {
  wifiName,
  ipfsName,
  wifiDefaultSSID,
  wifiDefaultWPA_PASSPHRASE,
  wifiEnvWPA_PASSPHRASE,
  wifiEnvSSID
} from "params";
import { DnpInstalledState } from "./types";
import { PackageContainer, PackageDetailData } from "types";

// Service > dnpInstalled

const getLocal = (state: any): DnpInstalledState => state[mountPoint];

export const getDnpInstalled = (state: any): PackageContainer[] =>
  getLocal(state).dnpInstalled;
export const getDnpInstalledStatus = (state: any) =>
  getLocal(state).requestStatus;
export const getDnpInstalledData = (
  state: any
): { [dnpName: string]: PackageDetailData } => getLocal(state).dnpInstalledData;

/**
 * Check if the wifi DNP has the same credentials as the default ones
 * @returns credentials are the same as the default ones
 */
export const getAreWifiCredentialsDefault = (state: any): boolean => {
  const dnps = getDnpInstalled(state);
  const wifiDnp = dnps.find(dnp => dnp.name === wifiName);
  if (!wifiDnp || !wifiDnp.envs) return false;
  return (
    wifiDnp.envs[wifiEnvWPA_PASSPHRASE] === wifiDefaultWPA_PASSPHRASE &&
    wifiDnp.envs[wifiEnvSSID] === wifiDefaultSSID
  );
};

/**
 * Returns object ready to check if a port is used or not
 */
export const getHostPortMappings = (state: any) => {
  const dnps = getDnpInstalled(state);
  const hostPortMappings: { [portId: string]: string } = {};
  for (const dnp of dnps)
    for (const port of dnp.ports || [])
      if (port.host)
        hostPortMappings[`${port.host}/${port.protocol}`] = dnp.name;
  return hostPortMappings;
};

interface VolumeStats {
  name: string;
  size: number;
}

/**
 * Returns the volume sizes of `ipfs` DNPs
 * - ipfs.dnp.dappnode.eth > dncore_ipfsdnpdappnodeeth_data
 */
export const getDappnodeVolumes = (state: any): VolumeStats[] => {
  const dnps = getDnpInstalled(state);

  const volumeStats: VolumeStats[] = [];

  const findDnp = (name: string) => dnps.find(dnp => dnp.name === name);
  const findVolume = (dnp: PackageContainer, name: string) =>
    (dnp.volumes || []).find(vol => (vol.name || "").endsWith(name));

  const ipfsDnp = findDnp(ipfsName);
  if (ipfsDnp) {
    const ipfsDataVolume = findVolume(ipfsDnp, "_data");
    if (ipfsDataVolume)
      volumeStats.push({ name: "Ipfs size", size: ipfsDataVolume.size || 0 });
  }

  return volumeStats;
};

/**
 * Regular selectors, called outside of a normal react-redux situation
 */

export const getDnpInstalledById = (state: any, id: string) =>
  getDnpInstalled(state).find(({ name }) => name === id);

export const getDependantsOfId = (state: any, id: string) =>
  getDnpInstalled(state)
    .filter(dnp => dnp.dependencies && dnp.dependencies[id])
    .map(dnp => dnp.name);

export const getDnpInstalledDataById = (
  state: any,
  id: string
): PackageDetailData | undefined => getDnpInstalledData(state)[id];

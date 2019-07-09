import { mountPoint, wifiDefaultSSID, wifiDefaultWPA_PASSPHRASE } from "./data";
import { createSelector } from "reselect";

// Service > dnpInstalled

export const getDnpInstalled = createSelector(
  state => state[mountPoint],
  dnps => dnps
);

/**
 * Returns the volume sizes of the `ethchain` and `ipfs` DNPs
 * - ethchain.dnp.dappnode.eth > dncore_ethchaindnpdappnodeeth_data
 * - ipfs.dnp.dappnode.eth > dncore_ipfsdnpdappnodeeth_data
 * @returns {array} [{
 *   name: "ethchain size",
 *   size: 143818512
 * }, ... ]
 */
export const getDappnodeVolumes = createSelector(
  getDnpInstalled,
  dnps =>
    dnps
      .filter(
        dnp =>
          dnp.name === "ethchain.dnp.dappnode.eth" ||
          dnp.name === "ipfs.dnp.dappnode.eth"
      )
      .map(dnp => {
        const dataVolume = ((dnp || {}).volumes || []).find(volume =>
          (volume.name || "").endsWith("_data")
        );
        return {
          name: `${dnp.shortName} size`,
          size: (dataVolume || {}).size
        };
      })
);

/**
 * Check if the wifi DNP has the same credentials as the default ones
 * @returns {bool} credentials are the same as the default ones
 */
export const getAreWifiCredentialsDefault = createSelector(
  getDnpInstalled,
  dnps => {
    const wifiDnp = dnps.find(dnp => dnp.name === "wifi.dnp.dappnode.eth");
    if (!wifiDnp || !wifiDnp.envs) return false;
    return (
      wifiDnp.envs.WPA_PASSPHRASE === wifiDefaultWPA_PASSPHRASE &&
      wifiDnp.envs.SSID === wifiDefaultSSID
    );
  }
);

/**
 * Regular selectors, called outside of a normal react-redux situation
 */

export const getDnpInstalledById = (state, id) =>
  getDnpInstalled(state).find(({ name }) => name === id);

export const getDependantsOfId = (state, id) =>
  getDnpInstalled(state)
    .filter(dnp => dnp.dependencies && dnp.dependencies[id])
    .map(dnp => dnp.name);

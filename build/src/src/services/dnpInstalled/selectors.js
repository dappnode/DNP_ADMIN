import { mountPoint, wifiDefaultSSID, wifiDefaultWPA_PASSPHRASE } from "./data";
import { createSelector } from "reselect";

// Service > dnpInstalled

export const getDnpInstalled = createSelector(
  state => state[mountPoint],
  dnps => dnps
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

export const getHostPortMappings = createSelector(
  getDnpInstalled,
  dnps => {
    const hostPortMappings = {};
    for (const dnp of dnps)
      for (const port of dnp.ports || [])
        if (port.host)
          hostPortMappings[`${port.host}/${port.protocol}`] = dnp.name;
    return hostPortMappings;
  }
);

export const getIsMainnetDnpNotRunning = createSelector(
  getDnpInstalled,
  dnps => {
    if (!dnps.length) return false;
    const mainnetDnp = dnps.find(
      dnp => dnp.name === "ethchain.dnp.dappnode.eth"
    );
    if (!mainnetDnp) return true;
    return !mainnetDnp.running;
  }
);

const defaultClientEnvName = "DEFAULT_CLIENT";
export const getEthchainClient = createSelector(
  getDnpInstalled,
  dnps => {
    if (!dnps.length) return null;
    const mainnetDnp = dnps.find(
      dnp => dnp.name === "ethchain.dnp.dappnode.eth"
    );
    if (
      !mainnetDnp ||
      !mainnetDnp.envs ||
      !(defaultClientEnvName in mainnetDnp.envs)
    )
      return null;

    return (mainnetDnp.envs[defaultClientEnvName] || "")
      .toLowerCase()
      .includes("geth")
      ? "Geth"
      : "Parity";
  }
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
  getEthchainClient,
  (dnps, ethchainClient) => {
    const findDnp = name => dnps.find(dnp => dnp.name === name) || {};
    const findVolume = (dnp, name) =>
      (dnp.volumes || []).find(vol => (vol.name || "").endsWith(name)) || {};
    const ipfsDnp = findDnp("ipfs.dnp.dappnode.eth");
    const ethchainDnp = findDnp("ethchain.dnp.dappnode.eth");
    const ipfsDataVolume = findVolume(ipfsDnp, "_data");
    const ethchainDataVolume = findVolume(
      ethchainDnp,
      ethchainClient === "Geth" ? "_geth" : "_data"
    );

    return [
      {
        name: `Ethchain size${ethchainClient ? ` (${ethchainClient})` : ""}`,
        size: ethchainDataVolume.size
      },
      { name: "Ipfs size", size: ipfsDataVolume.size }
    ];
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

import { mountPoint } from "./data";
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
 * @returns [{
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
 * Get a DNP volumes that are being used by other DNPs
 * - The volumes must have the same name
 * - The other DNPs must be running
 *
 * @param {string} id = "ethchain.dnp.dappnode.eth"
 * @returns {array} collidingVolumes = [{
 *   name: "ipfsreplicatordnpdappnodeeth_pin-data",
 *   dnps: ["ethchain.dnp.dappnode.eth", "other.dnp.dappnode.eth"]
 * }, .... ]
 */
export const getCollidingVolumesById = (state, id) => {
  const dnps = getDnpInstalled(state);
  const dnp = dnps.find(({ name }) => name === id);
  const collidingVolumes = [];

  // dnp.volumes = {
  //   type: "volume",
  //   name: "ipfsreplicatordnpdappnodeeth_pin-data",
  //   path: "/var/lib/docker/volumes/ipfsreplicatordnpdappnodeeth_pin-data/_data",
  //   links: "1",
  //   size: "140.4kB"
  // };
  for (const vol of dnp.volumes || []) {
    if (vol.links > 1) {
      // Colliding volume, find who is colliding with
      const collidingDnps = dnps
        .filter(_dnp => {
          if (_dnp.name === id) return false;
          for (const _vol of _dnp.volumes || []) {
            if (_vol.name === vol.name) return true;
          }
          return false;
        })
        .map(_dnp => _dnp.name);
      collidingVolumes.push({
        name: vol.name,
        dnps: collidingDnps
      });
    }
  }
  return collidingVolumes;
};

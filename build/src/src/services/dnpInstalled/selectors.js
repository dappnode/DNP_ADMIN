import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { objToArray } from "utils/objects";

// Service > dnpInstalled

export const getDnpInstalled = createSelector(
  state => state[mountPoint],
  dnps => objToArray(dnps)
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

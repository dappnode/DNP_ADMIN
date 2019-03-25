// DASHBOARD
import { createSelector } from "reselect";
import { getDappnodeStats } from "services/dappnodeParams/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";

// Utils

// #### EXTERNAL SELECTORS
export const connectionOpen = state => state.session && state.session.isOpen;
export const chainData = state => state.chainData;
export const getInstalledPackages = state => state.installedPackages;

export const getDappnodeStatsFormated = getDappnodeStats;

// ethchain.dnp.dappnode.eth > dncore_ethchaindnpdappnodeeth_data
// ipfs.dnp.dappnode.eth > dncore_ipfsdnpdappnodeeth_data
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

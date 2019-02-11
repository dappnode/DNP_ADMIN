// DASHBOARD
import { NAME } from "./constants";
import { createSelector } from "reselect";

// #### EXTERNAL SELECTORS
export const getPackages = createSelector(
  state => state.installedPackages,
  _packages => _packages
);

export const connectionOpen = createSelector(
  state => state.session && state.session.isOpen,
  _connectionOpen => _connectionOpen
);
export const chainData = createSelector(
  state => state.chainData,
  _chainData => _chainData
);

// #### INTERNAL SELECTORS
const getLocal = createSelector(
  state => state[NAME],
  local => local
);
export const dappnodeStats = createSelector(
  getLocal,
  local => local.dappnodeStats
);

// ethchain.dnp.dappnode.eth > dncore_ethchaindnpdappnodeeth_data
// ipfs.dnp.dappnode.eth > dncore_ipfsdnpdappnodeeth_data
export const dappnodeVolumes = createSelector(
  getPackages,
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

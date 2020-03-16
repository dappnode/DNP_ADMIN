import { mountPoint } from "../../../services/dnpInstalled/data";

// Redux imports
import { getDappnodeVolumes } from "../../../services/dnpInstalled/selectors";
import { DnpInstalledState } from "services/dnpInstalled/types";
import { installedDnpSample } from "schemas";

describe("service > dnpInstalled", () => {
  describe("getDappnodeVolumes", () => {
    it("Should return a the volume sizes of the DNPs ETHCHAIN and IPFS", () => {
      const ipfs = "ipfs.dnp.dappnode.eth";

      const dnpInstalledState: DnpInstalledState = {
        dnpInstalled: [
          {
            ...installedDnpSample,
            name: ipfs,
            shortName: "ipfs",
            volumes: [
              {
                name: ipfs + "_data",
                size: 2000,
                host: "/docker",
                container: "/data"
              }
            ]
          }
        ],
        requestStatus: {}
      };

      const state = {
        [mountPoint]: dnpInstalledState
      };

      expect(getDappnodeVolumes(state)).toEqual([
        { name: "Ipfs size", size: 2000 }
      ]);
    });
  });
});

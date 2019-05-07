import * as s from "../../../services/dnpInstalled/selectors";
import { mountPoint } from "../../../services/dnpInstalled/data";

describe("service > dnpInstalled", () => {
  describe("getDappnodeVolumes", () => {
    it("Should return a the volume sizes of the DNPs ETHCHAIN and IPFS", () => {
      const ethchain = "ethchain.dnp.dappnode.eth";
      const ipfs = "ipfs.dnp.dappnode.eth";
      const state = {
        [mountPoint]: [
          {
            name: ethchain,
            shortName: "ethchain",
            volumes: [{ name: ethchain + "_data", size: 1000 }]
          },
          {
            name: ipfs,
            shortName: "ipfs",
            volumes: [{ name: ipfs + "_data", size: 1000 }]
          }
        ]
      };
      expect(s.getDappnodeVolumes(state)).toEqual([
        { name: "ethchain size", size: 1000 },
        { name: "ipfs size", size: 1000 }
      ]);
    });
  });
});

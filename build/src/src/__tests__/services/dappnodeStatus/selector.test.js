import * as s from "../../../services/dappnodeStatus/selectors";
import { mountPoint } from "../../../services/dappnodeStatus/data";

describe("service/dappnodeStatus", () => {
  describe("getDappnodeIdentityClean", () => {
    it("Should return a clean dappnodeParams object", () => {
      const state = {
        [mountPoint]: {
          params: {
            name: "MyDAppNode",
            ip: "85.84.83.82",
            staticIp: "85.84.83.82",
            empty: null
          }
        }
      };
      expect(s.getDappnodeIdentityClean(state)).toEqual({
        name: "MyDAppNode",
        staticIp: "85.84.83.82"
      });
    });
  });
});

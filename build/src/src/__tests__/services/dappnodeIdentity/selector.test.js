import * as s from "../../../services/dappnodeParams/selectors";
import { mountPoint } from "../../../services/dappnodeParams/data";

describe("service/dappnodeParams", () => {
  describe("getDappnodeIdentityClean", () => {
    it("Should return a clean dappnodeParams object", () => {
      const state = {
        [mountPoint]: {
          name: "MyDAppNode",
          ip: "85.84.83.82",
          staticIp: "85.84.83.82",
          empty: null
        }
      };
      expect(s.getDappnodeIdentityClean(state)).toEqual({
        name: "MyDAppNode",
        staticIp: "85.84.83.82"
      });
    });
  });
});

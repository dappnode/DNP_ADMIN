import * as s from "../../../services/dappnodeStatus/selectors";
import { mountPoint } from "../../../services/dappnodeStatus/data";
import { DappnodeStatusState } from "services/dappnodeStatus/types";
import { systemInfoSample } from "schemas";
import { SystemInfo } from "types";

describe("service/dappnodeStatus", () => {
  describe("getDappnodeIdentityClean", () => {
    it("Should return a clean dappnodeParams object", () => {
      const state = {
        [mountPoint]: {
          systemInfo: {
            ...systemInfoSample,
            name: "MyDAppNode",
            ip: "85.84.83.82",
            staticIp: "85.84.83.82"
          }
        } as DappnodeStatusState
      };
      expect(s.getDappnodeIdentityClean(state)).toEqual({
        name: "MyDAppNode",
        staticIp: "85.84.83.82"
      });
    });
  });
});

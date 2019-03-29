import * as s from "../../../services/isInstallingLogs/selectors";
import { mountPoint } from "../../../services/isInstallingLogs/data";

describe("service/isInstallingLogs", () => {
  describe("getIsInstallingByDnp", () => {
    const dnpA = "dnpA";
    const dnpB = "dnpB";
    const state = {
      [mountPoint]: {
        [dnpA]: { id: "id", log: "log" }
      }
    };
    it("Should return a true for dnpA", () => {
      expect(s.getIsInstallingByDnp(state, dnpA)).toEqual(true);
    });

    it("Should return false for dnpB", () => {
      expect(s.getIsInstallingByDnp(state, dnpB)).toEqual(false);
    });
  });

  describe("getProgressLogsById", () => {
    const dnpA = "dnpA";
    const dnpB = "dnpB";
    const dnpC = "dnpC";
    const id = "ln.dnp.dappnode.eth";
    const state = {
      [mountPoint]: {
        [dnpA]: { id, log: "logA" },
        [dnpB]: { id, log: "logB" },
        [dnpC]: { id: "id2", log: "logC" }
      }
    };
    it("Should return a true for dnpA", () => {
      expect(s.getProgressLogsById(state, id)).toEqual({
        [dnpA]: "logA",
        [dnpB]: "logB"
      });
    });

    it("Should return false for dnpB", () => {
      expect(s.getProgressLogsById(state, "no-id")).toEqual({});
    });
  });
});

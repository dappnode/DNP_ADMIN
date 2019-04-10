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
    it("Should return formated logs for dnpA", () => {
      expect(s.getProgressLogsById(state, id)).toEqual({
        [dnpA]: "logA",
        [dnpB]: "logB"
      });
    });

    it("Should return empty object for dnpB", () => {
      expect(s.getProgressLogsById(state, "no-id")).toEqual({});
    });
  });

  describe("getProgressLogsById, old logId identifier", () => {
    const logId1 = "834d5e59-664b-46b9-8906-fbc5341d1acf";
    const logId2 = "123e4567-e89b-12d3-a456-426655440000";
    const dnpA = "dnpA";
    const dnpB = "dnpB";
    const dnpC = "dnpC";
    const state = {
      [mountPoint]: {
        [dnpA]: { id: logId1, log: "logA" },
        [dnpB]: { id: logId1, log: "logB" },
        [dnpC]: { id: logId2, log: "logC" }
      }
    };
    it("Should return formated logs for dnpA", () => {
      expect(s.getProgressLogsByDnp(state, dnpA)).toEqual({
        [dnpA]: "logA",
        [dnpB]: "logB"
      });
    });

    it("Should return formated logs for dnpB", () => {
      expect(s.getProgressLogsByDnp(state, dnpB)).toEqual({
        [dnpA]: "logA",
        [dnpB]: "logB"
      });
    });

    it("Should return formated logs for dnpC", () => {
      expect(s.getProgressLogsByDnp(state, dnpC)).toEqual({
        [dnpC]: "logC"
      });
    });
  });
});

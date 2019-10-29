import reducer from "../../../services/isInstallingLogs/reducer";
import * as a from "../../../services/isInstallingLogs/actions";

describe("services > isInstallingLogs > reducer", () => {
  describe("isInstallingLog dedicated reducers", () => {
    const dnpName1 = "ln.dnp.dappnode.eth";
    const dnpName2 = "bitcoin.dnp.dappnode.eth";
    const log = "Loading...";
    let state = {};
    let stateFull = {
      [dnpName1]: {
        log,
        id: dnpName1
      },
      [dnpName2]: {
        log,
        id: dnpName1
      }
    };

    it("Should add a log - updateIsInstallingLog", () => {
      const firstLog = "starting...";
      const action = a.updateIsInstallingLog({
        id: dnpName1,
        dnpName: dnpName1,
        log: firstLog
      });
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(state, action);
      expect(state).toEqual({
        [dnpName1]: {
          log: firstLog,
          id: dnpName1
        }
      });
    });

    it("Should update the log - updateIsInstallingLog", () => {
      const action = a.updateIsInstallingLog({
        id: dnpName1,
        dnpName: dnpName1,
        log
      });
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(state, action);
      expect(state).toEqual({
        [dnpName1]: {
          log,
          id: dnpName1
        }
      });
    });

    it("Should add a second log - updateIsInstallingLog", () => {
      const action = a.updateIsInstallingLog({
        id: dnpName1,
        dnpName: dnpName2,
        log
      });
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(state, action);
      expect(state).toEqual(stateFull);
    });

    it("Should reject a log for the same dnpName but different id - updateIsInstallingLog", () => {
      const action = a.updateIsInstallingLog({
        id: dnpName2,
        dnpName: dnpName2,
        log: "Oh shiit"
      });
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(state, action);
      expect(state).toEqual(stateFull);
    });

    it("Should clear one log - clearIsInstallingLog", () => {
      const action = a.clearIsInstallingLog(dnpName1);
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(stateFull, action);
      expect(state).toEqual({
        [dnpName2]: {
          log,
          id: dnpName1
        }
      });
    });

    it("Should clear both logs - clearIsInstallingLogsById", () => {
      const action = a.clearIsInstallingLogsById(dnpName1);
      // it's empty on purpose because it's just starting to fetch posts
      state = reducer(stateFull, action);
      expect(state).toEqual({});
    });
  });
});

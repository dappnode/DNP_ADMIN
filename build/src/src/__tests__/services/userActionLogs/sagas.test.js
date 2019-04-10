import { call } from "redux-saga/effects";
import api from "API/rpcMethods";
import { expectSaga } from "redux-saga-test-plan";
import { fetchUserActionLogs } from "../../../services/userActionLogs/sagas";
import reducer from "../../../services/userActionLogs/reducer";

/* eslint-disable redux-saga/no-unhandled-errors */

describe("service > userActionLogs > sagas", () => {
  describe("fetchUserActionLogs", () => {
    it("Should return parsed and ordered action logs", async () => {
      const log1 = {
        event: "installPackage.dappmanager.dnp.dappnode.eth",
        level: "error",
        timestamp: "2019-01-01T00:00:00.000Z"
      };
      const log2 = {
        event: "removePackage.dappmanager.dnp.dappnode.eth",
        level: "error",
        timestamp: "2019-01-01T01:00:00.000Z"
      };
      const fakeRes = [JSON.stringify(log1), JSON.stringify(log2)].join("\n");
      const { storeState } = await expectSaga(fetchUserActionLogs)
        .withReducer(reducer)
        .provide([[call(api.getUserActionLogs), fakeRes]])
        .run();
      // The received store in the local store of this service
      expect(storeState).toEqual([log2, log1]);
    });
  });
});

import { call } from "redux-saga/effects";
import api from "API/rpcMethods";
import { expectSaga } from "redux-saga-test-plan";
import { fetchDappnodeParams } from "../../../services/dappnodeParams/sagas";
import reducer from "../../../services/dappnodeParams/reducer";

/* eslint-disable redux-saga/no-unhandled-errors */

describe("service > dappnodeParams > sagas", () => {
  describe("fetchDappnodeIdentity", () => {
    it("Should return a clean dappnodeParams object", async () => {
      const name = "MyDappnode";
      const staticIp = "85.84.83.82";
      const fakeRes = {
        success: true,
        result: { name, staticIp, useless: "param" }
      };
      const { storeState } = await expectSaga(fetchDappnodeParams)
        .withReducer(reducer)
        .provide([
          [call(api.getParams), fakeRes] // <-- catch the call and pass in your own value
        ])
        .run();
      // With async syntax assert the final store state latter
      expect(storeState).toEqual({ name, staticIp });
    });
  });
});

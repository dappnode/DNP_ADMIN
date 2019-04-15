import { call } from "redux-saga/effects";
import api from "API/rpcMethods";
import { expectSaga } from "redux-saga-test-plan";
import { fetchDappnodeParams } from "../../../services/dappnodeStatus/sagas";
import reducer from "../../../services/dappnodeStatus/reducer";

/* eslint-disable redux-saga/no-unhandled-errors */

describe("service > dappnodeStatus > sagas", () => {
  describe("fetchDappnodeIdentity", () => {
    it("Should return a clean dappnodeParams object", async () => {
      const name = "MyDappnode";
      const staticIp = "85.84.83.82";
      const fakeRes = {
        name,
        staticIp,
        upnpAvailable: false,
        noNatLoopback: false,
        alertToOpenPorts: false,
        internalIp: "192.168.0.1"
      };
      const { storeState } = await expectSaga(fetchDappnodeParams)
        .withReducer(reducer)
        .provide([[call(api.getParams), fakeRes]])
        .run();
      // The received store in the local store of this service
      expect(storeState.params).toEqual(fakeRes);
    });
  });
});

import { call } from "redux-saga/effects";
import api from "API/rpcMethods";
import { expectSaga } from "redux-saga-test-plan";
import reducer from "../../../services/notifications/reducer";
import * as a from "../../../services/notifications/actions";
import * as s from "../../../services/notifications/selectors";

/* eslint-disable redux-saga/no-unhandled-errors */

describe("service > notifications > sagas", () => {
  describe.skip("removeDappmanagerNotifications", () => {
    it("Should call the DAPPMANAGER and dispatch an event to remove the dappmanager notificaitons", async () => {
      const initialState = {
        id1: {
          fromDappmanager: true,
          id: "id1"
        }
      };
      const ids = ["id1"];

      const { storeState } = await expectSaga(s.removeDappmanagerNotifications)
        .withReducer(reducer, initialState)
        .provide([[call(api.notificationsRemove, { ids })]])
        .put(a.removeDappmanagerNotifications())
        .run();
      // The received store in the local store of this service
      expect(storeState).toEqual(initialState);
    });
  });
});

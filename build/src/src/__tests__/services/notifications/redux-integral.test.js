import { mountPoint } from "../../../services/notifications/data";
import reducer from "../../../services/notifications/reducer";
import * as a from "../../../services/notifications/actions";
import * as s from "../../../services/notifications/selectors";

describe("services > notifications, integral redux test", () => {
  let state = {};

  const notifications = {
    id1: { id: "id1", timestamp: "0" },
    id2: { id: "id2", timestamp: "0" }
  };
  const stateFull = {
    id1: { id: "id1", timestamp: "0", viewed: false, fromDappmanager: true },
    id2: { id: "id2", timestamp: "0", viewed: false, fromDappmanager: true }
  };
  const stateViewed = {
    id1: { id: "id1", timestamp: "0", viewed: true, fromDappmanager: true },
    id2: { id: "id2", timestamp: "0", viewed: true, fromDappmanager: true }
  };
  const stateRemove = {
    id1: { id: "id1", timestamp: "0", viewed: false },
    id2: { id: "id2", timestamp: "0", viewed: false }
  };

  it("Should add notifications, and retrieve them", () => {
    state = reducer(
      state,
      a.pushNotifications({ notifications, fromDappmanager: true })
    );
    expect(s.getNotifications({ [mountPoint]: state })).toEqual(stateFull);
  });

  it("Should add two single notifications, and retrieve them", () => {
    state = reducer(
      state,
      a.pushNotification({
        notification: notifications["id1"],
        fromDappmanager: true
      })
    );
    state = reducer(
      state,
      a.pushNotification({
        notification: notifications["id2"],
        fromDappmanager: true
      })
    );
    expect(s.getNotifications({ [mountPoint]: state })).toEqual(stateFull);
  });

  it("Should mark all notifications as viewed", () => {
    state = reducer(stateFull, a.viewedNotifications());
    expect(s.getNotifications({ [mountPoint]: state })).toEqual(stateViewed);
  });

  it("Should remove the fromDappmanager notification", () => {
    state = reducer(stateFull, a.removeDappmanagerNotifications());
    expect(s.getNotifications({ [mountPoint]: state })).toEqual(stateRemove);
  });
});

import { mountPoint } from "../../../services/notifications/data";
import reducer from "../../../services/notifications/reducer";
import * as a from "../../../services/notifications/actions";
import * as s from "../../../services/notifications/selectors";

describe("services > notifications, integral redux test", () => {
  let state = {};

  const sampleNotification = {
    type: "danger",
    title: "Title",
    body: "Description",
    timestamp: "1555000000"
  };

  const notifications = {
    id1: { id: "id1", ...sampleNotification },
    id2: { id: "id2", ...sampleNotification }
  };
  const stateFull = {
    id1: { ...notifications["id1"], viewed: false, fromDappmanager: true },
    id2: { ...notifications["id2"], viewed: false, fromDappmanager: true }
  };
  const stateViewed = {
    id1: { ...notifications["id1"], viewed: true, fromDappmanager: true },
    id2: { ...notifications["id2"], viewed: true, fromDappmanager: true }
  };
  const stateRemove = {
    id1: { ...notifications["id1"], viewed: false },
    id2: { ...notifications["id2"], viewed: false }
  };

  it("Should add two single notifications, and retrieve them", () => {
    state = reducer(
      state,
      a.pushNotificationFromDappmanager(notifications["id1"])
    );
    state = reducer(
      state,
      a.pushNotificationFromDappmanager(notifications["id2"])
    );
    expect(state).toEqual(stateFull);
  });

  it("Should mark all notifications as viewed", () => {
    state = reducer(stateFull, a.viewedNotifications());
    expect(state).toEqual(stateViewed);
  });

  it("Should remove the fromDappmanager notification", () => {
    state = reducer(stateFull, a.removeDappmanagerNotifications());
    expect(state).toEqual(stateRemove);
  });

  it("Should select the full state and retrieve it as an array", () => {
    expect(s.getNotifications({ [mountPoint]: stateFull })).toEqual(
      Object.values(stateFull)
    );
  });
});

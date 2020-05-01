import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { api } from "api";
import { PackageNotification } from "common/types";
import {
  PUSH_NOTIFICATION,
  VIEWED_NOTIFICATIONS,
  PushNotification
} from "./types";
import { getNotifications } from "./selectors";

// Service > notifications

/**
 * Using a `kwargs` form to make the `fromDappmanager` argument explicit
 * [Tested]
 */
export const pushNotification = (
  notification: PackageNotification
): PushNotification => ({
  type: PUSH_NOTIFICATION,
  notification
});

export const viewedNotifications = (): ThunkAction<
  void,
  {},
  null,
  AnyAction
> => async (dispatch, getState) => {
  // Mark notifications as viewed immmediatelly
  dispatch({
    type: VIEWED_NOTIFICATIONS
  });

  // Load notifications
  const notifications = getNotifications(getState());
  // Check the ones that came from the dappmanager
  const ids = Object.values(notifications).map(notification => notification.id);
  if (ids.length) {
    // Send the ids to the dappmanager
    await api.notificationsRemove({ ids });
  }
};

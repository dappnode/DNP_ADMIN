import { api } from "api";
import { AppThunk } from "store";
import * as loadingIds from "services/loadingStatus/loadingIds";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { notificationsSlice } from "./reducer";
import { getNotifications } from "./selectors";

// Service > notifications

/**
 * Using a `kwargs` form to make the `fromDappmanager` argument explicit
 * [Tested]
 */
export const pushNotification = notificationsSlice.actions.pushNotification;

export const viewedNotifications = (): AppThunk => async (
  dispatch,
  getState
) => {
  // Mark notifications as viewed immmediatelly
  dispatch(notificationsSlice.actions.viewedNotifications());

  // Load notifications
  const notifications = getNotifications(getState());
  // Check the ones that came from the dappmanager
  const ids = Object.values(notifications).map(notification => notification.id);
  if (ids.length) {
    // Send the ids to the dappmanager
    await api.notificationsRemove({ ids });
  }
};

export const fetchNotifications = (): AppThunk => async dispatch => {
  try {
    dispatch(updateIsLoading({ id: loadingIds.notifications }));
    const notifications = await api.notificationsGet();
    dispatch(updateIsLoaded({ id: loadingIds.notifications }));
    for (const notification of notifications)
      dispatch(pushNotification(notification));
  } catch (e) {
    console.error("Error on notificationsGet", e);
  }
};

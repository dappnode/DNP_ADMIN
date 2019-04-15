import * as t from "./actionTypes";

// Service > notifications

/**
 * Using a `kwargs` form to make the `fromDappmanager` argument explicit
 * [Tested]
 */
export const pushNotification = notification => ({
  type: t.PUSH_NOTIFICATION,
  notification,
  fromDappmanager: false
});

export const pushNotificationFromDappmanager = notification => ({
  type: t.PUSH_NOTIFICATION,
  notification,
  fromDappmanager: true
});

export const viewedNotifications = () => ({
  type: t.VIEWED_NOTIFICATIONS
});

export const removeDappmanagerNotifications = () => ({
  type: t.REMOVE_DAPPMANAGER_NOTIFICATIONS
});

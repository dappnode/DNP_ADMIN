import * as t from "./actionTypes";

// Service > notifications

/**
 * Using a `kwargs` form to make the `fromDappmanager` argument explicit
 * [Tested]
 */
export const pushNotification = ({ notification, fromDappmanager }) => ({
  type: t.PUSH_NOTIFICATION,
  notification,
  fromDappmanager: fromDappmanager || false
});

export const pushNotifications = ({ notifications, fromDappmanager }) => ({
  type: t.PUSH_NOTIFICATIONS,
  notifications,
  fromDappmanager: fromDappmanager || false
});

export const viewedNotifications = () => ({
  type: t.VIEWED_NOTIFICATIONS
});

export const removeDappmanagerNotifications = () => ({
  type: t.REMOVE_DAPPMANAGER_NOTIFICATIONS
});

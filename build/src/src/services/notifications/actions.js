import * as t from "./actionTypes";

// Service > notifications

export const pushNotification = notification => ({
  type: t.PUSH_NOTIFICATION,
  notification
});

export const pushNotificationFromDappmanager = notification => ({
  type: t.PUSH_NOTIFICATION,
  notification: { ...notification, fromDappmanager: true }
});

export const viewedNotifications = () => ({
  type: t.VIEWED_NOTIFICATIONS
});

export const removeDappmanagerNotifications = () => ({
  type: t.REMOVE_DAPPMANAGER_NOTIFICATIONS
});

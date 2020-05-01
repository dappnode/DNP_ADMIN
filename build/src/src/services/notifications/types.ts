import { PackageNotificationDb, PackageNotification } from "types";

// Service > notifications

export interface NotificationsState {
  [notificationId: string]: PackageNotificationDb;
}

export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const VIEWED_NOTIFICATIONS = "VIEWED_NOTIFICATIONS";
export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";

export interface PushNotification {
  type: typeof PUSH_NOTIFICATION;
  notification: PackageNotification | PackageNotificationDb;
}

export interface ViewedNotifications {
  type: typeof VIEWED_NOTIFICATIONS;
}

export type AllReducerActions = PushNotification | ViewedNotifications;

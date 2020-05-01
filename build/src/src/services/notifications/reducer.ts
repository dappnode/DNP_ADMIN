import { mapValues } from "lodash";
import {
  NotificationsState,
  AllReducerActions,
  PUSH_NOTIFICATION,
  VIEWED_NOTIFICATIONS
} from "./types";

// Service > notifications

export default function(
  state: NotificationsState = {},
  action: AllReducerActions
): NotificationsState {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      const newNotificationValues = {
        id: String(Math.random()).slice(2),
        timestamp: Date.now(),
        viewed: false
      };
      return {
        ...state,
        [action.notification.id]: {
          ...newNotificationValues,
          ...action.notification
        }
      };

    case VIEWED_NOTIFICATIONS:
      return mapValues(state, notification => ({
        ...notification,
        viewed: true
      }));

    default:
      return state;
  }
}

import * as t from "./actionTypes";

// Service > notifications

export default function(state = [], action) {
  switch (action.type) {
    case t.PUSH_NOTIFICATION:
      // Assign states to the incoming notification
      // viewed, controls the display of the color circle
      // timestamp, use for orderring
      // id, prevent duplicate notifications
      action.notification = {
        ...action.notification,
        viewed: false,
        timestamp: Date.now(),
        id: action.notification.id || String(Math.random()).slice(2)
      };
      return [
        action.notification,
        // Clean other notifications with the same id
        ...state.filter(n => n.id !== action.notification.id)
      ];

    case t.VIEWED_NOTIFICATIONS:
      return state.map(notification => ({
        ...notification,
        viewed: true
      }));

    case t.REMOVE_DAPPMANAGER_NOTIFICATIONS:
      return state.map(notification => {
        // Remove the fromDappmanager property immutably
        const { fromDappmanager, ..._notification } = notification;
        return _notification;
      });

    default:
      return state;
  }
}

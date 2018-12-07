// NAVBAR
import * as t from "./actionTypes";

const initialState = {
  dappnodeIdentity: {},
  notifications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_DAPPNODE_IDENTITY:
      return {
        ...state,
        dappnodeIdentity: action.dappnodeIdentity
      };
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
      return {
        ...state,
        notifications: [
          action.notification,
          // Clean other notifications with the same id
          ...state.notifications.filter(n => n.id !== action.notification.id)
        ]
      };
    case t.VIEWED_NOTIFICATIONS:
      const notifications = state.notifications.map(notification => {
        notification.viewed = true;
        return notification;
      });
      return {
        ...state,
        notifications
      };
    default:
      return state;
  }
}

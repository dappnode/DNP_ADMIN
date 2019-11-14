import * as t from "./actionTypes";
import _ from "lodash";

// Service > notifications

/**
 * @param state = {
 *   "diskSpaceRanOut-stoppedPackages": {
 *     id: "diskSpaceRanOut-stoppedPackages",
 *     type: "danger",
 *     title: "Disk space ran out, stopped packages",
 *     body: "Available disk space is less than a safe ...",
 *       (added props)
 *     timestamp: 153834824,
 *     viewed: false,
 *     fromDappmanager: true
 *   }, ... }
 * [Tested]
 */

export default function(state = {}, action) {
  switch (action.type) {
    case t.PUSH_NOTIFICATION:
      return {
        ...state,
        [action.notification.id]: formatNotification(
          action.notification,
          action.fromDappmanager
        )
      };

    case t.VIEWED_NOTIFICATIONS:
      return _.mapValues(state, notification => ({
        ...notification,
        viewed: true
      }));

    case t.REMOVE_DAPPMANAGER_NOTIFICATIONS:
      return _.mapValues(state, notification => {
        // Remove `fromDappmanager` property immutably
        const { fromDappmanager, ..._notification } = notification;
        return _notification;
      });

    default:
      return state;
  }
}

// Utility

/**
 * Assign states to the incoming notification
 * - `viewed`: controls the display of the color circle
 * - `timestamp`: use for ordering
 * - `id`: prevent duplicate notifications
 * @param {object} notification
 * @returns {object}
 */
function formatNotification(notification, fromDappmanager) {
  return {
    timestamp: Date.now(),
    id: String(Math.random()).slice(2),
    ...notification,
    viewed: false,
    ...(fromDappmanager ? { fromDappmanager: true } : {})
  };
}

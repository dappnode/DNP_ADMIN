import * as t from "./actionTypes";

// Service > userActionLogs

/**
 * @param state = [{
 *   event: "installPackage.dappmanager.dnp.dappnode.eth",
 *   kwargs: {
 *     id: "rinkeby.dnp.dappnode.eth",
 *     userSetVols: {},
 *     userSetPorts: {},
 *     options: {}
 *   },
 *   level: "error",
 *   message: "Timeout to cancel expired",
 *   name: "Error",
 *   stack: "Error: Timeout to cancel expired↵  ...",
 *   timestamp: "2019-02-01T19:09:16.503Z"
 *   // Add in the front-end
 *   count: 3
 * }, ... ]
 * [Tested]
 */

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_USER_ACTION_LOGS:
      return action.userActionLogs;

    case t.PUSH_USER_ACTION_LOG:
      return [action.userActionLog, ...state];

    default:
      return state;
  }
}

import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import Joi from "joi";
import * as schemas from "schemas";

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

const userActionLogExtended = schemas.userActionLog.keys({
  count: Joi.number()
});

export default function(state = [], action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_USER_ACTION_LOGS:
      assertActionSchema({
        userActionLogs: Joi.array()
          .items(userActionLogExtended)
          .required()
      });
      return action.userActionLogs;

    case t.PUSH_USER_ACTION_LOG:
      assertActionSchema({
        userActionLog: userActionLogExtended.required()
      });
      return [action.userActionLog, ...state];

    default:
      return state;
  }
}

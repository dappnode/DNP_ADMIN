import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import _ from "lodash";

// Service > isInstallingLogs

/**
 * @param state = isInstallingLogs = {
 *   dnpName: {
 *     log: "Downloading 64%",
 *     id: "requestedDnpName.dnp.dappnode.eth"
 *   },
 *   dependencyName: {
 *     log: "Loading...",
 *     id: "requestedDnpName.dnp.dappnode.eth"
 *   },
 * }
 * [Tested]
 */
export default function(state = {}, action) {
  switch (action.type) {
    case t.UPDATE_IS_INSTALLING_LOG:
      assertAction(action, { dnpName: "dep", log: "Loading...", id: "dnp" });
      const prevId = (state[action.dnpName] || {}).id;
      // If there is a double installation, prevent the install log to update
      // Otherwise there could be confusing messages on the UI, which will display both
      if (prevId && action.id !== prevId) {
        console.warn(
          `Double install of ${action.dnpName}, from ${prevId} and ${action.id}`
        );
        return state;
      }
      return {
        ...state,
        [action.dnpName]: {
          log: action.log,
          id: action.id
        }
      };

    case t.CLEAR_IS_INSTALLING_LOGS_OF_ID:
      assertAction(action, { id: "dnp" });
      return _.pickBy(state, value => value.id !== action.id);

    case t.CLEAR_IS_INSTALLING_LOG:
      assertAction(action, { dnpName: "dnp" });
      return _.pickBy(state, (_, key) => key !== action.dnpName);

    case t.CLEAR_ALL_IS_INSTALLING_LOGS:
      return {};

    default:
      return state;
  }
}

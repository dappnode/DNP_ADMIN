import * as t from "./actionTypes";
import merge from "deepmerge";
import check from "check-types";
import { assertAction } from "utils/redux";

// Service > dappnodeStatus

const initialState = {
  params: {},
  stats: {},
  diagnose: {},
  pingReturns: {},
  ipfsConnectionStatus: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_DAPPNODE_PARAMS:
      assertAction(action, { params: {} });
      // Replaces all params on each update
      return {
        ...state,
        params: action.params
      };

    case t.UPDATE_DAPPNODE_STATS:
      assertAction(action, { stats: {} });
      return merge(state, {
        stats: action.stats
      });

    case t.UPDATE_DAPPNODE_DIAGNOSE:
      assertAction(action, { diagnose: {} });
      return merge(state, {
        diagnose: action.diagnose
      });

    case t.UPDATE_PING_RETURN:
      // pingReturn can be an Object, String or null
      assertAction(action, { dnp: "dnpName" });
      return {
        ...state,
        pingReturns: {
          ...state.pingReturns,
          [action.dnp]: action.pingReturn
        }
      };

    case t.UPDATE_IPFS_CONNECTION_STATUS:
      assertAction(action, { ipfsConnectionStatus: {} });
      return {
        ...state,
        ipfsConnectionStatus: action.ipfsConnectionStatus
      };

    default:
      return state;
  }
}

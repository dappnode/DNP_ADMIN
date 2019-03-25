import * as t from "./actionTypes";
import merge from "deepmerge";
import check from "check-types";

// Service > dappnodeParams

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
      check.assert.object(action.params);
      // Replace all params on each update
      return {
        ...state,
        params: action.params
      };

    case t.UPDATE_DAPPNODE_STATS:
      check.assert.object(action.stats);
      return merge(state, {
        stats: action.stats
      });

    case t.UPDATE_DAPPNODE_DIAGNOSE:
      check.assert.object(action.diagnose);
      return merge(state, {
        diagnose: action.diagnose
      });

    case t.UPDATE_PING_RETURN:
      return {
        ...state,
        pingReturns: {
          ...state.pingReturns,
          [action.dnp]: action.pingReturn
        }
      };

    case t.UPDATE_IPFS_CONNECTION_STATUS:
      check.assert.object(action.ipfsConnectionStatus);
      check.assert.like(action.ipfsConnectionStatus, { resolves: true });
      return {
        ...state,
        ipfsConnectionStatus: action.ipfsConnectionStatus
      };

    default:
      return state;
  }
}

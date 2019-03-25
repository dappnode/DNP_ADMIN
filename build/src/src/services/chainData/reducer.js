import * as t from "./actionTypes";

// Service > chainData

export default function(state = [], action) {
  switch (action.type) {
    case t.UPDATE_CHAIN_DATA:
      // Format chain data before commiting to the store
      action.chainData.forEach(chain => {
        // Rename chain name
        if (stringIncludes(chain.name, "ethchain")) {
          chain.name = "Mainnet";
        }
        // Rename errors
        if (stringIncludes(chain.message, "ECONNREFUSED")) {
          chain.message = `DNP stopped or unreachable (connection refused)`;
        }
        if (stringIncludes(chain.message, "Invalid JSON RPC response")) {
          chain.message = `DNP stopped or unreachable (invalid response)`;
        }
        if (stringIncludes(chain.message, "synced #0")) {
          chain.message = `Syncing...`;
          chain.syncing = true;
        }
      });
      return action.chainData;
    default:
      return state;
  }
}

// Utility

function stringIncludes(s1, s2) {
  if (!s1 || !s2) return false;
  return s1.toLowerCase().includes(s2.toLowerCase());
}

import { stringIncludes } from "utils/strings";
import { ChainData } from "types";

/**
 * Rewords expected chain syncing errors
 * @param chain
 */
export default function parseChainDataMessages(chain: ChainData): ChainData {
  let { name, message, syncing } = chain;
  // Rename chain name
  if (stringIncludes(name, "ethchain")) {
    name = "Mainnet";
  }
  // Rename known errors
  if (stringIncludes(message, "ECONNREFUSED")) {
    message = `DAppNode Package stopped or unreachable (connection refused)`;
  }
  if (stringIncludes(message, "Invalid JSON RPC response")) {
    message = `DAppNode Package stopped or unreachable (invalid response)`;
  }
  if (stringIncludes(message, "synced #0")) {
    message = `Syncing...`;
    syncing = true;
  }
  return {
    ...chain,
    name,
    message,
    syncing
  };
}

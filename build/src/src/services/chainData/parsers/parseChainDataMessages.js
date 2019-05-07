import { stringIncludes } from "utils/strings";
import { cleanObj } from "utils/objects";

export default function parseChainDataMessages(chain) {
  let { name, message, syncing } = chain;
  // Rename chain name
  if (stringIncludes(name, "ethchain")) {
    name = "Mainnet";
  }
  // Rename known errors
  if (stringIncludes(message, "ECONNREFUSED")) {
    message = `DNP stopped or unreachable (connection refused)`;
  }
  if (stringIncludes(message, "Invalid JSON RPC response")) {
    message = `DNP stopped or unreachable (invalid response)`;
  }
  if (stringIncludes(message, "synced #0")) {
    message = `Syncing...`;
    syncing = true;
  }
  return cleanObj({ ...chain, name, message, syncing });
}

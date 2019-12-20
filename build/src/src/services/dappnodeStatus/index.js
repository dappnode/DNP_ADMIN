import * as actionTypes from "./types";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

/**
 * Service > dappnodeStatus
 *
 * Requests various data from the DAPPMANAGER.
 * Also performs checks to different DAppNode moving pieces:
 * - params: DAppNode's name, ip, domain, isUpnpAvailable, etc
 * - stats: Cpu, memory and disk usage,
 * - diagnose: docker, docker-compose versions, etc.
 * - pingReturns: Are the DAPPMANAGER and VPN alive? + version data
 * - ipfsConnectionStatus: is the IPFS DNP able to cat data?
 *
 * [Partially-Tested]
 */

export default {
  mountPoint,
  actionTypes,
  actions,
  selectors,
  reducer,
  saga
};

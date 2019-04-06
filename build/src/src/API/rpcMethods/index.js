import uuidv4 from "uuid/v4";
import { getSession } from "../start";
import Toast from "components/toast/Toast";
// Modules
import dappmanager from "./dappmanager";
import vpn from "./vpn";

const dnps = {
  dappmanager,
  vpn
};

// Converts a RPC description
//   installPackage: {
//     manadatoryKwargs: ["id"]
//   },
//
// Into a the following wrapped call
//   export const installPackage = (kwargs = {}) =>
//     wrapCall({
//       event: "installPackage.dappmanager.dnp.dappnode.eth",
//       kwargs: assertKwargs(kwargs, ["id"])
//     });
const rpcMethods = {};
Object.keys(dnps).forEach(dnpId => {
  Object.keys(dnps[dnpId]).forEach(eventId => {
    const rpcCall = dnps[dnpId][eventId];
    // Returns a function
    const call = function rpcMethod(kwargs = {}, options) {
      return wrapCall({
        event: `${eventId}.${dnpId}.dnp.dappnode.eth`,
        kwargs: assertKwargs(kwargs, rpcCall.manadatoryKwargs),
        options
      });
    };
    // Export calls as: api.installPackage, api.dappmanager.installPackage
    rpcMethods[eventId] = call;
    if (!rpcMethods[dnpId]) rpcMethods[dnpId] = {};
    rpcMethods[dnpId][eventId] = call;
  });
});

/* Utils */

function assertKwargs(kwargs = {}, keys = []) {
  if (typeof kwargs !== "object")
    throw Error(
      `kwargs must be of type object, kwargs: ${JSON.stringify(kwargs)}`
    );
  if (!Array.isArray(keys))
    throw Error(`keys must be an array, keys: ${JSON.stringify(keys)}`);
  for (const key of keys) {
    if (!(key in kwargs))
      throw Error("Key " + key + " missing on " + JSON.stringify(kwargs));
  }
  return kwargs;
}

/**
 * Wrapper for WAMP RPC calls
 *
 * @param {Object}
 * - event: logPackage.dappmanager.dnp.dappnode.eth
 * - args: Array of arguments
 * - kwargs: Object of arguments
 * - options:
 *   - toastMessage: {String} Triggers a pending toast
 *   - toastOnError: {Bool} Triggers a toast on error only
 */
async function wrapCall({ event, args = [], kwargs = {}, options = {} }) {
  // Toast visualization options

  const pendingToast = options.toastMessage
    ? new Toast({
        message: options.toastMessage,
        pending: true
      })
    : null;

  try {
    // Generate a taskid
    if (!kwargs.logId) kwargs.logId = uuidv4();
    // Get session
    const session = getSession();
    // If session is not available, fail gently
    if (!session) throw Error("Session object is not defined");
    if (!session.isOpen) throw Error("Connection is not open");

    const res = await session
      .call(event, args, kwargs)
      .then(JSON.parse)
      .catch(e => {
        // crossbar return errors in a specific format
        throw Error(e.message || (e.args && e.args[0] ? e.args[0] : e.error));
      });

    // Return the result
    if (res.success) {
      if (options.toastMessage) {
        pendingToast.resolve(res);
      }
      return res.result;
    } else {
      throw Error(res.message);
    }
  } catch (e) {
    // Intercept errors to resolve or create toasts
    // Re-throw the error afterwards
    if (options.toastOnError) {
      new Toast({ success: false, message: e.message });
    } else if (options.toastMessage) {
      pendingToast.resolve({ success: false, message: e.message });
    }
    if ((options.toastOnError || options.toastMessage) && !options.throw) {
      console.error(`Error on ${event}: ${e.stack}`);
    } else {
      throw e;
    }
  }
}

export default rpcMethods;

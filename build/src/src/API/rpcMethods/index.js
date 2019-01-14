import uuidv4 from "uuid/v4";
import store from "../../store";
// Modules
import dappmanager from "./dappmanager";
import vpn from "./vpn";

const dnps = {
    dappmanager,
    vpn
}

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
const exportModules = {}
Object.keys(dnps).forEach(dnpId => {
    Object.keys(dnps[dnpId]).forEach(eventId => {
        const rpcCall = dnps[dnpId][eventId]
        exportModules[eventId] = (kwargs = {}) => wrapCall({
          event: `${eventId}.${dnpId}.dnp.dappnode.eth`,
          kwargs: assertKwargs(kwargs, rpcCall.manadatoryKwargs)
        });
    })
})

/* Utils */

function assertKwargs(kwargs, keys = []) {
  keys.forEach(key => {
    if (!(key in kwargs))
      throw Error("Key " + key + " missing on " + JSON.stringify(kwargs));
  });
  return kwargs;
}

async function wrapCall({ event, args = [], kwargs = {} }) {
  try {
    // Generate a taskid
    if (!kwargs.logId) kwargs.logId = uuidv4();
    // Get session
    const session = store.getState().session;
    // If session is not available, fail gently
    if (!(session && session.isOpen)) {
      throw Error("Connection is not open");
    }
    const res = await session.call(event, args, kwargs).catch(e => {
      // crossbar return errors in a specific format
      throw Error(e.message || (e.args && e.args[0] ? e.args[0] : e.error));
    });
    // Return the result
    return JSON.parse(res);
  } catch (e) {
    return {
      success: false,
      message: e.message,
      e
    };
  }
}

export default exportModules
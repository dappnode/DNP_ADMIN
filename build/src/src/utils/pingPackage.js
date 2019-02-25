/**
 * Pings a package to verify it is currently connected to the current WAMP network
 * - On success returns the resulting object (version data)
 * - On success but parsing error returns true
 * - On error returns false
 *
 * @param {Object} session, session object of crossbar's autobahn
 * @param {String} packageName = 'dappmanager', shortName of a DNP package
 * @returns {Bool | Object} connected, returns true if the ping call was successful and false otherwise
 */
export default function pingPackage(session, packageName) {
  const call = "ping." + packageName + ".dnp.dappnode.eth";
  return session.call(call, ["ping from DNP_ADMIN"]).then(
    unparsedRes => {
      try {
        const res = JSON.parse(unparsedRes);
        if (!res.success) throw Error(`Ping RPC error: ${res.message}`);
        else return res.result;
      } catch (e) {
        console.error(`Error parse ping response: ${e.stack}`);
        return true;
      }
    },
    err => {
      if (!err.error || !err.error.includes("no_such_procedure")) {
        console.error(
          `Unkown error while pinging ${packageName}: ${err.error ||
            err.message ||
            JSON.stringify(err)}`
        );
      }
      return false;
    }
  );
}

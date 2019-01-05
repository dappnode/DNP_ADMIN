/**
 * Pings a package to verify it is currently connected to the current WAMP network
 *
 * @param {Object} session, session object of crossbar's autobahn
 * @param {String} packageName = 'dappmanager', shortName of a DNP package
 * @returns {Bool} connected, returns true if the ping call was successful and false otherwise
 */
export default function pingPackage(session, packageName) {
  const call = "ping." + packageName + ".dnp.dappnode.eth";
  return session.call(call, ["ping from DNP_ADMIN"]).then(
    () => true,
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

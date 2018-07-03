import { getSessionSync } from "./crossbarCalls";

const NON_ADMIN_RESPONSE = "You are not an admin";

// Example usage:
// setInterval(() => {
//   checkConnection().then(console.log);
// }, 1000);

const checkConnection = () =>
  new Promise((resolve, reject) => {
    let session = getSessionSync();
    if (!session) return reject("Warning, verifying...");
    if (!session.isOpen) {
      let reason = session.reason ? ", reason: " + session.reason : "";
      let message = session.message ? ", details: " + session.message : "";
      if (message.includes("could not authenticate session"))
        message = ", details: " + NON_ADMIN_RESPONSE;
      return reject("Connection closed" + reason + message);
    }
    try {
      let pingTimeout = setTimeout(() => {
        return reject("Warning: connection may be lost");
      }, 1000);
      session.call("ping.vpn.dnp.dappnode.eth", ["hi"]).then(res => {
        clearTimeout(pingTimeout);
        return resolve(session);
      });
    } catch (e) {
      return reject("Ping error: " + e.message);
    }
  });

export default checkConnection;

import { getSessionSync } from "./crossbarCalls";

// Example usage:
// setInterval(() => {
//   checkConnection().then(console.log);
// }, 1000);

const checkConnection = () =>
  new Promise((resolve, reject) => {
    let session = getSessionSync();
    if (!session) return reject("Warning, verifying...");
    if (!session.isOpen) {
      let reason = session.errorReason
        ? ", reason: " + session.errorReason
        : "";
      let message = session.errorDetails
        ? ", details: " + String(session.errorDetails)
        : "";
      if (message.includes("could not authenticate session"))
        message = "You are not an admin";
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

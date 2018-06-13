import * as AppActions from "actions/AppActions";
import ipfsAPI from "ipfs-api";

const IPFS = "my.ipfs.dnp.dappnode.eth";
const ipfs = ipfsAPI(IPFS, "5001", { protocol: "http" });
const INTERVAL_S = 5; // s

// Initialize
// connected just requests the ID of the connection
AppActions.updateStatus({
  pkg: "ipfs",
  item: "connected",
  on: 0,
  msg: "verifying..."
});
// working tries to cat the readme file and expect it to contain 'Hello and Welcome to IPFS!'
AppActions.updateStatus({
  pkg: "ipfs",
  item: "working",
  on: 0,
  msg: "verifying..."
});

// Initial call
check();

// Keep checking every
setInterval(() => {
  check();
}, INTERVAL_S * 1000);

async function check() {
  try {
    let connectionError = await isIPFSconnected();
    AppActions.updateStatus({
      pkg: "ipfs",
      item: "connected",
      on: connectionError ? -1 : 1,
      msg: connectionError ? JSON.stringify(connectionError.message) : "ok"
    });
  } catch (e) {
    AppActions.updateStatus({
      pkg: "ipfs",
      item: "connected",
      on: -1,
      msg: JSON.stringify(e.message)
    });
  }

  try {
    let workingError = await isIPFSworking();
    AppActions.updateStatus({
      pkg: "ipfs",
      item: "working",
      on: workingError ? -1 : 1,
      msg: workingError ? JSON.stringify(workingError.message) : "ok"
    });
  } catch (e) {
    AppActions.updateStatus({
      pkg: "ipfs",
      item: "working",
      on: -1,
      msg: JSON.stringify(e.message)
    });
  }
}

function isIPFSconnected() {
  return new Promise(resolve => {
    ipfs.id(function(err, identity) {
      resolve(err);
    });
  });
}

function isIPFSworking() {
  return new Promise(resolve => {
    const ipfsReadmePath =
      "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
    ipfs.files.cat(ipfsReadmePath, function(err, file) {
      if (err) return resolve(err);
      if (!file.toString("utf8").includes("Hello and Welcome to IPFS!"))
        return resolve("Error parsing file");
      else return resolve(null);
    });
  });
}

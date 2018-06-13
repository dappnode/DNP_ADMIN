import * as AppActions from "actions/AppActions";
import IPFS from "ipfs-mini";

const ipfs = new IPFS({
  host: "my.ipfs.dnp.dappnode.eth",
  port: 5001,
  protocol: "http"
});

const INTERVAL_S = 5; // s

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

function isIPFSworking() {
  return new Promise(resolve => {
    ipfs.cat("QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", function(
      err,
      file
    ) {
      if (err) return resolve(err);
      if (!file.includes("Hello and Welcome to IPFS!"))
        return resolve(Error("Error parsing file"));
      else return resolve(null);
    });
  });
}

import IPFS from "ipfs-mini";

// This construction prevents ipfs from auto initialize when imported
// If this happens tests can fail and trigger nasty effects
const ipfsSingleton = (function() {
  let ipfs;
  function get() {
    if (ipfs) return ipfs;
    else
      return new IPFS({
        host: "my.ipfs.dnp.dappnode.eth",
        port: 5001,
        protocol: "http"
      });
  }
  return {
    get
  };
})();

export default function checkIpfsConnection() {
  // Attempts to cat the readme file and expect it to contain 'Hello and Welcome to IPFS!'
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject("Timeout expired, ipfs may be down");
    }, 10000);

    const ipfs = ipfsSingleton.get();
    ipfs.cat("QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", function(
      err,
      file
    ) {
      clearTimeout(timer);
      if (err) return reject(formatIpfsError(err));
      if (file.includes("Hello and Welcome to IPFS!")) return resolve();
      else return reject("Error parsing file");
    });
  });
}

function formatIpfsError(err) {
  let errParsed = err ? (err.message ? err.message : err) : "Unknown error";
  errParsed = JSON.stringify(errParsed);
  if (errParsed.includes("[ipfs-mini] status 0:"))
    errParsed = "Can't connect to IPFS module";
  return errParsed;
}

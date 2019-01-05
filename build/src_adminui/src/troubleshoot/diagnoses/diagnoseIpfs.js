import IPFS from "ipfs-mini";
import retryable from "utils/retryable";

// This construction prevents ipfs from auto initialize when imported
// If this happens tests can fail and trigger nasty effects
const ipfsConfig = {
  host: "my.ipfs.dnp.dappnode.eth",
  port: 5001,
  protocol: "http"
};

// Attempts to cat the readme file and expect it to contain 'Hello and Welcome to IPFS!'
const checkIpfsConnection = () =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Timeout expired")), 3 * 1000);
    const ipfs = new IPFS(ipfsConfig);
    ipfs.cat("QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", (err, file) => {
      clearTimeout(timer);
      if (err) return reject(Error(formatIpfsError(err)));
      if (file.includes("Hello and Welcome to IPFS!")) return resolve();
      else return reject(Error("Error parsing file"));
    });
  });

// Utils:

function formatIpfsError(err) {
  let errParsed = err ? (err.message ? err.message : err) : "Unknown error";
  // Convert the error to string: object -> string, string -> string
  errParsed = JSON.stringify(errParsed);
  // Rename known error
  if (errParsed.includes("[ipfs-mini] status 0:"))
    errParsed = "Can't connect to IPFS module";
  return errParsed;
}

export default () => {
  return retryable(checkIpfsConnection)()
    .then(() => ({ ok: true }))
    .catch(e => ({ ok: false, msg: e.message }));
};

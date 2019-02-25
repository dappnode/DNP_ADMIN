import retryable from "utils/retryable";

// This construction prevents ipfs from auto initialize when imported
// If this happens tests can fail and trigger nasty effects
const host = "my.ipfs.dnp.dappnode.eth";
const port = 5001;
const protocol = "http";
const hash = "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB";
const expectedString = "Hello and Welcome to IPFS!";
const url = `${protocol}://${host}:${port}/api/v0/cat?arg=${hash}`;

// Attempts to cat the readme file and expect it to contain 'Hello and Welcome to IPFS!'
const checkIpfsConnection = async () => {
  try {
    const file = await fetchWithTimeout(url).then(res => res.text());
    if (!file.includes(expectedString)) throw Error("Error parsing file");
  } catch (e) {
    e.message = `Error verifying IPFS: ${e.message}`;
    throw e;
  }
};

// Utils:

function fetchWithTimeout(url, options, timeout = 3000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    )
  ]);
}

export default () => {
  return retryable(checkIpfsConnection)()
    .then(() => ({ ok: true }))
    .catch(e => ({ ok: false, msg: e.message }));
};

/**
 * Filters directory by:
 * 1. Search bar. If search bar is empty, return all
 * 2. Selected types: If no types selected, return all
 *
 * @param {Array} directory = [{
 *   name: "bitcoin.dnp.dappnode.eth",
 *   version: "0.1.0",
 *   manifest: <manifestObj>,
 *   whitelisted: true
 * }, ... ]
 * @param {String} query = "bitco"
 * @param {Object} selectedTypes = { library: false, service: true }
 * @return {Array} some elements of directory
 * [Tested]
 */
export default function filterDirectory({ directory, query, selectedTypes }) {
  const areThereTypes = Object.values(selectedTypes).reduce(
    (acc, val) => acc || val,
    false
  );
  return directory
    .filter(dnp => !query || includesSafe(dnp.manifest, query))
    .filter(
      dnp =>
        !areThereTypes ||
        ((dnp.manifest || {}).type && selectedTypes[dnp.manifest.type])
    );
}

/**
 * Tests inclusion of a string in an object.
 * In case of error, returns true
 *
 * @param {Object} sourceObj = { hello: "world" }
 * @param {String} target = "hell"
 * @return {Boolean} = true
 * [Tested]
 */
function includesSafe(sourceObj, target) {
  try {
    return JSON.stringify(sourceObj).includes(target);
  } catch (e) {
    console.error(`Error on includesSafe: ${e.stack}`);
    return true;
  }
}

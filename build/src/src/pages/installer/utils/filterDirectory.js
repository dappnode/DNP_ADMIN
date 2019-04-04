/**
 * Filters directory by:
 * 1. Search bar. If search bar is empty, return all
 * 2. Selected types: If no types selected, return all
 * @returns {Array}
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

function includesSafe(source, target) {
  try {
    return JSON.stringify(source).includes(target);
  } catch (e) {
    console.error(`Error on includesSafe: ${e.stack}`);
    return true;
  }
}

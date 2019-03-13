import semver from "semver";

/**
 * Compute the release type: major, minor, patch
 * @param {String} from 0.1.21
 * @param {String} to 0.2.0
 * @return {String} release type: major, minor, patch
 */
function computeSemverUpdateType(from, to) {
  if (!semver.valid(from) || !semver.valid(to)) return;

  // Make sure there are no downgrades
  if (semver.lt(to, from)) return "downgrade";

  // Remove wierd stuff: 10000000000000000.4.7.4 becomes 4.7.4
  // If not valid, abort
  from = semver.valid(semver.coerce(from));
  to = semver.valid(semver.coerce(to));
  // Semver considers 0.1.21 -> 0.2.0 a minor update
  if (from.startsWith("0.0.") && to.startsWith("0.0.")) {
    from = from.split("0.0.")[1] + ".0.0";
    to = to.split("0.0.")[1] + ".0.0";
  }
  if (from.startsWith("0.") && to.startsWith("0.")) {
    from = from.split("0.")[1] + ".0";
    to = to.split("0.")[1] + ".0";
  }

  for (const type of ["major", "minor", "patch"]) {
    if (semver[type](from) !== semver[type](to)) return type;
  }
}

export default computeSemverUpdateType;

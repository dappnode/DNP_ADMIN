import semver from "semver";

export default function getTag(v_now, v_avail) {
  // If there is no current version, display install
  if (!v_now) return "Install";
  // Prevent the function from crashing
  if (!semver.valid(v_now)) return "Install (unk v_now=" + v_now + ")";
  if (!semver.valid(v_avail)) return "Install (unk v_avail=" + v_avail + ")";
  // Compare versions and return appropiate tag
  if (semver.lt(v_now, v_avail)) return "Update";
  else return "Installed";
}

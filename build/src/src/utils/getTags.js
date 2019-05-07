import semver from "semver";
import { toLowercase } from "utils/strings";

export default function getTags(pkg) {
  let tag = pkg.manifest
    ? getInstallTag(pkg.currentVersion, pkg.manifest.version)
    : "loading";

  let tagStyle = "";
  if (toLowercase(tag) === "install") tagStyle = "active";
  if (toLowercase(tag) === "update") tagStyle = "active";
  if (toLowercase(tag) === "installed") tagStyle = "unactive";

  return {
    tag,
    tagStyle
  };
}

function getInstallTag(v_now, v_avail) {
  // If there is no current version, display install
  if (!v_now) return "Install";
  // Prevent the function from crashing
  if (!semver.valid(v_now)) return "Install (unk v_now=" + v_now + ")";
  if (!semver.valid(v_avail)) return "Install (unk v_avail=" + v_avail + ")";
  // Compare versions and return appropiate tag
  if (semver.lt(v_now, v_avail)) return "Update";
  else return "Installed";
}

import getTags from "utils/getTags";

export default function enhancePkg(pkg) {
  if (!pkg) return pkg;
  if (!pkg.manifest)
    return Object.assign(
      {
        tag: "",
        tagStyle: "unactive"
      },
      pkg
    );
  let { tag, tagStyle } = getTags(pkg);

  let description = pkg.manifest
    ? pkg.manifest.description || "Awesome dnp"
    : "?";

  let type = pkg.manifest ? pkg.manifest.type || "library" : "?";

  let name = pkg.name || "?";
  let id = name;
  let namePretty = capitalize(name.split(".dnp.dappnode.eth")[0]);

  // If package broke, re-assign variables
  if (pkg.error) {
    type = "";
    description = pkg.error;
    tag = "ERROR";
    tagStyle = "unactive";
  }

  return Object.assign(
    { tag, tagStyle, description, type, namePretty, id },
    pkg
  );
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

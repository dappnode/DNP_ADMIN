import getTags from "utils/getTags";

export default function enhancePkg(pkg) {
  if (!pkg) return pkg;

  let manifest = pkg.manifest;
  let id = pkg.id || pkg.name || "?";

  return Object.assign(
    // In case of error, replace values (first priority)
    pkg.error
      ? {
          type: "",
          description: pkg.error,
          tag: "ERROR",
          tagStyle: "unactive"
        }
      : {},
    // If manifest exists, curate values
    manifest
      ? {
          description: manifest.description || "Awesome dnp",
          type: manifest.type || "library",
          ...getTags(pkg) // return { tag, tagStyle }
        }
      : {
          description: "?",
          type: "?",
          tag: ""
        },
    // Values used by any package state
    {
      namePretty: capitalize(id.split(".dnp.dappnode.eth")[0]),
      id
    },
    pkg
  );
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

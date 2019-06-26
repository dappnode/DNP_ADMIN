export function shortName(ens) {
  if (!ens || typeof ens !== "string") return ens;
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

export function shortNameCapitalized(name) {
  if (!name || typeof name !== "string") return name;
  const _name = shortName(name);
  return _name.charAt(0).toUpperCase() + _name.slice(1);
}

export function shortAuthor(author) {
  if (!author || typeof author !== "string") return author;
  return (author.split("(")[0] || "").split("<")[0] || "";
}

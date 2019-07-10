import { capitalize } from "utils/strings";

export function shortName(ens) {
  if (!ens || typeof ens !== "string") return ens;
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

/**
 * Pretifies a ENS name
 * "bitcoin.dnp.dappnode.eth" => "Bitcoin"
 * "raiden-testnet.dnp.dappnode.eth" => "Raiden Testnet"
 *
 * @param {string} name ENS name
 * @returns {string} pretty name
 */
export function shortNameCapitalized(name) {
  if (!name || typeof name !== "string") return name;
  let _name = shortName(name)
    // Convert all "-" and "_" to spaces
    .replace(new RegExp("-", "g"), " ")
    .replace(new RegExp("_", "g"), " ")
    .split(" ")
    .map(capitalize)
    .join(" ");

  return _name.charAt(0).toUpperCase() + _name.slice(1);
}

export function shortAuthor(author) {
  if (!author || typeof author !== "string") return author;
  return (author.split("(")[0] || "").split("<")[0] || "";
}

/**
 *
 * @param {string} name "bitcoin.dnp.dappnode.eth"
 * @returns {bool} isVerified
 */
export function isDnpVerified(name) {
  const [, repo] = (name || "").split(/\.(.+)/);
  return repo === "dnp.dappnode.eth";
}

import { capitalize, stringEndsWith } from "utils/strings";
import { stringSplit } from "./strings";

export function shortName(ens) {
  if (!ens || typeof ens !== "string") return ens;
  if (!ens.includes(".")) return ens;
  return stringSplit(ens, ".")[0];
}

export function repoName(ens) {
  if (!ens || typeof ens !== "string") return ens;
  if (!ens.includes(".")) return ens;
  return stringSplit(ens, /\.(.+)/)[1];
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
  const beforeParentesis = stringSplit(author, "(")[0];
  const beforeLessthan = stringSplit(beforeParentesis, "<")[0];
  return beforeLessthan;
}

/**
 *
 * @param {string} name "bitcoin.dnp.dappnode.eth"
 * @returns {bool} isVerified
 */
export function isDnpVerified(name) {
  return stringEndsWith(name, "dnp.dappnode.eth");
}

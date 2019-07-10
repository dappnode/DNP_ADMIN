import { stringEndsWith } from "./strings";

const supportedDomains = ["eth"];

function isEnsDomain(ensDomain) {
  if (!ensDomain || typeof ensDomain !== "string") return false;
  if (ensDomain.includes("/")) return false;
  if (!ensDomain.includes(".")) return false;
  // "kovan.dnp.dappnode.eth" => "eth"
  return supportedDomains.some(domain => stringEndsWith(ensDomain, domain));
}

export default isEnsDomain;

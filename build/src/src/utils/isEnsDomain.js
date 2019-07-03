import { stringSplit, stringIncludes } from "./strings";

const supportedDomains = ["eth"];

function isEnsDomain(ensDomain) {
  if (!ensDomain || typeof ensDomain !== "string") return false;
  if (ensDomain.includes("/")) return false;
  if (!ensDomain.includes(".")) return false;
  // "kovan.dnp.dappnode.eth" => "eth"
  const domain = stringSplit(ensDomain, ".").slice(-1)[0] || "";
  if (!stringIncludes(supportedDomains, domain)) return false;
  // If no negative condition was matched:
  return true;
}

export default isEnsDomain;

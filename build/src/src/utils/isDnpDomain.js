/**
 * Checks if the given string is a DNP domain
 * @param {string} id "dnpName.dnp.dappnode.eth"
 */
function isDnpDomain(id) {
  if (!id || typeof id !== "string") return false;
  if (!id.includes(".")) return false;
  const [, dnpTag, , extension] = id.split(".");
  return (
    dnpTag &&
    (dnpTag === "dnp" || dnpTag === "public") &&
    extension &&
    extension === "eth"
  );
}

export default isDnpDomain;

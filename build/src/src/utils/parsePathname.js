/**
 * Parses pathname parts
 * @param {String} pathname = '/packages/kovan.dnp.dappnode.eth'
 * @return {Array} ['packages', 'kovan.dnp.dappnode.eth']
 */
const parsePathname = pathname => (pathname || "").split("/").filter(e => e);

export default parsePathname;

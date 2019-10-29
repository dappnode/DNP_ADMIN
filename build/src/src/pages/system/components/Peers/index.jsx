import React from "react";
// Components
import SubTitle from "components/SubTitle";
import AddIpfsPeer from "./AddIpfsPeer";
import ShareIpfsPeer from "./ShareIpfsPeer";

function Peers({ location, match }) {
  const peerFromUrl = getPeerFromUrl(location.pathname, match.url);
  return (
    <>
      <SubTitle>Share IPFS peer</SubTitle>
      <ShareIpfsPeer matchUrl={match.url} />
      <SubTitle>Add IPFS peer</SubTitle>
      <AddIpfsPeer peerFromUrl={peerFromUrl} />
    </>
  );
}

// Utils

/**
 * Parses the peer from the trailing part of the URL
 * @param {string} pathname "/system/add-ipfs-peer/%2Fdns4%2F4b62acf"
 * @param {string} matchedUrl "/system/add-ipfs-peer"
 */
function getPeerFromUrl(pathname, matchedUrl) {
  if (!pathname.includes(matchedUrl)) return "";
  const trailing = pathname.split(matchedUrl)[1];
  // remove first and last slash, and decode
  return decodeURIComponent((trailing || "").replace(/^\/|\/$/g, ""));
}

export default Peers;

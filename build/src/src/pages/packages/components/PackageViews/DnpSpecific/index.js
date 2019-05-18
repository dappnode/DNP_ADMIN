import React from "react";
// Dedicated Components
import IpfsDnpDappnodeEth from "./IpfsDnpDappnodeEth";

const Components = {
  "ipfs.dnp.dappnode.eth": IpfsDnpDappnodeEth
};

export default function Specific({ dnp }) {
  const { name } = dnp;

  // Return a specific component, if it exists for this DNP
  const Component = Components[name];
  return Component ? <Component dnp={dnp} /> : null;
}

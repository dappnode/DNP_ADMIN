import React from "react";
// Dedicated Components
import DappmanagerDnpDappnodeEth from "./DappmanagerDnpDappnodeEth";
import IpfsDnpDappnodeEth from "./IpfsDnpDappnodeEth";
import EthchainDnpDappnodeEth from "./EthchainDnpDappnodeEth";

const Components = {
  "dappmanager.dnp.dappnode.eth": DappmanagerDnpDappnodeEth,
  "ipfs.dnp.dappnode.eth": IpfsDnpDappnodeEth,
  "ethchain.dnp.dappnode.eth": EthchainDnpDappnodeEth
};

export default function Specific({ dnp }) {
  const { name } = dnp;

  // Return a specific component, if it exists for this DNP
  const Component = Components[name];
  return Component ? <Component dnp={dnp} /> : null;
}

export const dnpSpecificList = {
  "dappmanager.dnp.dappnode.eth": "Clean cache",
  "ipfs.dnp.dappnode.eth": "Connect with peers",
  "ethchain.dnp.dappnode.eth": "Choose client"
};

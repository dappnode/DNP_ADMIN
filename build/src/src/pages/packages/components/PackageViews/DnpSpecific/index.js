import React from "react";
// Dedicated Components
import DappmanagerDnpDappnodeEth from "./DappmanagerDnpDappnodeEth";
import EthchainDnpDappnodeEth from "./EthchainDnpDappnodeEth";

const Components = {
  "dappmanager.dnp.dappnode.eth": DappmanagerDnpDappnodeEth,
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
  "ethchain.dnp.dappnode.eth": "Choose client"
};

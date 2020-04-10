import React from "react";
// Dedicated Components
import DappmanagerDnpDappnodeEth from "./DappmanagerDnpDappnodeEth";

const Components = {
  "dappmanager.dnp.dappnode.eth": DappmanagerDnpDappnodeEth
};

export default function Specific({ dnp }) {
  const { name } = dnp;

  // Return a specific component, if it exists for this DNP
  const Component = Components[name];
  return Component ? <Component dnp={dnp} /> : null;
}

export const dnpSpecificList = {
  "dappmanager.dnp.dappnode.eth": "Clean cache"
};

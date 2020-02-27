import React, { useState } from "react";
import Card from "components/Card";
import Button from "components/Button";
import { EthMultiClients, EthClientData } from "components/EthMultiClient";
import { EthClientTarget } from "types";

const clients: EthClientData[] = [
  {
    target: "remote",
    title: "Remote",
    description: "Connect to public RPC mantained by DAppNode"
  },
  {
    target: "geth-light",
    title: "Light client",
    description:
      "Lightweight node for smaller devices or enhanced decentralization"
  },
  {
    target: "geth-full",
    title: "Full node",
    description: "Run your own node and allow apps to connect to it",
    options: [
      { name: "Geth", target: "geth-full" },
      { name: "Parity", target: "parity" }
    ]
  }
];

export default function ChooseEthClient() {
  const [target, setTarget] = useState("remote" as EthClientTarget);

  return (
    <Card className="dappnode-identity">
      <p>Choose the client from which the DAppNode should fetch package data</p>

      <EthMultiClients
        clients={clients}
        target={target}
        onTargetChange={setTarget}
      />

      <div style={{ textAlign: "end" }}>
        <Button variant="dappnode">Submit</Button>
      </div>
    </Card>
  );
}

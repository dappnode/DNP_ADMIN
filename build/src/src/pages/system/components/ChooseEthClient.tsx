import React, { useState } from "react";
import Card from "components/Card";
import Button from "components/Button";
import { EthMultiClients, EthClientData } from "components/EthMultiClient";

const clients: EthClientData[] = [
  {
    id: "remote",
    title: "Remote",
    description: "Connect to public RPC mantained by DAppNode"
  },
  {
    id: "light-client",
    title: "Light client",
    description:
      "Lightweight node for smaller devices or enhanced decentralization"
  },
  {
    id: "full-node",
    title: "Full node",
    description: "Run your own node and allow apps to connect to it",
    options: [{ name: "Geth", id: "geth" }, { name: "Parity", id: "parity" }]
  }
];

export default function ChooseEthClient() {
  const [type, setType] = useState("");
  return (
    <Card className="dappnode-identity">
      <p>Choose the client from which the DAppNode should fetch package data</p>

      <EthMultiClients clients={clients} type={type} onTypeChange={setType} />

      <div style={{ textAlign: "end" }}>
        <Button variant="dappnode">Submit</Button>
      </div>
    </Card>
  );
}

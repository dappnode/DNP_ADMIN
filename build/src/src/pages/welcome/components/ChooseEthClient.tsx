import React, { useState } from "react";
import Button from "components/Button";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
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

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
export default function ChoseEthClient({
  onNext,
  onBack
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  const [type, setType] = useState("");
  return (
    <>
      <div className="illustration">
        <img src={circuitBoardSvg} />
      </div>

      <div className="header">
        <div className="title">Choose Ethereum client</div>
        <div className="description">
          This client will be used to fetch package data
        </div>
      </div>

      <EthMultiClients clients={clients} type={type} onTypeChange={setType} />

      <div className="bottom-buttons">
        {onBack && (
          <Button onClick={onBack} variant="outline-secondary">
            Back
          </Button>
        )}
        {onNext && (
          <Button onClick={onNext} variant="dappnode">
            Next
          </Button>
        )}
      </div>
    </>
  );
}

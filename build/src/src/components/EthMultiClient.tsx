import React from "react";
import Card from "components/Card";
import "./ethMultiClient.scss";
import { joinCssClass } from "utils/css";
import Select from "components/Select";
import { EthClientTarget } from "types";

const clients: EthClientData[] = [
  {
    title: "Remote",
    description: "Connect to public RPC mantained by DAppNode",
    options: [{ name: "Remove", target: "remote" }]
  },
  {
    title: "Light client",
    description:
      "Lightweight node for smaller devices or enhanced decentralization",
    options: [{ name: "Geth light client", target: "geth-light" }]
  },
  {
    title: "Full node",
    description: "Run your own node and allow apps to connect to it",
    options: [
      { name: "Geth", target: "geth-fast" },
      { name: "Geth full", target: "geth-full" },
      { name: "Parity", target: "parity" }
    ]
  }
];

export interface EthClientData {
  title: string;
  description: string;
  options: { name: string; target: EthClientTarget }[];
}

interface OptionsMap {
  [name: string]: EthClientTarget;
}

/**
 * Utility to pretty names to the actual target of that option
 * @param options
 */
function getOptionsMap(
  options?: { name: string; target: EthClientTarget }[]
): OptionsMap {
  return options
    ? options.reduce((optMap: { [name: string]: EthClientTarget }, opt) => {
        optMap[opt.name] = opt.target;
        return optMap;
      }, {})
    : {};
}

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
export function EthMultiClients({
  target: selectedTarget,
  onTargetChange
}: {
  target: string;
  onTargetChange: (newTarget: EthClientTarget) => void;
}) {
  return (
    <div className="eth-multi-clients">
      {clients
        .filter(({ options }) => options.length > 0)
        .map(({ title, description, options }) => {
          const defaultTarget = options[0].target;
          const selected = options.some(opt => opt.target === selectedTarget);
          const optionMap = getOptionsMap(options);
          return (
            <Card
              key={defaultTarget}
              shadow
              className={`eth-multi-client ${joinCssClass({ selected })}`}
              onClick={() => {
                // Prevent over-riding the options onTargetChange call
                if (!selected) onTargetChange(defaultTarget);
              }}
            >
              <div className="title">{title}</div>
              <div className="description">{description}</div>
              {selected && options.length > 1 && (
                <Select
                  options={options.map(opt => opt.name)}
                  onValueChange={(newOpt: string) => {
                    onTargetChange(optionMap[newOpt]);
                  }}
                ></Select>
              )}
            </Card>
          );
        })}
    </div>
  );
}

import React from "react";
import Card from "components/Card";
import "./ethMultiClient.scss";
import { joinCssClass } from "utils/css";
import Select from "components/Select";
import { EthClientTarget } from "types";

export interface EthClientData {
  target: EthClientTarget;
  title: string;
  description: string;
  options?: { name: string; target: EthClientTarget }[];
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
  onTargetChange,
  clients
}: {
  target: string;
  onTargetChange: (newTarget: EthClientTarget) => void;
  clients: EthClientData[];
}) {
  return (
    <div className="eth-multi-clients">
      {clients.map(({ target, title, description, options }) => {
        const selected = selectedTarget === target;
        const optionMap = getOptionsMap(options);
        return (
          <Card
            shadow
            className={`eth-multi-client ${joinCssClass({ selected })}`}
            onClick={() => onTargetChange(target)}
          >
            <div className="title">{title}</div>
            <div className="description">{description}</div>
            {selected && options && (
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

import React from "react";
import Card from "components/Card";
import "./ethMultiClient.scss";
import { joinCssClass } from "utils/css";
import Select from "components/Select";

export interface EthClientData {
  id: string;
  title: string;
  description: string;
  options?: { name: string; id: string }[];
}

function EthClientCard({
  title,
  description,
  defaultType,
  onSelect,
  selected,
  options
}: {
  title: string;
  description: string;
  defaultType: string;
  onSelect: (type: string) => void;
  selected: boolean;
  options?: { name: string; id: string }[];
}) {
  const optionMap = options
    ? options.reduce((optMap: { [name: string]: string }, opt) => {
        optMap[opt.name] = opt.id;
        return optMap;
      }, {})
    : {};
  return (
    <Card
      shadow
      className={`eth-multi-client ${joinCssClass({ selected })}`}
      onClick={() => onSelect(defaultType)}
    >
      <div className="title">{title}</div>
      <div className="description">{description}</div>
      {selected && options && (
        <Select
          options={options.map(opt => opt.name)}
          onValueChange={(newOpt: string) => {
            onSelect(optionMap[newOpt]);
          }}
        ></Select>
      )}
    </Card>
  );
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
  type,
  onTypeChange,
  clients
}: {
  type: string;
  onTypeChange: (newType: string) => void;
  clients: EthClientData[];
}) {
  return (
    <div className="eth-multi-clients">
      {clients.map(({ id, title, description, options }) => (
        <EthClientCard
          key={id}
          onSelect={() => onTypeChange(id)}
          title={title}
          description={description}
          defaultType={id}
          options={options}
          selected={id === type}
        />
      ))}
    </div>
  );
}

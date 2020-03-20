import React from "react";
import Card from "components/Card";
import "./ethMultiClient.scss";
import { joinCssClass } from "utils/css";
import Select from "components/Select";
import { EthClientTarget } from "types";
import { AiFillSafetyCertificate, AiFillClockCircle } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa";
import Switch from "./Switch";

export function getEthClientPrettyName(target: EthClientTarget) {
  switch (target) {
    case "remote":
      return "Remote";
    case "geth-light":
      return "Geth light client";
    case "geth":
      return "Geth";
    case "openethereum":
      return "OpenEthereum";
    default:
      return target;
  }
}

const clients: EthClientData[] = [
  {
    title: "Remote",
    description: "Public node API mantained by DAppNode",
    options: ["remote"],
    stats: {
      syncTime: "Instant",
      requirements: "No requirements",
      trust: "Centralized trust"
    },
    highlight: "syncTime"
  },
  {
    title: "Light client",
    description: "Lightweight client for low-resource devices",
    options: ["geth-light"],
    stats: {
      syncTime: "Fast sync",
      requirements: "Light requirements",
      trust: "Semi-decentralized"
    },
    highlight: "requirements"
  },
  {
    title: "Full node",
    description: "Your own Ethereum node w/out 3rd parties",
    options: ["geth", "openethereum"],
    stats: {
      syncTime: "Slow sync",
      requirements: "High requirements",
      trust: "Fully decentralized"
    },
    highlight: "trust"
  }
];

export interface EthClientData {
  title: string;
  description: string;
  options: EthClientTarget[];
  stats: EthClientDataStats;
  highlight: keyof EthClientDataStats;
}
interface EthClientDataStats {
  syncTime: string;
  requirements: string;
  trust: string;
}

interface OptionsMap {
  [name: string]: EthClientTarget;
}

/**
 * Utility to pretty names to the actual target of that option
 * @param options
 */
function getOptionsMap(options?: EthClientTarget[]): OptionsMap {
  return options
    ? options.reduce((optMap: { [name: string]: EthClientTarget }, target) => {
        optMap[getEthClientPrettyName(target)] = target;
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
  showStats
}: {
  target: EthClientTarget;
  onTargetChange: (newTarget: EthClientTarget) => void;
  showStats?: boolean;
}) {
  return (
    <div className="eth-multi-clients">
      {clients
        .filter(({ options }) => options.length > 0)
        .map(({ title, description, options, stats, highlight }) => {
          const defaultTarget = options[0];
          const selected = options.includes(selectedTarget);
          const optionMap = getOptionsMap(options);
          const getSvgClass = (_highlight: keyof EthClientDataStats) =>
            joinCssClass({ active: highlight === _highlight });
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

              {showStats && <hr></hr>}
              {showStats && (
                <div className="eth-multi-client-stats">
                  <AiFillClockCircle className={getSvgClass("syncTime")} />
                  <FaDatabase className={getSvgClass("requirements")} />
                  <AiFillSafetyCertificate className={getSvgClass("trust")} />
                  <div className="tag">{stats.syncTime}</div>
                  <div className="tag">{stats.requirements}</div>
                  <div className="tag">{stats.trust}</div>
                </div>
              )}

              {selected && options.length > 1 && (
                <Select
                  options={options.map(getEthClientPrettyName)}
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

/**
 * View and toggle using the fallback when using a non-remote eth multi client
 * This component should be used with EthMultiClients
 */
export function EthMultiClientFallback({
  target,
  fallbackOn,
  onFallbackOnChange
}: {
  target: EthClientTarget;
  fallbackOn: boolean;
  onFallbackOnChange: (newFallbackOn: boolean) => void;
}) {
  // Do not render for remote
  if (target === "remote") return null;

  return (
    <Switch
      className="eth-multi-clients-fallback"
      checked={fallbackOn}
      onToggle={onFallbackOnChange}
      label="Use remote during syncing or errors"
      id="eth-multi-clients-fallback-switch"
    />
  );
}

/**
 * View to chose or change the Eth multi-client, plus choose to use a fallback
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
export function EthMultiClientsAndFallback({
  target,
  onTargetChange,
  showStats,
  fallbackOn,
  onFallbackOnChange
}: {
  target: EthClientTarget;
  onTargetChange: (newTarget: EthClientTarget) => void;
  showStats?: boolean;
  fallbackOn: boolean;
  onFallbackOnChange: (newFallbackOn: boolean) => void;
}) {
  return (
    <div className="eth-multi-clients-and-fallback">
      <EthMultiClients
        target={target}
        onTargetChange={onTargetChange}
        showStats={showStats}
      />
      <EthMultiClientFallback
        target={target}
        fallbackOn={fallbackOn}
        onFallbackOnChange={onFallbackOnChange}
      />
    </div>
  );
}

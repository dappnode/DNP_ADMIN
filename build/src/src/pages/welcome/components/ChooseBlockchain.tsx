import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Button from "components/Button";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import { EthMultiClients } from "components/EthMultiClient";
import { EthClientTarget, EthClientStatus } from "types";
import {
  getEthClientTarget,
  getEthClientStatus
} from "services/dappnodeStatus/selectors";
import { changeEthClientTarget } from "services/dappnodeStatus/actions";
import BottomButtons from "./BottomButtons";
import Card from "components/Card";
import { joinCssClass } from "utils/css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { prettyBytes } from "utils/format";
import "./chooseBlockchain.scss";

const blockchains: {
  name: string;
  logoUrl: string;
  diskSize: number;
}[] = [
  {
    name: "Ethereum",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/ethereum-1.svg",
    diskSize: 250e9
  },
  {
    name: "Bitcoin",
    logoUrl: "https://i.ibb.co/SBqj0tY/hiclipart-com.png",
    diskSize: 500e9
  },
  {
    name: "Monero",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/monero.svg",
    diskSize: 200e9
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
function ChooseBlockchain({
  onBack,
  onNext,
  // Redux
  ethClientTarget,
  ethClientStatus,
  changeEthClientTarget
}: {
  onBack?: () => void;
  onNext?: () => void;
  ethClientTarget?: EthClientTarget;
  ethClientStatus?: EthClientStatus;
  changeEthClientTarget: (target: EthClientTarget) => void;
}) {
  const [target, setTarget] = useState("" as EthClientTarget);
  const [selectedBlockchains, setSelectedBlockchains] = useState({} as {
    [name: string]: boolean;
  });

  const availableSize = 600e9;
  const toUseSize = blockchains.reduce(
    (total, { name, diskSize }) =>
      total + (selectedBlockchains[name] ? diskSize : 0),
    0
  );
  const isBlockchainChoosen =
    Object.values(selectedBlockchains).length > 0 &&
    Object.values(selectedBlockchains).some(Boolean);
  const diskPercent = Math.round((100 * toUseSize) / availableSize);
  const diskIsFull = diskPercent >= 100;

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  async function changeClient() {
    changeEthClientTarget(target);
    if (onNext) onNext();
  }

  function toggleBlockchain(name: string) {
    setSelectedBlockchains(x => ({ ...x, [name]: !x[name] }));
  }

  return (
    <>
      <div className="header">
        <div className="title">Choose your blockchain</div>
        <div className="description">
          Join a decentralized network to get started. <br />
          Don't worry you can change that later.
        </div>
      </div>

      <div
        className={`blockchain-disk-space-info ${joinCssClass({
          active: isBlockchainChoosen
        })}`}
      >
        <div className={`description ${joinCssClass({ error: diskIsFull })}`}>
          Requires {prettyBytes(toUseSize)} of {prettyBytes(availableSize)}{" "}
          available
        </div>
        <ProgressBar
          className="animate"
          style={{ opacity: 0.2 + toUseSize / availableSize }}
          now={diskPercent}
          variant={diskIsFull ? "danger" : undefined}
        />
      </div>

      <div className="choose-blockchain-cards">
        {blockchains.map(({ name, logoUrl }) => {
          const selected = selectedBlockchains[name];
          return (
            <Card
              key={name}
              shadow
              className={joinCssClass({ selected })}
              onClick={() => {
                toggleBlockchain(name);
                // Prevent over-riding the options onTargetChange call
                // if (!selected) onTargetChange(defaultTarget);
              }}
            >
              <img className="blockchain-logo" src={logoUrl} alt="logo" />
              <div className="title">{name}</div>
              {/* {selected && options.length > 1 && (
              <Select
                options={options.map(getEthClientPrettyName)}
                onValueChange={(newOpt: string) => {
                  onTargetChange(optionMap[newOpt]);
                }}
              ></Select>
            )} */}
            </Card>
          );
        })}
      </div>

      <BottomButtons
        onBack={onBack}
        onNext={isBlockchainChoosen ? onNext : onNext}
        nextTag={isBlockchainChoosen ? undefined : "Skip"}
        nextVariant={isBlockchainChoosen ? undefined : "outline-secondary"}
      />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  ethClientTarget: getEthClientTarget,
  ethClientStatus: getEthClientStatus
});

const mapDispatchToProps = {
  changeEthClientTarget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseBlockchain);

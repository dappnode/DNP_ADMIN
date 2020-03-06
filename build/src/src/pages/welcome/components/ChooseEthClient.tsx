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

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
function ChooseEthClient({
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

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  async function changeClient() {
    changeEthClientTarget(target);
    if (onNext) onNext();
  }

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
        {ethClientTarget && ethClientStatus && (
          <div className="description">
            Current client: {ethClientTarget} ({ethClientStatus})
          </div>
        )}
      </div>

      <EthMultiClients target={target} onTargetChange={setTarget} />

      <BottomButtons onBack={onBack} onNext={changeClient} />
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
)(ChooseEthClient);

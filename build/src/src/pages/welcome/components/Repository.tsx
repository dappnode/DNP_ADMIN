import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
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
function Repository({
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
      <div className="header">
        <div className="title">Repository Source</div>
        <div className="description">
          DAppNode uses smart contracts to access a decentralized respository of
          DApps
          <br />
          Choose to connect to a remote network or use your own local node
        </div>
      </div>

      <EthMultiClients target={target} onTargetChange={setTarget} showStats />

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
)(Repository);

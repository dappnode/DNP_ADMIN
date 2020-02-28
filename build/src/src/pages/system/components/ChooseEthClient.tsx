import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Card from "components/Card";
import Button from "components/Button";
import { EthMultiClients } from "components/EthMultiClient";
import { EthClientTarget, EthClientStatus } from "types";
import {
  getEthClientTarget,
  getEthClientStatus
} from "services/dappnodeStatus/selectors";
import { changeEthClientTarget } from "services/dappnodeStatus/actions";

function ChooseEthClient({
  // Redux
  ethClientTarget,
  ethClientStatus,
  changeEthClientTarget
}: {
  ethClientTarget?: EthClientTarget;
  ethClientStatus?: EthClientStatus;
  changeEthClientTarget: (target: EthClientTarget) => void;
}) {
  const [target, setTarget] = useState("" as EthClientTarget);

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  function changeClient() {
    changeEthClientTarget(target);
  }

  return (
    <Card className="dappnode-identity">
      <div>
        Choose the client from which the DAppNode should fetch package data
      </div>
      <div className="description">
        Current client: {ethClientTarget} ({ethClientStatus})
      </div>

      <EthMultiClients target={target} onTargetChange={setTarget} />

      <div style={{ textAlign: "end" }}>
        <Button
          variant="dappnode"
          onClick={changeClient}
          disabled={ethClientTarget === target}
        >
          Change
        </Button>
      </div>
    </Card>
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

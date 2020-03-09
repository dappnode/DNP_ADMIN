import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Card from "components/Card";
import Button from "components/Button";
import { EthMultiClients } from "components/EthMultiClient";
import { EthClientTarget, EthClientStatus } from "types";
import {
  getEthClientTarget,
  getEthClientStatus,
  getEthMultiClientWarning
} from "services/dappnodeStatus/selectors";
import { changeEthClientTarget } from "services/dappnodeStatus/actions";
import Alert from "react-bootstrap/Alert";

function ChooseEthClient({
  // Redux
  ethClientTarget,
  ethClientStatus,
  changeEthClientTarget,
  ethMultiClientWarning
}: {
  ethClientTarget?: EthClientTarget;
  ethClientStatus?: EthClientStatus;
  changeEthClientTarget: (target: EthClientTarget) => void;
  ethMultiClientWarning?: "not-installed" | "not-running";
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

      {ethMultiClientWarning === "not-installed" ? (
        <Alert variant="warning">
          Selected client is not installed. Please, re-install the client or
          select remote
        </Alert>
      ) : ethMultiClientWarning === "not-running" ? (
        <Alert variant="warning">
          Selected client is not running. Please, restart the client or select
          remote
        </Alert>
      ) : null}

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
  ethClientStatus: getEthClientStatus,
  ethMultiClientWarning: getEthMultiClientWarning
});

const mapDispatchToProps = {
  changeEthClientTarget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseEthClient);

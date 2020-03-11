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
import SubTitle from "components/SubTitle";

function Repository({
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
    <>
      <SubTitle>Source</SubTitle>
      <Card className="dappnode-identity">
        <div>
          DAppNode fetches its packages and core components in a decentralized
          way through a smart contract in the Ethereum Network. Provide a source
          to connect to it.
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
    </>
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
)(Repository);

import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as api from "API/calls";
import Card from "components/Card";
import Button from "components/Button";
import {
  getEthClientPrettyName,
  EthMultiClientsAndFallback
} from "components/EthMultiClient";
import { EthClientTarget, EthClientStatus, EthClientFallback } from "types";
import {
  getEthClientTarget,
  getEthClientStatus,
  getEthClientFallback,
  getEthMultiClientWarning
} from "services/dappnodeStatus/selectors";
import { changeEthClientTarget } from "pages/system/actions";
import Alert from "react-bootstrap/Alert";

function Repository({
  // Redux
  ethClientTarget,
  ethClientStatus,
  ethClientFallback,
  changeEthClientTarget,
  ethMultiClientWarning
}: {
  ethClientTarget?: EthClientTarget;
  ethClientStatus?: EthClientStatus;
  ethClientFallback?: EthClientFallback;
  changeEthClientTarget: (newTarget: EthClientTarget) => void;
  ethMultiClientWarning?: "not-installed" | "not-running";
}) {
  const [target, setTarget] = useState<EthClientTarget>("" as EthClientTarget);
  const [fallback, setFallback] = useState<EthClientFallback>("on");

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  useEffect(() => {
    if (typeof ethClientFallback === "boolean") setFallback(ethClientFallback);
  }, [ethClientFallback]);

  function changeClient() {
    changeEthClientTarget(target);
  }

  function changeFallback(newFallback: EthClientFallback) {
    setFallback(newFallback);
    api
      .ethClientFallbackSet({ fallback: newFallback }, { toastOnError: true })
      .catch(e => console.log("Error on ethClientFallbackSet", e));
  }

  return (
    <Card className="dappnode-identity">
      <div>
        DAppNode uses smart contracts to access a decentralized respository of
        DApps. Choose to connect to a remote network or use your own local node
      </div>
      {ethClientTarget && ethClientTarget !== "remote" && (
        <div className="description">
          Client status: <strong>{ethClientStatus}</strong> (
          {getEthClientPrettyName(ethClientTarget)})
        </div>
      )}

      {ethMultiClientWarning === "not-installed" && (
        <Alert variant="warning">
          Selected client is not installed. Please, re-install the client or
          select remote
        </Alert>
      )}
      {ethMultiClientWarning === "not-running" && (
        <Alert variant="warning">
          Selected client is not running. Please, restart the client or select
          remote
        </Alert>
      )}

      <EthMultiClientsAndFallback
        target={target}
        onTargetChange={setTarget}
        fallback={fallback}
        onFallbackChange={changeFallback}
      />

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
  ethClientFallback: getEthClientFallback,
  ethMultiClientWarning: getEthMultiClientWarning
});

const mapDispatchToProps = {
  changeEthClientTarget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository);

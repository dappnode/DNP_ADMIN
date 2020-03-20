import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import Card from "components/Card";
import Button from "components/Button";
import {
  EthMultiClients,
  getEthClientPrettyName,
  EthMultiClientFallback,
  EthMultiClientsAndFallback
} from "components/EthMultiClient";
import { EthClientTarget, EthClientStatus } from "types";
import {
  getEthClientTarget,
  getEthClientStatus,
  getEthMultiClientWarning
} from "services/dappnodeStatus/selectors";
import { changeEthClientTarget } from "pages/system/actions";
import Alert from "react-bootstrap/Alert";

function Repository({
  // Redux
  ethClientTarget,
  ethClientStatus,
  changeEthClientTarget,
  ethMultiClientWarning
}: {
  ethClientTarget?: EthClientTarget;
  ethClientStatus?: EthClientStatus;
  changeEthClientTarget: (kwargs: {
    target: EthClientTarget;
    fallbackOn: boolean;
  }) => void;
  ethMultiClientWarning?: "not-installed" | "not-running";
}) {
  const [target, setTarget] = useState("" as EthClientTarget);
  const [fallbackOn, setFallbackOn] = useState(false);

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  function changeClient() {
    changeEthClientTarget({ target, fallbackOn });
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
        fallbackOn={fallbackOn}
        onFallbackOnChange={setFallbackOn}
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
  ethMultiClientWarning: getEthMultiClientWarning
});

const mapDispatchToProps = {
  changeEthClientTarget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository);

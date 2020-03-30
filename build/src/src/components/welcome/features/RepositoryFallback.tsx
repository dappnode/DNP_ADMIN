import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  fallbackToBoolean,
  booleanToFallback
} from "components/EthMultiClient";
import { EthClientFallback } from "types";
import { getEthClientFallback } from "services/dappnodeStatus/selectors";
import BottomButtons from "../BottomButtons";
import * as api from "API/calls";
import Alert from "react-bootstrap/Alert";
import Switch from "react-switch";
import "./repositoryFallback.scss";

const factor = 2;
const height = 28 * factor;
const width = 64 * factor;
const fontSize = 16 * factor;
const onColor = "#2fbcb2";
const offColor = undefined; // "#bc2f39";
const switchLabelProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  fontSize,
  color: "white",
  paddingRight: 2
};

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
function RepositoryFallback({
  onBack,
  onNext,
  // Redux
  ethClientFallback
}: {
  onBack?: () => void;
  onNext?: () => void;
  ethClientFallback?: EthClientFallback;
}) {
  // Use fallback by default
  const [fallback, setFallback] = useState<EthClientFallback>("on");

  useEffect(() => {
    if (ethClientFallback) setFallback(ethClientFallback);
  }, [ethClientFallback]);

  async function changeFallback() {
    api.ethClientFallbackSet({ fallback }).catch(e => {
      console.error(`Error on ethClientFallbackSet: ${e.stack}`);
    });

    if (onNext) onNext();
  }

  return (
    <>
      <div className="header">
        <div className="title">Repository Fallback</div>
        <div className="description">
          DAppNode uses smart contracts to access a decentralized respository of
          DApps
          <br />
          Choose to use a remote node if your node syncing or errors
        </div>
      </div>

      <div className="repository-fallback-switch">
        <label htmlFor="repository-fallback-switch">
          <span>Use remote during syncing or errors</span>
          <Switch
            checked={fallbackToBoolean(fallback)}
            onChange={bool => setFallback(booleanToFallback(bool))}
            uncheckedIcon={<div style={switchLabelProps}>OFF</div>}
            checkedIcon={<div style={switchLabelProps}>ON</div>}
            className="react-switch"
            id="repository-fallback-switch"
            onColor={onColor}
            offColor={offColor}
            height={height}
            width={width}
            handleDiameter={height * 0.7}
          />
        </label>

        {fallback === "off" && (
          <Alert variant="warning">
            This node will need some time to sync and versions in the repository
            may not be up to date until then
          </Alert>
        )}
      </div>

      <BottomButtons onBack={onBack} onNext={changeFallback} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  ethClientFallback: getEthClientFallback
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryFallback);

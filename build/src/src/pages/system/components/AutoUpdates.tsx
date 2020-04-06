import React from "react";
import { createStructuredSelector, createSelector } from "reselect";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// Components
import Card from "components/Card";
import Alert from "react-bootstrap/Alert";
import AutoUpdatesView from "components/AutoUpdatesView";
// External
import {
  getEthClientFallback,
  getEthClientStatus
} from "services/dappnodeStatus/selectors";
import { EthClientStatus, EthClientFallback } from "types";
import { getEthClientPrettyStatusError } from "components/EthMultiClient";
import {
  rootPath as systemRootPath,
  subPaths as systemSubPaths
} from "pages/system/data";
// Styles
import "./autoUpdates.scss";

function AutoUpdates({
  ethClientStatus,
  ethClientFallback
}: {
  ethClientStatus?: EthClientStatus | null;
  ethClientFallback?: EthClientFallback;
}) {
  return (
    <Card>
      <div className="auto-updates-explanation">
        Enable auto-updates for DAppNode to install automatically the latest
        versions. For major breaking updates, your approval will always be
        required.
      </div>

      {ethClientStatus && !ethClientStatus.ok && ethClientFallback === "off" && (
        <Alert variant="warning">
          Auto-updates will not work temporarily. Eth client not available:{" "}
          {getEthClientPrettyStatusError(ethClientStatus)}
          <br />
          Enable the{" "}
          <NavLink to={`${systemRootPath}/${systemSubPaths.repository}`}>
            repository source fallback
          </NavLink>{" "}
          to have auto-updates meanwhile
        </Alert>
      )}

      <AutoUpdatesView />
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  ethClientStatus: getEthClientStatus,
  ethClientFallback: getEthClientFallback
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);

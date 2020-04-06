import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// Components
import Card from "components/Card";
import Alert from "react-bootstrap/Alert";
import AutoUpdatesView from "components/AutoUpdatesView";
// External
import { getEthClientWarning } from "services/dappnodeStatus/selectors";
import { activateFallbackPath } from "pages/system/data";
// Styles
import "./autoUpdates.scss";

function AutoUpdates({
  ethClientWarning
}: {
  ethClientWarning: string | null;
}) {
  return (
    <Card>
      <div className="auto-updates-explanation">
        Enable auto-updates for DAppNode to install automatically the latest
        versions. For major breaking updates, your approval will always be
        required.
      </div>

      {ethClientWarning && (
        <Alert variant="warning">
          Auto-updates will not work temporarily. Eth client not available:{" "}
          {ethClientWarning}
          <br />
          Enable the{" "}
          <NavLink to={activateFallbackPath}>
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
  ethClientWarning: getEthClientWarning
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);

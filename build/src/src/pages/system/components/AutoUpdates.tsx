import React from "react";
import { createStructuredSelector, createSelector } from "reselect";
import { connect } from "react-redux";
// Components
import Card from "components/Card";
import Alert from "react-bootstrap/Alert";
// External
import { getMainnet } from "services/chainData/selectors";
import { getIsMainnetDnpNotRunning } from "services/dnpInstalled/selectors";
// Styles
import "./autoUpdates.scss";
import AutoUpdatesView from "components/AutoUpdatesView";

function AutoUpdates({ mainnetBadStatus }: { mainnetBadStatus?: string }) {
  return (
    <Card>
      <div className="auto-updates-explanation">
        Enable auto-updates for DAppNode to stay automatically up to date to the
        latest versions. <strong>Note</strong> that for major breaking updates,
        the interaction of an admin will always be required.
      </div>

      {mainnetBadStatus && (
        <Alert variant="warning">
          {mainnetBadStatus}. Note that auto-updates will not work meanwhile.
        </Alert>
      )}

      <AutoUpdatesView />
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  mainnetBadStatus: createSelector(
    getMainnet,
    getIsMainnetDnpNotRunning,
    (mainnet, isMainnetDnpNotRunning) => {
      if (isMainnetDnpNotRunning) return "Mainnet is not running";
      if (!mainnet) return "Mainnet not found";
      if (mainnet.syncing) return "Mainnet is syncing";
      if (mainnet.error) return "Mainnet error";
    }
  )
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);

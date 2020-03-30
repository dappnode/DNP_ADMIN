import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { getEthClientTarget } from "services/dappnodeStatus/selectors";
import BottomButtons from "./BottomButtons";
import Card from "components/Card";
import AutoUpdatesView from "components/AutoUpdatesView";

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
function AutoUpdates({
  onBack,
  onNext
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  return (
    <>
      <div className="header">
        <div className="title">Auto updates</div>
        <div className="description">
          Enable auto-updates for DAppNode to install automatically the latest
          versions.
          <br />
          For major breaking updates, your interaction will always be required.
        </div>
      </div>

      {/* This top div prevents the card from stretching vertically */}
      <div>
        <Card>
          <AutoUpdatesView onlySummary />
        </Card>
      </div>

      <BottomButtons onBack={onBack} onNext={onNext} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  ethClientTarget: getEthClientTarget
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);

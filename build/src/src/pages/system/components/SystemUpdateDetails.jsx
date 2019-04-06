import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import DependencyList from "pages/installer/components/InstallCardComponents/DependencyList";
import Linkify from "react-linkify";
// Actions
import { updateCore } from "services/coreUpdate/actions";
// Selectors
import { getCoreDeps, getCoreManifest } from "services/coreUpdate/selectors";
import { getIsLoadingStrictById } from "services/loadingStatus/selectors";
import { loadingId as loadingIdCoreUpdate } from "services/coreUpdate/data";
// Components
import Card from "components/Card";
import Button from "components/Button";
import Loading from "components/generic/Loading";

function OnInstallAlert({ manifest }) {
  const { onInstall } = (manifest || {}).warnings || {};
  if (!onInstall) return null;
  return (
    <div className="alert alert-warning" style={{ margin: "12px 0 6px 0" }}>
      <Linkify>{onInstall}</Linkify>
    </div>
  );
}

const SystemUpdateDetails = ({
  coreDeps,
  coreManifest,
  isLoading,
  updateCore
}) => {
  /* If loading, return a loading animation */
  if (isLoading) return <Loading msg="Checking core version..." />;
  /* If no deps, don't show the card */
  if (!coreDeps.length) return null;

  const coreChangelog = (coreManifest || {}).changelog;
  return (
    <Card className="system-update-grid">
      <div>
        <div className="section-card-subtitle">Core {coreManifest.version}</div>
        {coreChangelog && <Linkify>{coreChangelog}</Linkify>}
        <OnInstallAlert manifest={coreManifest} />
      </div>

      {/* Dedicated per core version update and warnings */}
      <DependencyList deps={coreDeps} />

      <Button variant="dappnode" onClick={updateCore}>
        Update
      </Button>
    </Card>
  );
};

SystemUpdateDetails.propTypes = {
  coreDeps: PropTypes.array.isRequired,
  coreManifest: PropTypes.object
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: getCoreDeps,
  coreManifest: getCoreManifest,
  isLoading: getIsLoadingStrictById(loadingIdCoreUpdate)
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdateDetails);

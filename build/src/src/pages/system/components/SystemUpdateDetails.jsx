import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as a from "../actions";
import * as s from "../selectors";
import { connect } from "react-redux";
import TextWithUrls from "components/TextWithUrls";
import DependencyList from "pages/installer/components/InstallCardComponents/DependencyList";
import Linkify from "react-linkify";
// Components
import Card from "components/Card";

const bottomLine = {
  borderBottom: "1px solid #dfdfdf",
  paddingBottom: "12px",
  marginBottom: "12px"
};
const margin = "5px";

function OnInstallAlert({ manifest }) {
  const { onInstall } = (manifest || {}).warnings || {};
  if (!onInstall) return null;
  return (
    <div className="alert alert-warning" style={{ margin: "12px 0 6px 0" }}>
      <Linkify>{onInstall}</Linkify>
    </div>
  );
}

const SystemUpdateDetails = ({ coreDeps, coreManifest, updateCore }) => {
  if (!coreDeps.length) return null;
  const coreChangelog = (coreManifest || {}).changelog;
  return (
    <Card>
      <div className="card-text" style={{ margin }}>
        {/* Header: core change log and warning */}

        <div style={bottomLine}>
          {coreChangelog ? (
            <div>
              <strong>Core {coreManifest.version} changelog: </strong>{" "}
              <TextWithUrls text={coreChangelog} />
            </div>
          ) : null}

          <OnInstallAlert manifest={coreManifest} />
        </div>

        {/* Dedicated per core version update and warnings */}
        <DependencyList deps={coreDeps} />
      </div>

      {/* Update button */}
      <div className="float-right" style={{ margin }}>
        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={updateCore}
        >
          Update
        </button>
      </div>
    </Card>
  );
};

SystemUpdateDetails.propTypes = {
  coreDeps: PropTypes.array.isRequired,
  coreManifest: PropTypes.object
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: s.coreDeps,
  coreManifest: s.coreManifest
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore: a.updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdateDetails);

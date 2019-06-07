import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import DependencyList from "pages/installer/components/InstallCardComponents/DependencyList";
import ReactMarkdown from "react-markdown";
// Actions
import { updateCore } from "services/coreUpdate/actions";
// Selectors
import {
  getCoreDeps,
  getCoreManifest,
  getCoreUpdateAlerts
} from "services/coreUpdate/selectors";
import { getIsLoadingStrictById } from "services/loadingStatus/selectors";
import { loadingId as loadingIdCoreUpdate } from "services/coreUpdate/data";
// Components
import Card from "components/Card";
import Button from "components/Button";
import Loading from "components/generic/Loading";
// Icons
import { FaArrowRight } from "react-icons/fa";

const SystemUpdateDetails = ({
  coreDeps,
  coreManifest,
  coreUpdateAlerts,
  isLoading,
  updateCore
}) => {
  /* If loading, return a loading animation */
  if (isLoading) return <Loading msg="Checking core version..." />;
  /* If no deps, don't show the card */
  if (!coreDeps.length) return null;

  const { changelog } = coreManifest || {};

  return (
    <Card className="system-update-grid">
      <div>
        <div className="section-card-subtitle">Core {coreManifest.version}</div>
        {changelog && <ReactMarkdown source={changelog} />}

        {coreUpdateAlerts.map(updateAlert => (
          <div
            className="alert alert-warning"
            style={{ margin: "12px 0 6px 0" }}
          >
            {/* If there are multiple alerts, display the update jump */}
            {coreUpdateAlerts.length > 1 && (
              <div style={{ fontWeight: "bold" }}>
                {updateAlert.from}{" "}
                <FaArrowRight style={{ fontSize: ".7rem" }} /> {updateAlert.to}
              </div>
            )}
            <ReactMarkdown source={updateAlert.message} />
          </div>
        ))}
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
  coreManifest: PropTypes.object,
  coreUpdateAlerts: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      message: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: getCoreDeps,
  coreManifest: getCoreManifest,
  coreUpdateAlerts: getCoreUpdateAlerts,
  isLoading: getIsLoadingStrictById(loadingIdCoreUpdate)
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdateDetails);

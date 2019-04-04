import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { toSentence } from "utils/strings";
// This module
import * as s from "../selectors";
import * as a from "../actions";
import Details from "./InstallCardComponents/Details";
import ProgressLog from "./InstallCardComponents/ProgressLog";
import Success from "./InstallCardComponents/Success";
import Dependencies from "./InstallCardComponents/Dependencies";
import SpecialPermissions from "./InstallCardComponents/SpecialPermissions";
import Vols from "./InstallCardComponents/Vols";
import Envs from "./InstallCardComponents/Envs";
import Ports from "./InstallCardComponents/Ports";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Components generic
import Button from "components/Button";
import Card from "components/Card";
import Switch from "components/Switch";

function InstallerInterface({
  id,
  dnp,
  progressLog,
  install,
  clearUserSet,
  fetchPackageRequest,
  fetchPackageData
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(() => {
    clearUserSet();
    fetchPackageRequest(id);
    fetchPackageData(id);
  }, [id]);

  const { loading, resolving, error, manifest, requestResult, tag } = dnp || {};

  if (error && !manifest) return <Error msg={`Error: ${error}`} />;
  if (loading) return <Loading msg={"Loading DNP data..."} />;
  if (!dnp && !error) return <Error msg={"Package not found"} />;

  // If there is an installation in progress, show it.
  // Also prevents the user to install an installing package
  if (progressLog)
    return (
      <>
        <ProgressLog progressLog={progressLog} />
        <Details dnp={dnp} />
      </>
    );

  // If the package is updated, show a redirect to the packages section
  if (dnp.tag && dnp.tag === "UPDATED")
    return (
      <>
        <Success manifest={manifest} />
        <Details dnp={dnp} />
      </>
    );

  /**
   * Filter options according to the current package
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const availableOptions = [];
  if ((id || "").startsWith("/ipfs/") && manifest.type === "dncore")
    availableOptions.push("BYPASS_CORE_RESTRICTION");

  // Otherwise, show info an allow an install
  return (
    <>
      <Card className="installer-header">
        <Details dnp={dnp} />
        {availableOptions.map(option => (
          <Switch
            checked={options[option]}
            onToggle={value => setOptions({ [option]: value })}
            label={toSentence(option)}
            id={"switch-" + option}
          />
        ))}

        <Button variant="dappnode" onClick={() => install(id, options)}>
          {tag}
        </Button>
      </Card>

      <Dependencies request={requestResult} resolving={resolving} />

      <SpecialPermissions />

      {showSettings ? (
        <>
          <Envs />
          <Ports />
          <Vols />
        </>
      ) : (
        <Button
          variant="outline-secondary"
          onClick={() => setShowSettings(true)}
        >
          Show advanced settings
        </Button>
      )}
    </>
  );
}

InstallerInterface.propTypes = {
  id: PropTypes.string.isRequired,
  dnp: PropTypes.object
};

// Container

const mapStateToProps = createStructuredSelector({
  id: s.getQueryId,
  dnp: s.getQueryDnp,
  progressLogs: () => {},
  // For the withTitle HOC
  subtitle: s.getQueryIdOrName
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchPackageRequest: a.fetchPackageRequest,
  fetchPackageData: a.fetchPackageData
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch

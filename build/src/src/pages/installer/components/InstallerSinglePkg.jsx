import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { toSentence, stringIncludes } from "utils/strings";
import { isEmpty } from "lodash";
// This module
import * as s from "../selectors";
import * as a from "../actions";
import Details from "./InstallCardComponents/Details";
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
import Dependencies from "./InstallCardComponents/Dependencies";
import SpecialPermissions from "./InstallCardComponents/SpecialPermissions";
import Vols from "./InstallCardComponents/Vols";
import Envs from "./InstallCardComponents/Envs";
import Ports from "./InstallCardComponents/Ports";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Button, { ButtonLight } from "components/Button";
import Card from "components/Card";
import Switch from "components/Switch";

function InstallerInterface({
  id,
  dnp,
  progressLogs,
  // Actions
  install,
  clearUserSet,
  fetchPackageRequest,
  fetchPackageData,
  // Extra
  history
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(() => {
    clearUserSet();
    fetchPackageRequest(id);
    fetchPackageData(id);
  }, [id]);

  const { loading, resolving, error, manifest, requestResult, tag } = dnp || {};
  const { name, type } = manifest || {};

  // When the DNP is updated (finish installation), redirect to /packages
  useEffect(() => {
    if (stringIncludes(tag, "updated") && name)
      history.push(packagesRootPath + "/" + name);
  }, [tag]);

  if (error && !manifest) return <Error msg={`Error: ${error}`} />;
  if (loading) return <Loading msg={"Loading DNP data..."} />;
  if (!dnp && !error) return <Error msg={"Package not found"} />;

  /**
   * Filter options according to the current package
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const availableOptions = [];
  if ((id || "").startsWith("/ipfs/") && type === "dncore")
    availableOptions.push("BYPASS_CORE_RESTRICTION");

  // Otherwise, show info an allow an install
  return (
    <>
      <ProgressLogs progressLogs={progressLogs} />
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
        {isEmpty(progressLogs) && (
          <Button variant="dappnode" onClick={() => install(id, options)}>
            {tag}
          </Button>
        )}
      </Card>
      <Dependencies
        request={requestResult || {}}
        resolving={resolving || false}
      />
      <SpecialPermissions />
      {showSettings ? (
        <>
          <Envs />
          <Ports />
          <Vols />
        </>
      ) : (
        <ButtonLight onClick={() => setShowSettings(true)}>
          Show advanced settings
        </ButtonLight>
      )}
    </>
  );
}

InstallerInterface.propTypes = {
  id: PropTypes.string.isRequired,
  dnp: PropTypes.object,
  history: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  id: s.getQueryId,
  dnp: s.getQueryDnp,
  progressLogs: (state, ownProps) =>
    getProgressLogsByDnp(state, s.getQueryId(state, ownProps)),
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
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch

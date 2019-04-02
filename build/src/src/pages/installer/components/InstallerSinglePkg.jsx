import React, { useEffect } from "react";
import * as s from "../selectors";
import { connect } from "react-redux";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import {
  fetchPackageRequest,
  fetchPackageData,
  clearUserSet
} from "../actions";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";

// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Details from "./InstallCardComponents/Details";
import ProgressLog from "./InstallCardComponents/ProgressLog";
import ApproveInstall from "./InstallCardComponents/ApproveInstall";
import Success from "./InstallCardComponents/Success";

function InstallerInterface({
  id,
  dnp,
  progressLog,
  clearUserSet,
  fetchPackageRequest,
  fetchPackageData
}) {
  useEffect(() => {
    clearUserSet();
    fetchPackageRequest(id);
    fetchPackageData(id);
  }, [id]);

  const isLoading = (dnp || {}).loading;
  const isResolving = (dnp || {}).resolving;
  const isError = (dnp || {}).error;
  const hasManifest = (dnp || {}).manifest;

  if (!hasManifest && isError) {
    return <Error msg={`Error: ${isError}`} />;
  }
  if (isLoading) {
    return <Loading msg={"Loading DNP data..."} />;
  }
  if (isResolving) {
    return <Loading msg={"Resolving DNP dependencies..."} />;
  }
  if (!dnp || dnp.error) {
    return <Error msg={"Package not found"} />;
  }

  const manifest = dnp.manifest || {};

  // If there is an installation in progress, show it.
  // Also prevents the user to install an installing package
  if (progressLog) {
    return (
      <>
        <ProgressLog progressLog={progressLog} />
        <Details dnp={dnp} />
      </>
    );
  }

  // If the package is updated, show a redirect to the packages section
  if (dnp.tag && dnp.tag === "UPDATED") {
    return (
      <>
        <Success manifest={manifest} />
        <Details dnp={dnp} />
      </>
    );
  }

  // Otherwise, show info an allow an install
  let request = dnp.requestResult || {};
  if ("fetchingRequest" in dnp) {
    request.fetching = dnp.fetchingRequest;
  }
  return (
    <ApproveInstall id={id} pkg={dnp} manifest={manifest} request={request} />
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
  title: () => "Installer",
  subtitle: s.getQueryIdOrName
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  clearUserSet,
  fetchPackageRequest,
  fetchPackageData
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch

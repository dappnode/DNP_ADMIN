import React from "react";
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

class InstallerInterfaceView extends React.Component {
  static propTypes = {
    connectionOpen: PropTypes.bool // is null on init
  };

  componentWillMount() {
    const id = this.props.id;
    this.props.clearUserSet();
    this.props.fetchPackageRequest(id);
    this.props.fetchPackageData(id);
  }

  render() {
    const id = this.props.id;
    const dnp = this.props.dnp;
    const isLoading = (dnp || {}).loading;
    const isResolving = (dnp || {}).resolving;
    const isError = (dnp || {}).error;
    const hasManifest = (dnp || {}).manifest;
    const connectionOpen = this.props.connectionOpen;

    if (!hasManifest && isError) {
      return <Error msg={`Error: ${isError}`} />;
    }
    if (isLoading) {
      return <Loading msg={"Loading DNP data..."} />;
    }
    if (isResolving) {
      return <Loading msg={"Resolving DNP dependencies..."} />;
    }
    if (!connectionOpen) {
      return <Loading msg="Openning connection..." />;
    }
    if (!dnp || dnp.error) {
      return <Error msg={"Package not found"} />;
    }

    const manifest = dnp.manifest || {};
    const progressLog = this.props.progressLog;

    if (progressLog) {
      // If there is an installation in progress, show it.
      // Also prevents the user to install an installing package
      return (
        <React.Fragment>
          <ProgressLog progressLog={progressLog} />
          <Details dnp={dnp} />
        </React.Fragment>
      );
    } else if (dnp.tag && dnp.tag === "UPDATED") {
      // If the package is updated, show a redirect to the packages section
      return (
        <React.Fragment>
          <Success manifest={manifest} />
          <Details dnp={dnp} />
        </React.Fragment>
      );
    } else {
      // Otherwise, show info an allow an install
      let request = dnp.requestResult || {};
      if ("fetchingRequest" in dnp) {
        request.fetching = dnp.fetchingRequest;
      }
      return (
        <ApproveInstall
          id={id}
          pkg={dnp}
          manifest={manifest}
          request={request}
        />
      );
    }
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  id: s.getQueryId,
  dnp: s.getQueryDnp,
  connectionOpen: s.connectionOpen,
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
)(InstallerInterfaceView);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch

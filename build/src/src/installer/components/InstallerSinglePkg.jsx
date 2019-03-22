import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import {
  fetchPackageRequest,
  fetchPackageData,
  updateQueryId,
  clearUserSet
} from "../actions";
import { createStructuredSelector } from "reselect";
import * as utils from "../utils";
import PropTypes from "prop-types";

// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Details from "./InstallCardComponents/Details";
import ProgressLog from "./InstallCardComponents/ProgressLog";
import ApproveInstall from "./InstallCardComponents/ApproveInstall";
import Success from "./InstallCardComponents/Success";

function findProgressLog(pkgName, progressLogs) {
  for (const logId of Object.keys(progressLogs)) {
    if (Object.keys(progressLogs[logId]).includes(pkgName)) {
      return progressLogs[logId];
    }
  }
}

const parsePathname = pathname => (pathname || "").split("/").filter(e => e);

class InstallerInterfaceView extends React.Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    directory: PropTypes.object.isRequired,
    connectionOpen: PropTypes.bool, // is null on init
    progressLogs: PropTypes.object.isRequired
  };

  componentWillMount() {
    const id = utils.urlToId(parsePathname(this.props.match.url)[1] || "");
    this.props.clearUserSet();
    this.props.updateQueryId(id);
    this.props.fetchPackageRequest(id);
    this.props.fetchPackageData(id);
  }

  render() {
    const id = utils.urlToId(parsePathname(this.props.match.url)[1] || "");
    const pkg = this.props.directory[id];
    const headerName = ((pkg || {}).manifest || {}).name || id;
    const connectionOpen = this.props.connectionOpen;

    const header = (
      <div className="section-title">
        <span style={{ opacity: 0.3, fontWeight: 300 }}>Installer </span>
        {headerName}
      </div>
    );

    if (!connectionOpen) {
      return (
        <React.Fragment>
          {header}
          <Loading msg="Openning connection..." />
        </React.Fragment>
      );
    }

    if (!pkg && this.props.fetching) {
      return (
        <React.Fragment>
          {header}
          <Loading msg={"Fetching package data..."} />
        </React.Fragment>
      );
    }

    if (!pkg || pkg.error) {
      return (
        <React.Fragment>
          {header}
          <Error msg={"Package not found"} />
        </React.Fragment>
      );
    }

    const manifest = pkg.manifest || {};
    const pkgName = manifest.name;
    const progressLog = findProgressLog(pkgName, this.props.progressLogs);

    if (progressLog) {
      // If there is an installation in progress, show it.
      // Also prevents the user to install an installing package
      return (
        <React.Fragment>
          {header}
          <ProgressLog progressLog={progressLog} />
          <Details pkg={pkg} />
        </React.Fragment>
      );
    } else if (pkg.tag && pkg.tag === "UPDATED") {
      // If the package is updated, show a redirect to the packages section
      return (
        <React.Fragment>
          {header}
          <Success manifest={manifest} />
          <Details pkg={pkg} />
        </React.Fragment>
      );
    } else {
      // Otherwise, show info an allow an install
      let request = pkg.requestResult || {};
      if ("fetchingRequest" in pkg) {
        request.fetching = pkg.fetchingRequest;
      }
      return (
        <React.Fragment>
          {header}
          <ApproveInstall
            id={id}
            pkg={pkg}
            manifest={manifest}
            request={request}
          />
        </React.Fragment>
      );
    }
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  fetching: selector.fetching,
  directory: selector.getDirectory,
  connectionOpen: selector.connectionOpen,
  progressLogs: selector.progressLogs
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  clearUserSet,
  updateQueryId,
  fetchPackageRequest,
  fetchPackageData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerInterfaceView);

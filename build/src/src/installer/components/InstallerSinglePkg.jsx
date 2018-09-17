import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import * as utils from "../utils";
import PropTypes from "prop-types";

// Components
import Loading from "components/Loading";
import Error from "components/Error";
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

class InstallerInterfaceView extends React.Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    directory: PropTypes.object.isRequired,
    connectionOpen: PropTypes.bool, // is null on init
    progressLogs: PropTypes.object.isRequired
  };

  componentWillMount() {
    const id = utils.urlToId(this.props.match.params.id);
    this.props.fetchPackageRequest(id);
    this.props.fetchPackageData(id);
  }

  render() {
    const url = this.props.match.params.id;
    const id = utils.urlToId(url);
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
      return (
        <React.Fragment>
          {header}
          <Details pkg={pkg} />
          <ApproveInstall
            id={id}
            pkg={pkg}
            manifest={manifest}
            request={{
              ...(pkg.requestResult || {}),
              fetching: pkg.fetchingRequest
            }}
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

const mapDispatchToProps = dispatch => {
  return {
    fetchPackageRequest: id => {
      dispatch(action.fetchPackageRequest(id));
    },
    fetchPackageData: id => {
      dispatch(action.fetchPackageData(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerInterfaceView);

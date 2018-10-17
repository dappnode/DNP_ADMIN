import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import { push } from "connected-react-router";
import { NAME } from "../constants";
import { shortName } from "utils/format";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
// Components
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import Controls from "./PackageViews/Controls";
// utils
import parsePorts from "utils/parsePorts";

class PackageInterface extends React.Component {
  constructor(props) {
    super(props);
    this.removePackageConfirm = this.removePackageConfirm.bind(this);
  }

  removePackageConfirm(pkg, deleteVolumes) {
    confirmAlert({
      title: "Removing " + shortName(pkg.name),
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.props.removePackage(pkg, deleteVolumes)
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  render() {
    const pkg = this.props.pkg;
    if (!pkg) {
      return (
        <div className="alert" role="alert">
          Loading {this.props.id} ... (if this take too long, package may be
          missing or misspelled)
        </div>
      );
    }

    const id = pkg.name;

    // let packageProperties = Object.getOwnPropertyNames(_package)
    // remove(packageProperties, ['id', 'isDNP', 'running', 'shortName'])

    return (
      <div>
        <div className="section-title">
          <span style={{ opacity: 0.3, fontWeight: 300 }}>Packages </span>
          {id}
        </div>

        <Details pkg={pkg} />

        <Logs
          id={id}
          logs={this.props.logs}
          logPackage={options => this.props.logPackage(id, options)}
        />

        <Envs id={id} pkg={pkg} />

        <Controls
          state={pkg.state}
          togglePackage={() => this.props.togglePackage(id)}
          restartPackage={() => this.props.restartPackage(id)}
          restartPackageVolumes={() => this.props.restartPackageVolumes(id)}
          removePackage={() => this.removePackageConfirm(pkg, false)}
          removePackageAndData={() => this.removePackageConfirm(pkg, true)}
        />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  pkg: selector.getPackage,
  packageList: selector.getPackages,
  logs: selector.getLogs
});

const mapDispatchToProps = dispatch => {
  return {
    logPackage: (id, options) => {
      dispatch(action.logPackage({ id, options }));
    },
    togglePackage: id => {
      dispatch(action.togglePackage({ id }));
    },
    restartPackage: id => {
      dispatch(action.restartPackage({ id }));
    },
    restartPackageVolumes: id => {
      dispatch(action.restartPackageVolumes({ id }));
    },
    removePackage: (pkg, deleteVolumes) => {
      dispatch(action.removePackage({ id: pkg.name, deleteVolumes }));
      const ports = parsePorts(pkg.manifest || {});
      if (ports.length) dispatch(action.closePorts(ports));
      dispatch(push("/" + NAME));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);

import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import { push } from "connected-react-router";
import { NAME } from "../constants";
import confirmPackageRemove from "./confirmPackageRemove";
import confirmVolumeRemove from "./confirmVolumeRemove";
// Components
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import Controls from "./PackageViews/Controls";
// utils
import parsePorts from "utils/parsePorts";

class PackageInterface extends React.Component {
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
          togglePackage={this.props.togglePackage.bind(this, id)}
          restartPackage={this.props.restartPackage.bind(this, id)}
          restartPackageVolumes={() =>
            confirmVolumeRemove(id, this.props.restartPackageVolumes)
          }
          removePackage={() =>
            confirmPackageRemove(pkg, this.props.removePackage)
          }
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

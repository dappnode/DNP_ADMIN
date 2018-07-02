import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import { push } from "connected-react-router";
import { NAME } from "../constants";
// Components
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import Controls from "./PackageViews/Controls";

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

    let id = pkg.name;

    // let packageProperties = Object.getOwnPropertyNames(_package)
    // remove(packageProperties, ['id', 'isDNP', 'running', 'shortName'])

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h1>{pkg.shortName} settings</h1>
        </div>

        <Details _package={pkg} />

        <Logs
          id={id}
          logs={this.props.logs}
          logPackage={this.props.logPackage}
        />

        <Envs id={id} envs={pkg.envs} updateEnvs={this.props.updateEnvs} />

        <Controls
          state={pkg.state}
          togglePackage={this.props.togglePackage}
          restartPackage={this.props.restartPackage}
          restartPackageVolumes={this.props.restartPackageVolumes}
          removePackage={this.props.removePackage}
          removePackageAndData={this.props.removePackageAndData}
        />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  id: selector.getId,
  pkg: selector.getPackage,
  packageList: selector.getPackages,
  logs: selector.getLogs
});

const mapDispatchToProps = dispatch => {
  return {
    setId: id => {
      dispatch(action.setId(id));
    },
    updateEnvs(envs) {
      dispatch(action.updateEnvs({ envs, restart: true }));
    },
    logPackage: options => {
      dispatch(action.logPackage({ options }));
    },
    togglePackage: () => {
      dispatch(action.togglePackage());
    },
    restartPackage: () => {
      dispatch(action.restartPackage());
    },
    restartVolumes: () => {
      dispatch(action.restartVolumes());
    },
    removePackage: () => {
      dispatch(action.removePackage({ deleteVolumes: false }));
      dispatch(push("/" + NAME));
    },
    removePackageAndData: () => {
      dispatch(action.removePackage({ deleteVolumes: true }));
      dispatch(push("/" + NAME));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);

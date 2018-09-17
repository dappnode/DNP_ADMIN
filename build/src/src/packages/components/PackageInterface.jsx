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

    function getPortsFromManifest(pkg) {
      const manifest = pkg.manifest || {};
      let image = manifest.image || {};
      let packagePorts = image.ports || [];
      let ports = packagePorts.map(p => p.split(":")[0]);
      return ports;
    }

    const ports = getPortsFromManifest(pkg);

    // Merge current envs with default envs
    const envs = pkg.envs || {};
    const defaultEnvs = ((pkg.manifest || {}).image || {}).environment || [];
    defaultEnvs.forEach(env => {
      if (!envs[env]) envs[env] = "";
    });

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

        <Envs id={id} envs={envs} updateEnvs={this.props.updateEnvs} />

        <Controls
          state={pkg.state}
          togglePackage={() => this.props.togglePackage(id)}
          restartPackage={() => this.props.restartPackage(id)}
          restartVolumes={() => this.props.restartVolumes(id)}
          removePackage={() => this.props.removePackage(id, ports)}
          removePackageAndData={() =>
            this.props.removePackageAndData(id, ports)
          }
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateEnvs: (id, envs) => {
      dispatch(action.updatePackageEnv({ id, envs, restart: true }));
    },
    logPackage: (id, options) => {
      dispatch(action.logPackage({ id, options }));
    },
    togglePackage: id => {
      dispatch(action.togglePackage({ id }));
    },
    restartPackage: id => {
      dispatch(action.restartPackage({ id }));
    },
    restartVolumes: id => {
      dispatch(action.restartVolumes({ id }));
    },
    removePackage: (id, ports) => {
      dispatch(action.removePackage({ id, deleteVolumes: false }));
      if (ports.length) dispatch(action.closePorts({ action: "close", ports }));
      dispatch(push("/" + NAME));
    },
    removePackageAndData: (id, ports) => {
      dispatch(action.removePackage({ id, deleteVolumes: true }));
      if (ports.length) dispatch(action.closePorts({ action: "close", ports }));
      dispatch(push("/" + NAME));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);

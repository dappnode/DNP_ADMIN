import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
// Components
import Controls from "./PackageViews/Controls";
// Packages
import packages from "packages";

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

    function selectPorts(pkg) {
      const manifest = pkg.manifest || {};
      let image = manifest.image || {};
      let packagePorts = image.ports || [];
      let ports = packagePorts.map(p => p.split(":")[0]);
      return ports;
    }

    const ports = selectPorts(pkg);

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
          <span style={{ opacity: 0.3, fontWeight: 300 }}>System </span>
          {id}
        </div>

        <packages.components.Details _package={pkg} />

        <packages.components.Logs
          id={id}
          logs={this.props.logs}
          logPackage={options => this.props.logPackage(id, options)}
        />

        <packages.components.Envs
          id={id}
          envs={envs}
          updateEnvs={this.props.updateEnvs}
        />

        <Controls
          state={pkg.state}
          togglePackage={() => this.props.togglePackage(id)}
          restartPackage={() => this.props.restartPackage(id)}
          restartPackageVolumes={() => this.props.restartPackageVolumes(id)}
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

const mapDispatchToProps = dispatch => {
  return {
    updateEnvs: envs => {
      dispatch(action.updatePackageEnv({ envs, restart: true }));
    },
    logPackage: (id, options) => {
      dispatch(action.logPackage({ id, options }));
    },
    restartPackage: id => {
      dispatch(action.restartPackage({ id }));
    },
    restartVolumes: id => {
      dispatch(action.restartVolumes({ id }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);

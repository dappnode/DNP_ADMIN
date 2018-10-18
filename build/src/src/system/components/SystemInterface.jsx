import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
// Components
import Controls from "./SystemViews/Controls";
// Packages
import packages from "packages";

class SystemInterface extends React.Component {
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

        <packages.components.Envs id={id} pkg={pkg} />

        <Controls
          state={pkg.state}
          restartPackage={() => this.props.restartPackage(id)}
          restartPackageVolumes={() => this.props.restartPackageVolumes(id)}
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
    logPackage: (id, options) => {
      dispatch(action.logPackage({ id, options }));
    },
    restartPackage: id => {
      dispatch(action.restartPackage({ id }));
    },
    restartPackageVolumes: id => {
      dispatch(action.restartPackageVolumes({ id }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemInterface);

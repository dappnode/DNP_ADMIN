import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";

function getCurrentEnvs(pkg) {
  return pkg.envs || {};
}

function getDefaultEnvs(pkg) {
  const envsArray = ((pkg.manifest || {}).image || {}).environment || [];
  const defaultEnvs = {};
  for (const row of envsArray) {
    defaultEnvs[row.split("=")[0]] = row.split("=")[1] || "";
  }
  return defaultEnvs;
}

function getEnvs(_pkg, _state) {
  const pkg = { ..._pkg };
  const state = { ..._state };
  const defaultEnvs = getDefaultEnvs(pkg);
  const defaultEnvsNames = Object.keys(defaultEnvs);
  // Verify that the current state contains only this package's envs
  for (const env of Object.getOwnPropertyNames(state)) {
    if (!defaultEnvsNames.includes(env)) {
      delete state[env];
    }
  }
  return {
    ...defaultEnvs,
    ...getCurrentEnvs(pkg),
    ...state
  };
}

class EnvVariablesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeEnv = this.changeEnv.bind(this);
    this.updateEnvs = this.updateEnvs.bind(this);
  }

  changeEnv(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  updateEnvs() {
    const pkg = this.props.pkg || {};
    this.props.updateEnvs(this.props.id, getEnvs(pkg, this.state));
  }

  render() {
    const pkg = this.props.pkg || {};
    const envs = getEnvs(pkg, this.state);
    // const envs = pkg.envs || {};
    if (Object.getOwnPropertyNames(envs).length === 0) {
      return null;
    }

    let envsList = Object.getOwnPropertyNames(envs).map((env, i) => {
      return (
        <div key={i} className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">{env}</span>
          </div>
          <input
            type="text"
            className="form-control"
            name={env}
            value={envs[env]}
            onChange={this.changeEnv}
            aria-label={env}
            aria-describedby="basic-addon1"
          />
        </div>
      );
    });

    return (
      <React.Fragment>
        <div className="section-subtitle">Environment variables</div>
        <div className="card mb-4">
          <div className="card-body">
            {envsList}
            <button
              type="button"
              className="btn btn-outline-secondary tableAction-button"
              id={this.props.id}
              onClick={this.updateEnvs}
            >
              Update environment variables
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => {
  return {
    updateEnvs: (id, envs) => {
      dispatch(action.updatePackageEnv({ id, envs, restart: true }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnvVariablesView);

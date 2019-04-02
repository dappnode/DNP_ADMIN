import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";

function getCurrentEnvs(dnp) {
  return dnp.envs || {};
}

function getDefaultEnvs(dnp) {
  const envsArray = ((dnp.manifest || {}).image || {}).environment || [];
  const defaultEnvs = {};
  for (const row of envsArray) {
    defaultEnvs[row.split("=")[0]] = row.split("=")[1] || "";
  }
  return defaultEnvs;
}

function getEnvs(_dnp, _state) {
  const dnp = { ..._dnp };
  const state = { ..._state };
  const defaultEnvs = getDefaultEnvs(dnp);
  const defaultEnvsNames = Object.keys(defaultEnvs);
  // Verify that the current state contains only this package's envs
  for (const env of Object.keys(state)) {
    if (!defaultEnvsNames.includes(env)) {
      delete state[env];
    }
  }
  return {
    ...defaultEnvs,
    ...getCurrentEnvs(dnp),
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
    const dnp = this.props.dnp || {};
    this.props.updateEnvs(dnp.name, getEnvs(dnp, this.state));
  }

  render() {
    const dnp = this.props.dnp || {};
    const envs = getEnvs(dnp, this.state);
    // const envs = dnp.envs || {};
    if (Object.keys(envs).length === 0) {
      return null;
    }

    let envsList = Object.keys(envs).map((env, i) => {
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

const mapDispatchToProps = {
  updateEnvs: action.updatePackageEnv
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnvVariablesView);

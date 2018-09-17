import React from "react";

let envInputTag = "envPckgInput_";

export default class EnvVariables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envs: this.props.envs || {}
    };
  }

  changeEnv(env) {
    return function(e) {
      let envs = this.props.envs || {};
      envs[env] = e.target.value;
      this.setState({ envs });
    };
  }

  updateEnvs(e) {
    this.props.updateEnvs(this.props.id, {
      ...this.props.envs,
      ...this.state.envs
    });
  }

  render() {
    let envs = this.props.envs || {};
    if (Object.getOwnPropertyNames(envs).length === 0) {
      return null;
    }

    let envsList = Object.getOwnPropertyNames(envs).map((env, i) => {
      return (
        <div key={i} className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              {env}
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            id={envInputTag + i}
            value={envs[env]}
            onChange={this.changeEnv(env).bind(this)}
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
              onClick={this.updateEnvs.bind(this)}
            >
              Update environment variables
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

import React from "react";

export default class Envs extends React.Component {
  render() {
    const { envs, handleEnvChange } = this.props;

    // If no envs, return null
    if (!Object.keys(envs || {}).length) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Enviroment variables</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {Object.keys(envs).map((envName, i) => (
              <div key={i} className="form-row mb-3 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroupPrepend">
                    {envName}
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  name={envName}
                  placeholder={"enter value..."}
                  value={envs[envName]}
                  onChange={e => {
                    const { value, name } = e.target;
                    handleEnvChange({ value, name });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

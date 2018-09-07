import React from "react";

const Envs = ({ envs, handleEnvChange }) => (
  <React.Fragment>
    {Object.keys(envs).length ? (
      <h4 className="card-title">Environment Variables</h4>
    ) : null}
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
            handleEnvChange(name, value);
          }}
        />
      </div>
    ))}
  </React.Fragment>
);

export default Envs;

import React from "react";
import TableInput from "./TableInput";

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
            {/* HEADER */}
            <div class="row" style={{ opacity: 0.5 }}>
              <div class="col" style={{ paddingRight: "7.5px" }}>
                <h6>Name</h6>
              </div>
              <div class="col" style={{ paddingLeft: "7.5px" }}>
                <h6>Value</h6>
              </div>
            </div>

            {/* PSEUDO-TABLE */}
            {Object.keys(envs).map((envName, i) => (
              <React.Fragment>
                <div class="row">
                  <div class="col" style={{ paddingRight: "7.5px" }}>
                    <TableInput lock={true} value={envName} />
                  </div>

                  <div class="col" style={{ paddingLeft: "7.5px" }}>
                    <TableInput
                      placeholder={"enter value..."}
                      value={envs[envName]}
                      onChange={e => {
                        handleEnvChange({
                          value: e.target.value,
                          name: envName
                        });
                      }}
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

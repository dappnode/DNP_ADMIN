import React from "react";

export default class Vols extends React.Component {
  render() {
    const { vols, handleVolChange } = this.props;

    // If no vols, return null
    if (!Object.keys(vols || {}).length) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Volumes</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {Object.keys(vols).map((envName, i) => (
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
                  value={vols[envName]}
                  onChange={e => {
                    const { value, name } = e.target;
                    handleVolChange({ value, name });
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

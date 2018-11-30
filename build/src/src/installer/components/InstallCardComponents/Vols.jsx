import React from "react";

function parseVol(vol) {
  // HOST:CONTAINER:accessMode, return [HOST, CONTAINER:accessMode]
  return vol.split(/:(.+)/); // regex to split by first occurrence of ":"
}

export default class Vols extends React.Component {
  render() {
    const { userSetVols = {}, manifestVols = [], handleVolChange } = this.props;

    // If no vols, return null
    if (!manifestVols.length) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Volumes</div>
        <div className="card mb-4">
          <div
            className="card-body"
            style={{ paddingBottom: "0.25rem", textAlign: "right" }}
          >
            <span
              style={{
                opacity: 0.5,
                position: "relative",
                bottom: "6px",
                right: "6px"
              }}
            >
              Host path : Container path (: access mode)
            </span>
            {manifestVols.map((vol, i) => {
              // HOST:CONTAINER:accessMode
              let [hostPath, containerPath] = parseVol(vol);
              if (userSetVols[vol]) hostPath = parseVol(userSetVols[vol])[0];
              return (
                <div key={i} className="form-row mb-3 input-group">
                  <input
                    style={{ textAlign: "right" }}
                    type="text"
                    className="form-control"
                    placeholder={"enter volume path..."}
                    value={hostPath || ""}
                    onChange={e => {
                      handleVolChange({
                        newVol: `${e.target.value}:${containerPath}`,
                        vol
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">:</span>
                  </div>
                  <div className="input-group-append">
                    <span className="input-group-text">{containerPath}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

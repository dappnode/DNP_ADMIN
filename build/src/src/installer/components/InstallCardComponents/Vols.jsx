import React from "react";
import TableInput from "components/TableInput";

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
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {/* HEADER */}
            <div className="row" style={{ opacity: 0.5 }}>
              <div className="col" style={{ paddingRight: "7.5px" }}>
                <h6>Host path</h6>
              </div>
              <div className="col" style={{ paddingLeft: "7.5px" }}>
                <h6>Container path (:ro)</h6>
              </div>
            </div>

            {/* PSEUDO-TABLE */}
            {manifestVols.map((vol, i) => {
              // HOST:CONTAINER:accessMode
              let [hostPath, containerPath] = parseVol(vol);
              if (userSetVols[vol]) hostPath = parseVol(userSetVols[vol])[0];
              return (
                <div className="row" key={i}>
                  <div className="col" style={{ paddingRight: "7.5px" }}>
                    <TableInput
                      placeholder={"enter volume path..."}
                      value={hostPath || ""}
                      onChange={e => {
                        handleVolChange({
                          newVol: `${e.target.value}:${containerPath}`,
                          vol
                        });
                      }}
                    />
                  </div>

                  <div className="col" style={{ paddingLeft: "7.5px" }}>
                    <TableInput lock={true} value={containerPath} />
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

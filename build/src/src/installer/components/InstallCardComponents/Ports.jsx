import React from "react";
import TableInput from "./TableInput";

function parsePort(port) {
  // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
  if (port.includes(":")) return port.split(/:(.+)/);
  // CONTAINER/type, return [null, CONTAINER/type]
  else return [null, port];
}

export default class Ports extends React.Component {
  render() {
    const {
      userSetPorts = {},
      manifestPorts = [],
      handlePortChange
    } = this.props;

    // If no ports, return null
    if (!manifestPorts.length) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Ports</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {/* HEADER */}
            <div class="row" style={{ opacity: 0.5 }}>
              <div class="col" style={{ paddingRight: "7.5px" }}>
                <h6>Host port</h6>
              </div>
              <div class="col" style={{ paddingLeft: "7.5px" }}>
                <h6>Package port / type</h6>
              </div>
            </div>

            {/* PSEUDO-TABLE */}
            {manifestPorts.map((port, i) => {
              let [hostPort, containerPort] = parsePort(port); // split by first occurrence of ":"
              if (userSetPorts[port])
                hostPort = parsePort(userSetPorts[port])[0];
              return (
                <React.Fragment>
                  <div class="row">
                    <div class="col" style={{ paddingRight: "7.5px" }}>
                      <TableInput
                        placeholder={"ephemeral port (32768-65535)"}
                        value={hostPort || ""}
                        onChange={e => {
                          const newHostPort = e.target.value;
                          handlePortChange({
                            newPort: newHostPort.length
                              ? `${e.target.value}:${containerPort}`
                              : containerPort,
                            port
                          });
                        }}
                      />
                    </div>

                    <div class="col" style={{ paddingLeft: "7.5px" }}>
                      <TableInput lock={true} value={containerPort} />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

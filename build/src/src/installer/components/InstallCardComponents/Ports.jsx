import React from "react";

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
              Host port : Container port / type
            </span>
            {manifestPorts.map((port, i) => {
              let [hostPort, containerPort] = parsePort(port); // split by first occurrence of ":"
              if (userSetPorts[port])
                hostPort = parsePort(userSetPorts[port])[0];
              return (
                <div key={i} className="form-row mb-3 input-group">
                  <input
                    style={{ textAlign: "right" }}
                    type="text"
                    className="form-control"
                    placeholder={"a high random port will be assigned"}
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
                  <div className="input-group-append">
                    <span className="input-group-text">:</span>
                  </div>
                  <div className="input-group-append">
                    <span className="input-group-text">
                      {port.includes(":") ? port.split(":")[1] : port}
                    </span>
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

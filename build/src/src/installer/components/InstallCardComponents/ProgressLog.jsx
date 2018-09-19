import React from "react";
import "./loadBar.css";
// Components
// Logic

function progressBar(msg) {
  if (msg.includes("%")) {
    const array = msg.split("%")[0].split(" ");
    const num = array.slice(-1);
    return <div className="determinate" style={{ width: num + "%" }} />;
  } else if (msg.includes("...")) {
    return <div className="indeterminate" />;
  } else {
    return <div className="success" />;
  }
}

export default class ProgressLog extends React.Component {
  render() {
    const progressLog = this.props.progressLog || {};
    return (
      <React.Fragment>
        <div className="section-subtitle">
          {this.props.subtitle || "Installing..."}
        </div>
        <div className="card mb-4">
          <div className="card-body">
            {Object.keys(progressLog).map((pkg, i) => (
              <div key={i} className="row">
                <div className="col-6 text-truncate">{pkg}</div>
                <div className="col-6 text-truncate" style={{ height: "28px" }}>
                  <div
                    className="progress"
                    style={{
                      opacity: 0.4,
                      position: "relative",
                      bottom: "4px"
                    }}
                  >
                    {progressBar(progressLog[pkg])}
                  </div>
                  <div
                    className="text-center"
                    style={{
                      position: "relative",
                      bottom: "40px"
                    }}
                  >
                    {progressLog[pkg]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

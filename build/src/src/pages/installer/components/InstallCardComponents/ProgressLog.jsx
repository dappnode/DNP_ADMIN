import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import DnpName from "components/DnpName";
// Components
// Logic

function parsePercent(s) {
  // Return string before the first "%" and after the last " "
  if (s.includes("%")) {
    return s
      .split("%")[0]
      .split(" ")
      .slice(-1);
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
            {Object.keys(progressLog)
              // Don't show "core.dnp.dappnode.eth" actual progress log information
              .filter(pkg => pkg !== "core.dnp.dappnode.eth")
              .map((pkg, i) => {
                const msg = progressLog[pkg];
                const progressing = msg.includes("...");
                const percent = parsePercent(progressLog[pkg]);
                return (
                  <div key={i} className="row">
                    <div className="col-6 text-truncate">
                      <DnpName dnpName={pkg} />
                    </div>
                    <div
                      className="col-6 text-truncate"
                      style={{ height: "28px" }}
                    >
                      <ProgressBar
                        now={percent || 100}
                        animated={progressing}
                        label={msg}
                        variant={progressing || percent ? "" : "success"}
                      />
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

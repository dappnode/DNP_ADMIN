import React from "react";
import { isEmpty } from "lodash";
// Components
import ProgressBar from "react-bootstrap/ProgressBar";
import DnpName from "components/DnpName";
import Card from "components/Card";

function parsePercent(s) {
  // Return string before the first "%" and after the last " "
  if (s.includes("%")) {
    return s
      .split("%")[0]
      .split(" ")
      .slice(-1);
  }
}

export default function ProgressLogs({ progressLogs }) {
  if (isEmpty(progressLogs)) return null;

  return (
    <Card>
      {Object.entries(progressLogs)
        // Don't show "core.dnp.dappnode.eth" actual progress log information
        .filter(([dnpName]) => dnpName !== "core.dnp.dappnode.eth")
        .map(([dnpName, log]) => {
          const percent = parsePercent(log);
          const progressing = percent || log.includes("...");
          return (
            <div key={dnpName} className="row">
              <div className="col-6 text-truncate">
                <DnpName dnpName={dnpName} />
              </div>
              <div className="col-6 text-truncate" style={{ height: "28px" }}>
                <ProgressBar
                  now={percent || 100}
                  animated={progressing}
                  label={log}
                  variant={progressing ? "" : "success"}
                />
              </div>
            </div>
          );
        })}
    </Card>
  );
}

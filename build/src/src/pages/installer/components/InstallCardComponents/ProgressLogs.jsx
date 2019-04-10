import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
// Components
import ProgressBar from "react-bootstrap/ProgressBar";
import DnpName from "components/DnpName";
import Card from "components/Card";

function parsePercent(s = "") {
  if (!s.includes("%")) return null;
  // Return string before the first "%" and after the last " "
  return s
    .split("%")[0]
    .split(" ")
    .slice(-1);
}

function ProgressLogs({ progressLogs }) {
  if (isEmpty(progressLogs)) return null;

  return (
    <Card>
      {Object.entries(progressLogs)
        // Don't show "core.dnp.dappnode.eth" actual progress log information
        .filter(([dnpName]) => dnpName !== "core.dnp.dappnode.eth")
        .map(([dnpName, log = ""]) => {
          const percent = parsePercent(log);
          const progressing = percent || log.includes("...");
          return (
            <div key={dnpName} className="row">
              <div className="col-6 text-truncate">
                <DnpName dnpName={dnpName} />
              </div>
              <div className="col-6 text-truncate center">
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

/**
 * @param {Object} progressLogs = {
 *   "dnpName1.dnp.dappnode.eth": "Downloading 64%",
 *   "dnpName2.dnp.dappnode.eth": "Loading...",
 * }
 */
ProgressLogs.propTypes = {
  progressLogs: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
};

export default ProgressLogs;

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { shortNameCapitalized } from "utils/format";
// Components
import ProgressBar from "react-bootstrap/ProgressBar";
import Card from "components/Card";
import { stringIncludes } from "utils/strings";

/**
 * Return string before the first "%" and after the last " "
 * @param {string} s = "Downloading 65%"
 * @returns {string} percent
 */
function parsePercent(s) {
  return ((s || "").match(/\s(\d+?)%/) || [])[1];
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
          const progressing = percent || stringIncludes(log, "...");
          return (
            <div key={dnpName} className="row">
              <div className="col-6 text-truncate">
                <span>{shortNameCapitalized(dnpName)}</span>
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
 * @param {object} progressLogs = {
 *   "dnpName1.dnp.dappnode.eth": "Downloading 64%",
 *   "dnpName2.dnp.dappnode.eth": "Loading...",
 * }
 */
ProgressLogs.propTypes = {
  progressLogs: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
};

export default ProgressLogs;

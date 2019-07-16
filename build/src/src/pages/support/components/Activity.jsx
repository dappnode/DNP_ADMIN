import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { getUserActionLogs } from "services/userActionLogs/selectors";
// Components
import CardList from "components/CardList";
// Utils
import parseDate from "utils/parseDate";
import { stringifyObjSafe } from "utils/objects";
import { stringSplit } from "utils/strings";
// Own module
import "./activity.css";

const badgeClass = "badge badge-pill badge-";

function parseLevel(level) {
  if (level === "error") return "danger";
  if (level === "warn") return "warning";
  if (level === "info") return "success";
}

function Activity({ userActionLogs }) {
  function download() {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(userActionLogs, null, 2));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "DAppNodeLogs.json");
    dlAnchorElem.click();
  }

  return (
    <>
      <p>
        If a developer asks for more information regarding an error; please find
        the error in the list below, tap on it and copy everything in the
        expanded grey text area.
      </p>
      <button className="btn btn-dappnode mb-4" onClick={download}>
        Download all logs
      </button>
      <a id="downloadAnchorElem" style={{ display: "none" }} href="/">
        Download Anchor
      </a>

      {/* Activity list */}
      <CardList>
        {userActionLogs.map((log, i) => (
          <ActivityItem key={i} log={log} />
        ))}
      </CardList>
    </>
  );
}

function ActivityItem({ log }) {
  const [collapsed, setCollapsed] = useState(true);

  const type = parseLevel(log.level);
  const date = parseDate(log.timestamp);
  const eventShort = stringSplit(log.event, ".")[0];

  return (
    <div className="user-log">
      <div
        className="list-group-item-action log-container"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="d-flex justify-content-between">
          {/* Top row - left */}
          <div className="log-header">
            {/* Error badge */}
            {log.level === "warn" || log.level === "error" ? (
              <span className={badgeClass + type}>{log.level}</span>
            ) : null}
            {/* Count badge */}
            {log.count ? (
              <span className={badgeClass + "light"}>{log.count}</span>
            ) : null}
            {/* Call name */}
            <span className={"text-" + type}>
              <span className="call-to">Call to</span>{" "}
              <strong>{eventShort}</strong>
            </span>
          </div>
          {/* Top row - right */}
          <div className="date">{date}</div>
        </div>
        {/* Bottom row */}
        <span className="reply">Reply:</span> {log.message}
      </div>
      <div className={collapsed ? "hide" : "show"}>
        <div className={"error-stack" + (collapsed ? " hide" : "")}>
          {log.stack ? log.stack + "\n\n" : null}
          {log.kwargs ? "kwargs = " + stringifyObjSafe(log.kwargs) + "\n" : ""}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  userActionLogs: getUserActionLogs
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);

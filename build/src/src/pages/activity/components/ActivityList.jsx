import React, { useState } from "react";
import PropTypes from "prop-types";
import parseDate from "../parsers/parseDate";
import parseLevel from "../parsers/parseLevel";
import { stringifyObjSafe } from "utils/objects";
// Components
import CardList from "components/CardList";

const badgeClass = "badge badge-pill badge-";

function ActivityItem({ log }) {
  const [collapsed, setCollapsed] = useState(true);

  const type = parseLevel(log.level);
  const date = parseDate(log.timestamp);
  const eventShort = (log.event || "").split(".")[0];

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

const Activity = ({ userActionLogs }) => (
  <CardList>
    {userActionLogs.map((log, i) => (
      <ActivityItem key={i} log={log} />
    ))}
  </CardList>
);

Activity.propTypes = {
  userActionLogs: PropTypes.arrayOf(
    PropTypes.shape({
      event: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      stack: PropTypes.string,
      name: PropTypes.string,
      kwargs: PropTypes.object
    })
  ).isRequired
};

export default Activity;

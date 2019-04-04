import React from "react";
import PropTypes from "prop-types";
import parseDate from "../parsers/parseDate";
import parseLevel from "../parsers/parseLevel";
import { stringifyObjSafe } from "utils/objects";
// Components
import CardList from "components/CardList";

const badgeClass = "badge badge-pill badge-";

const Activity = ({ userActionLogs }) => (
  <CardList>
    {userActionLogs.map((log, i) => {
      const type = parseLevel(log.level);
      const date = parseDate(log.timestamp);
      const eventShort = (log.event || "").split(".")[0];

      return (
        <div key={i} className="user-log">
          <div
            data-toggle="collapse"
            data-target={"#collapseStack" + i}
            className="list-group-item-action log-container"
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
          {/* Collapsed stack. Must have inline style as the class changes */}
          <div
            className="collapse"
            id={"collapseStack" + i}
            style={{ paddingTop: 0 }}
          >
            <div className="error-stack">
              {log.stack ? log.stack + "\n\n" : null}
              {log.kwargs
                ? "kwargs = " + stringifyObjSafe(log.kwargs) + "\n"
                : ""}
            </div>
          </div>
        </div>
      );
    })}
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

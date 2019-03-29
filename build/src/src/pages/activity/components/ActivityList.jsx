import React from "react";
import PropTypes from "prop-types";
import parseDate from "../parsers/parseDate";
import parseLevel from "../parsers/parseLevel";
import { stringifyObjSafe } from "utils/objects";

const badgeClass = "badge badge-pill badge-";

const Activity = ({ userActionLogs }) => (
  <div className="card mb-4">
    <div className="table-responsive">
      <ul className="list-group user-logs">
        {userActionLogs.map((log, i) => {
          // log = {
          //   event: "installPackage.dappmanager.dnp.dappnode.eth",
          //   kwargs: {
          //     id: "rinkeby.dnp.dappnode.eth",
          //     userSetVols: {},
          //     userSetPorts: {},
          //     options: {}
          //   },
          //   level: "error",
          //   message: "Timeout to cancel expired",
          //   name: "Error",
          //   stack: "Error: Timeout to cancel expired↵   ",
          //   timestamp: "2019-02-01T19:09:16.503Z"
          // };
          const type = parseLevel(log.level);
          const date = parseDate(log.timestamp);
          const eventShort = (log.event || "").split(".")[0];

          return (
            <li key={i} className="list-group-item user-log">
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
              {/* Collapsed stack */}
              <div className="collapse" id={"collapseStack" + i}>
                <div className="error-stack">
                  {log.stack ? log.stack + "\n\n" : null}
                  {log.kwargs
                    ? "kwargs = " + stringifyObjSafe(log.kwargs) + "\n"
                    : ""}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

Activity.propTypes = {
  userActionLogs: PropTypes.array.isRequired
};

export default Activity;

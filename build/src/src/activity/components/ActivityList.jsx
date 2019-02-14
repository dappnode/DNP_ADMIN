import React from "react";
import PropTypes from "prop-types";

export default class Activity extends React.Component {
  static propTypes = {
    userActionLogs: PropTypes.array.isRequired
  };

  render() {
    function parseLevel(level) {
      if (level === "error") return "danger";
      if (level === "warn") return "warning";
      if (level === "info") return "success";
    }

    function formatDate(rawDate) {
      let date = new Date(rawDate);
      let now = new Date();
      if (sameDay(date, now)) {
        const minAgo = Math.floor((now - date) / 1000 / 60);
        if (minAgo < 30) {
          return "Today, " + minAgo + " min ago";
        }
        return "Today, " + date.toLocaleTimeString();
      }
      return date.toLocaleString();
    }

    function sameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    }

    const userActionLogs = this.props.userActionLogs;
    const userActionLogsItems = userActionLogs.map((log, i) => {
      // Only display inner borders, by removing all external borders
      let style = { borderLeftWidth: "0", borderRightWidth: "0" };
      if (i === 0) style.borderTopWidth = "0";
      if (i === userActionLogs.length - 1) style.borderBottomWidth = "0";
      let type = parseLevel(log.level);
      let date = formatDate(log.timestamp);

      // if (log.stack) {
      //   stack = log.stack.split("\n");
      //   stackItems = stack.map(e => {
      //     return <div>{e}</div>;
      //   });
      // }
      const errorBadge =
        log.level === "warn" || log.level === "error" ? (
          <span className={"badge badge-pill mr-2 badge-" + type}>
            {log.level}
          </span>
        ) : null;

      const countBadge = log.count ? (
        <span className="badge badge-pill mr-2 badge-light">{log.count}</span>
      ) : null;
      const eventShort = log.event.split(".")[0];
      // const corePacakge = log.event.split(".")[1];
      return (
        <li
          key={i}
          className={"list-group-item"}
          style={{ ...style, padding: 0 }}
        >
          <div
            data-toggle="collapse"
            data-target={"#collapseStack" + i}
            aria-expanded="false"
            aria-controls="collapseExample"
            className="list-group-item-action"
            style={{ padding: ".75rem 1.25rem" }}
          >
            <div className="d-flex justify-content-between">
              <div className="log-header">
                {errorBadge}
                {countBadge}
                <span className={"text-" + type}>
                  <span style={{ opacity: 0.7 }}>Call to</span>{" "}
                  <strong>{eventShort}</strong>
                </span>
              </div>
              <div
                className="log-header"
                style={{ fontSize: "90%", opacity: 0.6 }}
              >
                {date}
              </div>
            </div>
            <span style={{ opacity: 0.4 }}>Reply:</span> {log.message}
          </div>
          <div
            className="collapse"
            id={"collapseStack" + i}
            style={{ padding: ".75rem 1.25rem" }}
          >
            <div className="error-stack">
              {log.stack ? log.stack + "\n\n" : null}
              {log.kwargs
                ? "kwargs = " + JSON.stringify(log.kwargs, null, 2) + "\n"
                : ""}
            </div>
          </div>
        </li>
      );
    });

    // userActionLogs

    return (
      <div className="card mb-4">
        <div className="card-body" style={{ padding: "0px" }}>
          <div className="table-responsive">
            <ul className="list-group">{userActionLogsItems}</ul>
          </div>
        </div>
      </div>
    );
  }
}

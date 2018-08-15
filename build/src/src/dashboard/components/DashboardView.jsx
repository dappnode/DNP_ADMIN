import React from "react";
import parseType from "utils/parseType";
import Activity from "./Activity";

import "./dashboard.css";

export default class DashboardInterface extends React.Component {
  render() {
    let chainIds = Object.keys(this.props.chains);
    const chainsStatus = chainIds.map((id, i) => {
      let e = this.props.chains[id];
      let type = parseType(e.status);
      // Only display inner borders, by removing all external borders
      let style = { borderLeftWidth: "0", borderRightWidth: "0" };
      if (i === 0) style.borderTopWidth = "0";
      if (i === chainIds.length - 1) style.borderBottomWidth = "0";
      return (
        <li key={i} className={"list-group-item text-" + type} style={style}>
          <strong style={{ textTransform: "capitalize" }}>{id + ": "}</strong>
          {e.msg}
        </li>
      );
    });

    let statusIds = Object.keys(this.props.status);
    const dappnodeStatus = statusIds
      .filter(e => e !== "mainnet")
      .map((id, i) => {
        let e = this.props.status[id];
        let type = parseType(e.status);
        // Only display inner borders, by removing all external borders
        let style = { borderLeftWidth: "0", borderRightWidth: "0" };
        if (i === 0) style.borderTopWidth = "0";
        if (i === statusIds.length - 1) style.borderBottomWidth = "0";
        return (
          <li key={i} className={"list-group-item text-" + type} style={style}>
            <strong style={{ textTransform: "capitalize" }}>{id + ": "}</strong>
            {e.msg}
          </li>
        );
      });

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

    // userActionLogs

    return (
      <div>
        <h1>Status</h1>

        <div className="row">
          <div className="col">
            <div className="card mb-4">
              <div className="card-header">DAppNode</div>
              <div className="card-body" style={{ padding: "0px" }}>
                <div className="table-responsive">
                  <ul className="list-group">{dappnodeStatus}</ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card mb-4">
              <div className="card-header">Chains</div>
              <div className="card-body" style={{ padding: "0px" }}>
                <div className="table-responsive">
                  <ul className="list-group">{chainsStatus}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1>Activity</h1>
        <Activity userActionLogs={this.props.userActionLogs} />
      </div>
    );
  }
}

import React from "react";
import parseType from "utils/parseType";
import { NavLink } from "react-router-dom";

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

    // userActionLogs

    return (
      <div>
        <h1>Status</h1>
        <div className="row">
          <div className="col-sm">
            <div className="card mb-4">
              <div className="card-header">DAppNode</div>
              <div className="card-body" style={{ padding: "0px" }}>
                <div className="table-responsive">
                  <ul className="list-group">{dappnodeStatus}</ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm">
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
        <NavLink to={"/activity"}>
          <button className="btn btn-outline-secondary ml-2 mr-2" type="button">
            Go to activity
          </button>
        </NavLink>
      </div>
    );
  }
}

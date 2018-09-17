import React from "react";
import { colors } from "utils/format";

import "./dashboard.css";

export default class DashboardInterface extends React.Component {
  render() {
    // Color coding
    function statusToColor(status) {
      if (status === 1) return colors.success;
      if (status === 0) return colors.default;
      if (status === -1) return colors.error;
    }

    // From object to array
    const status = this.props.status || {};
    const statusArray = Object.keys(status)
      .filter(id => id !== "mainnet")
      .map(id => ({
        color: statusToColor(status[id].status),
        id,
        msg: status[id].msg
      }));
    const chains = this.props.chains || {};
    const chainsArray = Object.keys(chains).map(id => ({
      color: statusToColor(chains[id].status),
      id,
      msg: chains[id].msg
    }));

    function getStatusCard(array = []) {
      return (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              {array.map((e, i) => (
                <div
                  key={i}
                  className="col-xl-3 col-md-4 col-sm-6 col-xs-12"
                  style={{ textTransform: "capitalize", overflow: "hidden" }}
                >
                  <span>{e.id + ": "}</span>
                  <span
                    className={"badge badge-primary"}
                    style={{ fontSize: "85%", backgroundColor: e.color }}
                  >
                    {e.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="section-title">Status</div>
        <div className="section-subtitle">DAppNode</div>
        {getStatusCard(statusArray)}
        <div className="section-subtitle">Chains</div>
        {getStatusCard(chainsArray)}
      </div>
    );
  }
}

import React from "react";

import "./dashboard.css";

export default class DashboardInterface extends React.Component {
  render() {
    // Color coding
    function statusToColor(status) {
      if (status === 1) return "#1ccec0";
      if (status === 0) return "#ffff00";
      if (status === -1) return "#ff0000";
    }
    function statusToIcon(status) {
      if (status === 1) return "✓";
      if (status === 0) return "⚠";
      if (status === -1) return "✕";
    }

    // From object to array
    const status = this.props.status || {};
    const statusArray = Object.keys(status)
      .filter(id => id !== "mainnet")
      .map(id => ({
        color: statusToColor(status[id].status),
        icon: statusToIcon(status[id].status),
        id,
        msg: status[id].msg
      }));
    const chains = this.props.chains || {};
    const chainsArray = Object.keys(chains).map(id => ({
      color: statusToColor(chains[id].status),
      icon: statusToIcon(chains[id].status),
      id,
      msg: chains[id].msg
    }));

    function getStatusCard(array = []) {
      return (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              {array.map((e, i) => (
                <div key={i} className="col-xl-3 col-md-4 col-sm-6 col-xs-12">
                  <span style={{ color: e.color, fontWeight: 800 }}>
                    {e.icon + " "}
                  </span>
                  <span
                    style={{ textTransform: "capitalize", overflow: "hidden" }}
                  >
                    <strong>{e.id + ": "}</strong>
                  </span>
                  {e.msg}
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

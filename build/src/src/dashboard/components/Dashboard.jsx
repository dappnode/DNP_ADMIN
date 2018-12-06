import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import * as selectors from "../selectors";
import { createStructuredSelector } from "reselect";
// modules
import status from "status";

import "./dashboard.css";

let token;

class DashboardView extends React.Component {
  componentDidMount() {
    // Start interval
    this.props.getDappnodeStats();
    token = setInterval(this.props.getDappnodeStats, 5 * 1000);
  }
  componentWillUnmount() {
    clearInterval(token);
  }

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

    // STATUS From object to array
    const status = this.props.status || {};
    const statusArray = Object.keys(status)
      .filter(id => id !== "mainnet")
      .map(id => ({
        color: statusToColor(status[id].status),
        icon: statusToIcon(status[id].status),
        id,
        msg: status[id].msg
      }));

    // ChainData, from data array to formated array
    const chainData = this.props.chainData || [];
    const chainDataArray = chainData.map(chain => {
      const status = chain.error ? -1 : chain.syncing ? 0 : 1;
      return {
        color: statusToColor(status),
        icon: statusToIcon(status),
        id: chain.name,
        msg: chain.msg
      };
    });

    // DAPPNODE STATS From object to array
    const dappnodeStats = this.props.dappnodeStats || {};
    const dappnodeStatsArray = Object.keys(dappnodeStats)
      .filter(
        id => dappnodeStats[id] && !String(dappnodeStats[id]).includes("NaN")
      )
      .map(id => {
        const text = String(dappnodeStats[id]);
        const value = parseFloat(dappnodeStats[id]);
        let status;
        if (value > 90) status = -1;
        else if (value > 85) status = 0;
        else status = 1;
        return {
          color: statusToColor(status),
          icon: statusToIcon(status),
          id,
          msg: text.includes("%") ? text : `${text}%`
        };
      });

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
        {getStatusCard(chainDataArray)}
        <div className="section-subtitle">DAppNode stats</div>
        {getStatusCard(dappnodeStatsArray)}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  status: status.selectors.getAll,
  chainData: selectors.chainData,
  dappnodeStats: selectors.dappnodeStats
});

const mapDispatchToProps = dispatch => {
  return {
    getDappnodeStats: () => {
      dispatch(action.getDappnodeStats());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);

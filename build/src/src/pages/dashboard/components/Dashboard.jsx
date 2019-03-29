import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import { getDappnodeVolumes } from "services/dnpInstalled/selectors";
import { getChainData } from "services/chainData/selectors";
import { getDappnodeStats } from "services/dappnodeStatus/selectors";

import "./dashboard.css";

let token;

class DashboardView extends React.Component {
  componentDidMount() {
    // Start interval
    this.props.fetchDappnodeStats();
    token = setInterval(this.props.fetchDappnodeStats, 5 * 1000);
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

    // ChainData, from data array to formatted array
    const chainData = this.props.chainData || [];
    const chainDataArray = chainData.map(chain => {
      const status = chain.error ? -1 : chain.syncing ? 0 : 1;
      return {
        color: statusToColor(status),
        icon: statusToIcon(status),
        id: chain.name,
        msg: chain.message
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
          id: id.includes("usage") ? id : `${id} usage`,
          msg: text.includes("%") ? text : `${text}%`
        };
      });

    const dappnodeVolumes = this.props.dappnodeVolumes || [];
    const dappnodeVolumesArray = dappnodeVolumes.map(volume => ({
      color: statusToColor(1),
      icon: statusToIcon(1),
      id: volume.name,
      msg: volume.size
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
        {getStatusCard(chainDataArray)}
        <div className="section-subtitle">DAppNode stats</div>
        {getStatusCard([...dappnodeStatsArray, ...dappnodeVolumesArray])}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  chainData: getChainData,
  dappnodeStats: getDappnodeStats,
  dappnodeVolumes: getDappnodeVolumes
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchDappnodeStats
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);

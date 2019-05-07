import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import { getDappnodeVolumes } from "services/dnpInstalled/selectors";
import { getChainData } from "services/chainData/selectors";
import { getDappnodeStats } from "services/dappnodeStatus/selectors";
// Own module
import { title } from "../data";
import ChainCard from "./ChainCard";
import StatsCard from "./StatsCard";
import VolumeCard from "./VolumeCard";
import "./dashboard.css";
// Components
import SubTitle from "components/SubTitle";
import Title from "components/Title";

/**
 * @param {array} chainData = [{
 *   name: "Mainnet",
 *   message: "Syncing 4785835/3748523",
 *   progress: 0.647234,
 *   syncing: true
 * }, ... ]
 * @param {object} dappnodeStats = {
 *   cpu: 35%,
 *   disk: 86%,
 *   memory: 56%
 * }
 * @param {array} dappnodeVolumes = [{
 *   name: "Ethchain size",
 *   size: "53.45 GB"
 * }, ... ]
 */

function Dashboard({
  chainData,
  dappnodeStats,
  dappnodeVolumes,
  fetchDappnodeStats
}) {
  useEffect(() => {
    const interval = setInterval(fetchDappnodeStats, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Title title={title} />

      <SubTitle>Chains</SubTitle>
      <div className="dashboard-cards">
        {chainData.map(chain => (
          <ChainCard key={chain.name} {...chain} />
        ))}
      </div>

      <SubTitle>Machine stats</SubTitle>
      <div className="dashboard-cards">
        {Object.entries(dappnodeStats).map(([id, percent]) => (
          <StatsCard key={id} id={id} percent={percent} />
        ))}
      </div>

      <SubTitle>Volumes</SubTitle>
      <div className="dashboard-cards">
        {dappnodeVolumes.map(vol => (
          <VolumeCard key={vol.name} {...vol} />
        ))}
      </div>
    </>
  );
}

Dashboard.propTypes = {
  chainData: PropTypes.array.isRequired,
  dappnodeStats: PropTypes.object.isRequired,
  dappnodeVolumes: PropTypes.array.isRequired
};

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
)(Dashboard);

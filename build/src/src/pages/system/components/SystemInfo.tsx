import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import {
  getDappnodeStats,
  getVolumes
} from "services/dappnodeStatus/selectors";
// Own module
import { volumeRemove } from "../actions";
import VolumesGrid from "./VolumesGrid";
import StatsCard from "pages/dashboard/components/StatsCard";
// Components
import SubTitle from "components/SubTitle";
import { VolumeData, HostStats } from "types";

function SystemInfo({
  dappnodeStats,
  volumes,
  fetchDappnodeStats,
  volumeRemove
}: {
  dappnodeStats: HostStats;
  volumes: VolumeData[];
  fetchDappnodeStats: () => void;
  volumeRemove: (name: string) => void;
}) {
  useEffect(() => {
    const interval = setInterval(fetchDappnodeStats, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [fetchDappnodeStats]);

  return (
    <>
      <SubTitle>Machine stats</SubTitle>
      <div className="dashboard-cards">
        {Object.entries(dappnodeStats).map(([id, percent]) => (
          <StatsCard key={id} id={id} percent={percent} />
        ))}
      </div>

      <SubTitle>Volumes</SubTitle>
      <VolumesGrid {...{ volumes, volumeRemove }} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  dappnodeStats: getDappnodeStats,
  volumes: getVolumes
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchDappnodeStats,
  volumeRemove
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemInfo);

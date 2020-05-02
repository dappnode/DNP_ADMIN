import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import { getDappnodeStats } from "services/dappnodeStatus/selectors";
// Own module
import VolumesGrid from "./VolumesGrid";
import StatsCard from "pages/dashboard/components/StatsCard";
// Components
import SubTitle from "components/SubTitle";

export default function SystemInfo() {
  const dappnodeStats = useSelector(getDappnodeStats);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchDappnodeStats), 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <>
      <SubTitle>Machine stats</SubTitle>
      <div className="dashboard-cards">
        {Object.entries(dappnodeStats).map(([id, percent]) => (
          <StatsCard key={id} id={id} percent={percent} />
        ))}
      </div>

      <SubTitle>Volumes</SubTitle>
      <VolumesGrid />
    </>
  );
}

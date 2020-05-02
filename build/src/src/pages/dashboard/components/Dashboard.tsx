import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import "./dashboard.scss";
// Components
import SubTitle from "components/SubTitle";
import Title from "components/Title";

export default function Dashboard() {
  const chainData = useSelector(getChainData);
  const dappnodeStats = useSelector(getDappnodeStats);
  const dappnodeVolumes = useSelector(getDappnodeVolumes);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchDappnodeStats), 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <>
      <Title title={title} />

      <SubTitle>Chains</SubTitle>
      <div className="dashboard-cards">
        {chainData.map(chain => (
          <ChainCard key={chain.dnpName} {...chain} />
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

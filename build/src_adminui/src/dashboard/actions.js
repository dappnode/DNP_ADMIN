// DASHBOARD
import t from "./actionTypes";

export const updateDappnodeStats = ({ stats }) => ({
  type: t.UPDATE_DAPPNODE_STATS,
  stats
});

export const getDappnodeStats = () => ({
  type: t.GET_DAPPNODE_STATS
});

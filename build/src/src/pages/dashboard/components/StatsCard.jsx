import React from "react";
import PropTypes from "prop-types";
import Card from "components/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

function parseVariant(value) {
  if (value > 90) return "danger";
  if (value > 75) return "warning";
  return "success";
}

function StatsCard({ id, percent }) {
  const value = parseInt(percent);
  return (
    <Card className="stats-card">
      <div className="header">
        <span className="id">{id}</span> <span className="usage">usage</span>
      </div>
      <ProgressBar variant={parseVariant(value)} now={value} label={percent} />
    </Card>
  );
}

StatsCard.propTypes = {
  id: PropTypes.string.isRequired,
  percent: PropTypes.string.isRequired
};

export default StatsCard;

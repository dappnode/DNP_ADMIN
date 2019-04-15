import React from "react";
import PropTypes from "prop-types";
import Card from "components/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

function ChainCard({ name, message, progress, error, syncing }) {
  const progressPercent = Math.floor(100 * progress);
  return (
    <Card className="chain-card">
      <div className="name">{name}</div>

      {syncing ? (
        <ProgressBar
          now={progressPercent}
          animated={true}
          label={`${progressPercent}%`}
        />
      ) : error ? (
        <ProgressBar now={100} variant="danger" />
      ) : (
        <ProgressBar now={100} variant="success" />
      )}

      <div className="message">{message}</div>
    </Card>
  );
}

ChainCard.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  syncing: PropTypes.bool.isRequired,
  progress: PropTypes.number
};

export default ChainCard;

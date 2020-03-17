import React from "react";
import PropTypes from "prop-types";
import Card from "components/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import RenderMarkdown from "components/RenderMarkdown";

function ChainCard({
  name,
  message,
  progress,
  error,
  syncing
}: {
  name: string;
  message: string;
  progress?: number;
  error: boolean;
  syncing: boolean;
}) {
  return (
    <Card className="chain-card">
      <div className="name">{name}</div>

      {syncing ? (
        typeof progress === "number" && (
          <ProgressBar
            now={progress * 100}
            animated={true}
            label={`${Math.floor(progress * 100)}%`}
          />
        )
      ) : error ? (
        <ProgressBar now={100} variant="danger" />
      ) : (
        <ProgressBar now={100} variant="success" />
      )}

      <div className="message">
        <RenderMarkdown source={message} noMargin />
      </div>
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

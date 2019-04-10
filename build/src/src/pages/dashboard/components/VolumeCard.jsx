import React from "react";
import PropTypes from "prop-types";
import Card from "components/Card";

function VolumeCard({ name, size }) {
  return (
    <Card className="volume-card">
      <div className="name">{name}</div>
      <div className="size">{size}</div>
    </Card>
  );
}

VolumeCard.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired
};

export default VolumeCard;

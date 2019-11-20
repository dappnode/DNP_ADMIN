import React from "react";
import PropTypes from "prop-types";
import Card from "components/Card";
import { prettyBytes } from "utils/format";

function VolumeCard({ name, size }) {
  return (
    <Card className="volume-card">
      <div className="name">{name}</div>
      <div className="size">{prettyBytes(size)}</div>
    </Card>
  );
}

VolumeCard.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
};

export default VolumeCard;

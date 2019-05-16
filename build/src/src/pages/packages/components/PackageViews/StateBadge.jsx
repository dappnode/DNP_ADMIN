import React from "react";
import PropTypes from "prop-types";

function StateBadge({ state }) {
  const styleColor =
    state === "running"
      ? "success"
      : state === "exited"
      ? "danger"
      : "secondary";
  return (
    <span
      className={`stateBadge center badge-${styleColor}`}
      style={{ opacity: 0.85 }}
    >
      {state}
    </span>
  );
}

StateBadge.propTypes = {
  state: PropTypes.string.isRequired
};

export default StateBadge;

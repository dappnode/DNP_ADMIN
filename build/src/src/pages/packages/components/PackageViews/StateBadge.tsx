import React from "react";
import PropTypes from "prop-types";
import { ContainerStatus } from "types";

function StateBadge({ state }: { state: ContainerStatus }) {
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
      <span className="content">{state}</span>
    </span>
  );
}

StateBadge.propTypes = {
  state: PropTypes.string.isRequired
};

export default StateBadge;

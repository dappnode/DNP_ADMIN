import React from "react";
import PropTypes from "prop-types";
import { colors } from "utils/format";

function StateBadge({ state }) {
  return (
    <span
      className="stateBadge center"
      style={{
        backgroundColor:
          state === "running"
            ? colors.success
            : state === "exited"
            ? colors.error
            : colors.default
      }}
    >
      {state}
    </span>
  );
}

StateBadge.propTypes = {
  state: PropTypes.string.isRequired
};

export default StateBadge;

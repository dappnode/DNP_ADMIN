import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getChainData } from "services/chainData/selectors";
// Icons
import Link from "Icons/Link";

const ChainData = ({ chainData }) => {
  return (
    <BaseDropdown
      name="Chain status"
      messages={chainData.map((chain = {}) => ({
        title: chain.name,
        body: chain.message,
        type: chain.error ? "danger" : chain.syncing ? "warning" : "success",
        progress: chain.progress
      }))}
      Icon={Link}
      // Right position of the dropdown to prevent clipping on small screens
      offset={"-99px"}
    />
  );
};

ChainData.propTypes = {
  chainData: PropTypes.array.isRequired
};

const mapStateToProps = createStructuredSelector({
  chainData: getChainData
});

export default connect(
  mapStateToProps,
  null
)(ChainData);
